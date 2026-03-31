import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import OneSignal from "react-onesignal";

OneSignal.init({
  appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
  serviceWorkerPath: "/sw.js",
  notifyButton: { enable: true },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
