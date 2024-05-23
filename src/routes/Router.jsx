import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ErrorPage } from "@/layout/ErrorPage";
import { Login } from "@/pages/login/Login";
import { FirstLogin } from "@/pages/login/FirstLogin";
import { MainLayout } from "@/layout/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import * as Comp from "@/pages/index";

export default function Router() {
  const dataRoutes = useSelector(state => state.menuSlice.menu);
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          {dataRoutes?.map(parent => {
            return (
              <Route key={parent.ROWGUID} path={parent.MENU_CODE}>
                {parent?.child?.map(child => {
                  const Component = Comp[child.VIEW_PAGE];
                  if (!Component) {
                    return (
                      <Route key={child.ROWGUID} path={child.MENU_CODE} element={<ErrorPage />} />
                    );
                  }
                  return (
                    <Route key={child.ROWGUID} path={child.MENU_CODE} element={<Component />} />
                  );
                })}
              </Route>
            );
          })}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/change-default-password" element={<FirstLogin />} />
    </Routes>
  );
}
