import ErrorPage from "@/layout/ErrorPage";
import MainLayout from "@/layout/MainLayout";
import Detail from "@/pages/detail/Detail";
import Login from "@/pages/login/Login";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UserAccounts from "@/pages/userManager/UserAccounts";

const components = { Detail, ErrorPage, UserAccounts };

export default function Router() {
  const dataRoutes = useSelector(state => state.menuSlice.menu);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute dataRoutes={dataRoutes} />}>
          <Route path="/" element={<MainLayout />}>
            {dataRoutes?.map(item => {
              return (
                <Route key={item.url} path={item.url}>
                  {item?.child?.map(child => {
                    const Component = components[child.component];
                    return <Route key={child.url} path={child.url} element={<Component />} />;
                  })}
                </Route>
              );
            })}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
