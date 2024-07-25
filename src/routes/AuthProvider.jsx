import { refreshToken } from "@/apis/access.api";
import { getMenuByRoleCode } from "@/apis/menu.api";
import logoNoText from "@/assets/image/logo-menu-notext.svg";
import useFetchData from "@/hooks/useRefetchData";
import { getRefreshToken, useCustomStore } from "@/lib/auth";
import { setMenu } from "@/redux/slice/menuSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userSlice.user);
  let { pathname } = useLocation();
  const rToken = getRefreshToken();
  const userGlobal = useCustomStore();
  const {
    data: menu,
    loading: menuLoading,
    revalidate
  } = useFetchData({
    service: getMenuByRoleCode,
    dependencies: [user],
    shouldFetch: !!user.userInfo
  });
  useEffect(() => {
    if (!user.accessToken && rToken) {
      refreshToken()
        .then(res => {
          userGlobal.store(res.data.metadata);
          revalidate();
        })
        .catch(err => {});
    }
  }, [user]);

  useEffect(() => {
    if (menu) {
      dispatch(setMenu(menu));
      console.log("menu", menu);
    }
  }, [menu]);
  if (!user.userInfo) {
    return <>{children}</>;
  }
  if (menuLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <img src={logoNoText} alt="logo" className="aspect-auto size-20 animate-pulse" />
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }
  return <>{children}</>;
}
