import { refreshToken } from "@/apis/access.api";
import { getMenuByRoleCode } from "@/apis/menu.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { getRefreshToken, useCustomStore } from "@/lib/auth";
import { setMenu } from "@/redux/slice/menuSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userSlice.user);
  let { pathname } = useLocation();
  const toast = useCustomToast();
  const rToken = getRefreshToken();
  const userGlobal = useCustomStore();

  if (!user.accessToken && rToken) {
    refreshToken()
      .then(res => {
        userGlobal.store(res.data.metadata);
        getMenuByRoleCode(res.data.metadata.userInfo.ROLE_CODE)
          .then(resMenu => {
            dispatch(setMenu(resMenu.data.metadata));
          })
          .catch(err => {});
      })
      .catch(err => {});
  }

  useEffect(() => {
    if (!user.userInfo) return;
    getMenuByRoleCode(user.userInfo.ROLE_CODE)
      .then(resMenu => {
        dispatch(setMenu(resMenu.data.metadata));
      })
      .catch(err => {});
  }, [pathname]);

  return <>{children}</>;
}
