import ErrorPage from "@/layout/ErrorPage";
import MainLayout from "@/layout/MainLayout";
import Detail from "@/pages/detail/Detail";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const components = { Detail, Home };

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

const PrivateRoute = ({ dataRoutes }) => {
  return dataRoutes.length > 0 ? <Outlet /> : <Navigate to={"/login"} />;
};
