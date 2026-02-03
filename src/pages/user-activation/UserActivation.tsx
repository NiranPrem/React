import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAcceptRequest,
  fetchUserActivationRequest,
  fetchUserRequest,
} from "../../store/reducers/authSlice";
import type { RootState } from "../../store/store";
import { useMsal } from "@azure/msal-react";
import { apiRequest, loginAzureRequest } from "../../services/common";

const UserActivation: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // 🔑 read token from URL
  const dispatch = useDispatch();
  const { loading, activate, error, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { instance } = useMsal();

  const activateAccount = async () => {
    if (!token) {
      return;
    }
    dispatch(fetchUserActivationRequest({ token }));
  };

  // --- Optional: auto-activate when page loads ---
  useEffect(() => {
    if (token) {
      activateAccount();
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserRequest());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      let userRoles: string[] = [];
      if (Array.isArray(user.role)) {
        userRoles = user.role.filter(Boolean);
      } else if (user.role) {
        userRoles = [user.role];
      } else {
        userRoles = [];
      }
      // Define route mapping for known roles
      const roleRoutes: Record<string, string> = {
        BUSINESSUNITHEAD: "/requests",
        HRADMIN: "/jobs",
        RECRUITER: "/jobs",
        INTERVIEWS: "/interviews",
        CANDIDATE: "/candidate",
        EMPLOYEE: "/referrals",
      };
      // If no valid roles at all
      if (userRoles.length === 0) {
        navigate("/no-roles");
        return;
      }
      // If user has multiple roles:
      // pick the first role that has a defined route
      const validRoles = userRoles.filter((r) => roleRoutes[r]);
      if (validRoles.length > 0) {
        const primaryRole = validRoles[0];
        navigate(roleRoutes[primaryRole]);
      } else {
        // No recognized roles → go to "no role" page
        navigate("/no-roles");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true); // show loader before popup opens
      await instance.loginPopup(loginAzureRequest);
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0) return;
      const silentRequest = { ...apiRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(silentRequest);
      // Dispatch saga to backend
      dispatch(
        fetchUserAcceptRequest({
          azureAccessToken: tokenResponse.accessToken,
          userToken: token,
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false); // hide loader after process ends
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-r from-orange-300 to-purple-300 relative px-4">
      {/* --- Title --- */}
      <h1 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-4">
        Welcome to ATS!
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        {error ?? "Please click the button below to activate your account."}
      </p>
      {/* --- Loader --- */}
      {loading || isLoggingIn ? (
        <AtsLoader />
      ) : (
        <>
          {/* --- Buttons --- */}
          <div className="flex gap-4">
            {activate?.success && !error && (
              <Button
                type="button"
                label="Activate"
                icon="pi pi-check"
                onClick={handleLogin}
                className="!bg-blue-500 !border-blue-500 !text-white hover:!bg-blue-600"
              />
            )}
            {/* Button */}
          </div>
          {error && (
            <Link
              to="/login"
              className="bg-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded hover:bg-blue-300 transition"
            >
              Go To Login
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default UserActivation;
