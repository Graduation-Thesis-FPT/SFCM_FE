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
  const user = useSelector(state => state.userSlice.user);
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          {dataRoutes?.map(item => {
            return (
              <Route key={item.url} path={item.url}>
                {item?.child?.map(child => {
                  const Component = Comp[child.component];
                  if (!Component) {
                    return <Route key={child.url} path={child.url} element={<ErrorPage />} />;
                  }
                  return <Route key={child.url} path={child.url} element={<Component />} />;
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
