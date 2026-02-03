import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  adLoginRequest,
  fetchUserRequest,
} from "../../store/reducers/authSlice";
import type { RootState } from "../../store/store";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import { apiRequest, loginAzureRequest } from "../../services/common";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useMsal();

  const { loading, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // 🔹 Local state to show loader while popup is active
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
        adLoginRequest({
          azureAccessToken: tokenResponse.accessToken,
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false); // hide loader after process ends
    }
  };

  const showLoader = loading || isLoggingIn;

  return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F5] text-[#182953]">
      {showLoader && <AtsLoader />}
      {!isAuthenticated && (
        <div className="w-full flex flex-col justify-center items-center p-8 ">
          <h1 className="text-2xl font-bold mb-2">{t("common.welcome")}</h1>
          <h2 className="text-lg mb-4">Login to your account to continue</h2>
          <button
            type="button"
            className="w-sm bg-[#3BA268] hover:bg-[#339155] text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 23 23"
              className="mr-2"
            >
              <rect width="10" height="10" x="0" y="0" fill="#FFFFFF" />
              <rect width="10" height="10" x="12" y="0" fill="#FFFFFF" />
              <rect width="10" height="10" x="0" y="12" fill="#FFFFFF" />
              <rect width="10" height="10" x="12" y="12" fill="#FFFFFF" />
            </svg>
            {isLoggingIn
              ? "Opening Microsoft Login..."
              : "Sign in with Microsoft"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
