import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "@/components/common/ui/toaster";
import { AuthProvider } from "./routes/AuthProvider";
import { Router } from "./routes/Router";
// import { registerLicense } from "@syncfusion/ej2-base";

// registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);
// console.log("cc", import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
    <Toaster />
  </Provider>
  // </React.StrictMode>
);
