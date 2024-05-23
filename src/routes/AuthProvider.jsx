import { refreshToken } from "@/apis/access.api";
import { getMenuByRoleCode } from "@/apis/menu.api";
import { useCustomToast } from "@/components/custom-toast";
import { getRefreshToken, storeAccessToken, storeRefreshToken } from "@/lib/auth";
import { setMenu } from "@/redux/slice/menuSlice";
import { setUser } from "@/redux/slice/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userSlice.user);
  let { pathname } = useLocation();
  const toast = useCustomToast();
  const rToken = getRefreshToken();

  if (!user.accessToken && rToken) {
    refreshToken()
      .then(res => {
        storeRefreshToken(res.data.metadata.refreshToken);
        storeAccessToken(res.data.metadata.accessToken);
        dispatch(setUser(res.data.metadata));
        getMenuByRoleCode(res.data.metadata.userInfo.ROLE_CODE)
          .then(resMenu => {
            dispatch(setMenu(resMenu.data.metadata));
          })
          .catch(err => {
            toast.error("Lỗi lấy menu");
          });
      })
      .catch(err => {
        toast.error("Lỗi xác thực thông tin");
      });
  }

  useEffect(() => {
    if (!user.userInfo) return;
    getMenuByRoleCode(user.userInfo.ROLE_CODE)
      .then(resMenu => {
        dispatch(setMenu(resMenu.data.metadata));
      })
      .catch(err => {
        toast.error("Lỗi lấy menu");
      });
  }, [pathname]);

  return <>{children}</>;
}
