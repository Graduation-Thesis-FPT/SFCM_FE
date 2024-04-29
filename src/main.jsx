import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Router from "@/routes/Router";
import { store } from "./redux/store";
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
    <Toaster />
  </Provider>
  // </React.StrictMode>
);
