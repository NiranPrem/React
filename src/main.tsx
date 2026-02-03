// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "./custom-toast.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./services/common";
const pca = new PublicClientApplication(msalConfig);

import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <MsalProvider instance={pca}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </MsalProvider>
  // </StrictMode>
);
