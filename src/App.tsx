import { useEffect, useRef, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import PrivateRoute from "./shared/utils/PrivateRoute";
import Login from "./pages/login/Login";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy";

import { Toast } from "primereact/toast";
import ToastService from "./services/toastService";
import "./services/i18n";
import AppLayout from "./shared/components/app-layout/AppLayout";
import OpeningOverview from "./pages/job-opening/job-opening-overview/OpeningOverview";
import PageNotFound from "./pages/page-not-found/PageNotFound";
import UserActivation from "./pages/user-activation/UserActivation";
import CreateOpening from "./pages/job-opening/job-opening-overview/components/overview-tab/CreateOpening";
import JobOpening from "./pages/job-opening/JobOpening";
import Candidates from "./pages/candidates/Candidates";
import CandidateOverview from "./pages/candidates/candidates-overview/CandidateOverview";
import CreateCandidate from "./shared/components/create-update-candidate/CreateCandidate";
import JobRequest from "./pages/job-request/JobRequest";
import JobRequestOverview from "./pages/job-request/job-request-overview/JobRequestOverview";
import CreateRequest from "./pages/job-request/job-request-overview/components/overview-tab/CreateRequest";
import Referrals from "./pages/referrals/Referrals";
import ReferralOverview from "./pages/referrals/referrals-overview/ReferralOverview";
import CreateReferral from "./pages/referrals/referrals-overview/components/overview-tab/CreateReferral";
import Event from "./pages/event/Event";
import TopCenterNotification from "./shared/components/notification/TopCenterNotification";
import { SignalRProvider } from "./contexts/SignalRProvider";
import ReferralJobOpeningDetails from "./pages/referrals/components/ReferralJobOpeningDetails";
import NoRoles from "./pages/no-roles/NoRoles";
import Interviews from "./pages/interviews/Interviews";
import UserManagement from "./pages/user-management/UserManagement";
import CreateInterviews from "./shared/components/create-update-interviews/CreateInterviews";
import InterViewOverview from "./pages/interviews/components/InterviewOverview";
import UserViewOverview from "./pages/user-management/components/UserViewOverview";
import CreateUser from "./pages/user-management/components/overview-tab/CreateUser";
import CreateScreening from "./shared/components/create-update-screening/CreateScreening";
const AppRoutes = () => {
  const toastRef = useRef<Toast>(null);
  const [topMessage, setTopMessage] = useState<string>("");
  const [showTopMessage, setShowTopMessage] = useState<boolean>(false);

  // Show message temporarily
  const showTopNotification = useCallback((message: string) => {
    setTopMessage(message);
    setShowTopMessage(true);
    setTimeout(() => {
      setShowTopMessage(false);
    }, 5000);
  }, []);

  // Handle SignalR messages
  const handleSignalRMessage = useCallback(
    (user: string, message: string) => {
      const fullMessage = `${user}: ${message}`;
      showTopNotification(fullMessage);
    },
    [showTopNotification]
  );

  useEffect(() => {
    ToastService.setToast(toastRef.current);
  }, []);

  return (
    <SignalRProvider onMessage={handleSignalRMessage}>
      <TopCenterNotification message={topMessage} show={showTopMessage} />
      <Toast ref={toastRef} position="bottom-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/user-activation/:token" element={<UserActivation />} />
        <Route path="/" element={<AppLayout />}>
          <Route
            path="jobs"
            element={
              <PrivateRoute>
                <JobOpening />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/create-job-opening"
            element={
              <PrivateRoute>
                <CreateOpening />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId"
            element={
              <PrivateRoute>
                <OpeningOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/candidate/:candidateId/create-screening"
            element={
              <PrivateRoute>
                <CreateScreening />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/create-candidate"
            element={
              <PrivateRoute>
                <CreateCandidate />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/create-interviews"
            element={
              <PrivateRoute>
                <CreateInterviews />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/interview-overview/:interviewId"
            element={
              <PrivateRoute>
                <InterViewOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/candidate-overview/:candidateId/interview-overview/:interviewId"
            element={
              <PrivateRoute>
                <InterViewOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="candidates"
            element={
              <PrivateRoute>
                <Candidates />
              </PrivateRoute>
            }
          />
          <Route
            path="candidates/candidate-overview/:candidateId"
            element={
              <PrivateRoute>
                <CandidateOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="candidates/candidate-overview/:candidateId/interview-overview/:interviewId"
            element={
              <PrivateRoute>
                <InterViewOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="candidates/candidate-overview/:candidateId/create-interviews"
            element={
              <PrivateRoute>
                <CreateInterviews />
              </PrivateRoute>
            }
          />
          <Route
            path="jobs/opening-overview/:openingId/candidate-overview/:candidateId"
            element={
              <PrivateRoute>
                <CandidateOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="candidates/create-candidate"
            element={
              <PrivateRoute>
                <CreateCandidate />
              </PrivateRoute>
            }
          />
          <Route
            path="requests"
            element={
              <PrivateRoute>
                <JobRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="requests/request-overview/:id"
            element={
              <PrivateRoute>
                <JobRequestOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="requests/create-request"
            element={
              <PrivateRoute>
                <CreateRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="referrals"
            element={
              <PrivateRoute>
                <Referrals />
              </PrivateRoute>
            }
          />
          <Route
            path="referrals/referral-overview/:referralId"
            element={
              <PrivateRoute>
                <ReferralOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="referrals/create-referral"
            element={
              <PrivateRoute>
                <CreateReferral />
              </PrivateRoute>
            }
          />
          <Route
            path="referrals/job-opening-overview/:referralId/create-referral"
            element={
              <PrivateRoute>
                <CreateReferral />
              </PrivateRoute>
            }
          />
          <Route
            path="referrals/job-opening-overview/:openingId"
            element={
              <PrivateRoute>
                <ReferralJobOpeningDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="events"
            element={
              <PrivateRoute>
                <Event />
              </PrivateRoute>
            }
          />
          <Route path="interviews" element={<Interviews />} />
          <Route
            path="interviews/interview-overview/:interviewId"
            element={
              <PrivateRoute>
                <InterViewOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="interviews/create-interviews"
            element={
              <PrivateRoute>
                <CreateInterviews />
              </PrivateRoute>
            }
          />
          <Route
            path="interviews/:interviewId/candidate-overview/:candidateId"
            element={
              <PrivateRoute>
                <CandidateOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="interviews/:interviewId/candidate-overview/:candidateId/interview-overview/:interviewId"
            element={
              <PrivateRoute>
                <InterViewOverview />
              </PrivateRoute>
            }
          />
          <Route path="/users" element={<UserManagement />} />
          <Route
            path="users/create-user"
            element={
              <PrivateRoute>
                <CreateUser />
              </PrivateRoute>
            }
          />
          <Route
            path="users/user-overview/:employeeId"
            element={
              <PrivateRoute>
                <UserViewOverview />
              </PrivateRoute>
            }
          />
          <Route path="/no-roles" element={<NoRoles />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </SignalRProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
