import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Router from "@/routes/Router";
import { store } from "./redux/store";
import { Toaster } from "@/components/common/ui/toaster";
import { AuthProvider } from "./routes/AuthProvider";
// import { registerLicense } from "@syncfusion/ej2-base";

// registerLicense(
//   import.meta.env.VITE_SYNCFUSION_LICENSE_KEY ||
//     "Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCeUx3Q3xbf1x0ZFRMYFxbQXJPIiBoS35RckVlWHlfc3RUR2NYVE1/"
// );

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
