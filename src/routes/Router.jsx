import { ErrorPage } from "@/layout/ErrorPage";
import { MainLayout } from "@/layout/MainLayout";
import * as Comp from "@/pages/index";
import { FirstLogin } from "@/pages/login/FirstLogin";
import { Login } from "@/pages/login/Login";
import { ProfilePage } from "@/pages/profile";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Developing } from "@/layout/Developing";

export default function Router() {
  const dataRoutes = useSelector(state => state.menuSlice.menu);
  const location = useLocation();
  const pathChild = location.pathname.split("/")[2];
  
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          {dataRoutes?.map(parent => {
            return (
              <Route
                key={parent.ROWGUID}
                path={parent.MENU_CODE}
                element={
                  !pathChild && (
                    <Navigate to={`/${parent.MENU_CODE}/${parent.child[0].MENU_CODE}`} />
                  )
                }
              >
                {parent?.child?.map(child => {
                  const Component = Comp[child.VIEW_PAGE];
                  if (!Component) {
                    return (
                      <Route key={child.ROWGUID} path={child.MENU_CODE} element={<Developing />} />
                    );
                  }
                  return (
                    <Route key={child.ROWGUID} path={child.MENU_CODE} element={<Component />} />
                  );
                })}
              </Route>
            );
          })}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/change-default-password" element={<FirstLogin />} />
    </Routes>
  );
}
