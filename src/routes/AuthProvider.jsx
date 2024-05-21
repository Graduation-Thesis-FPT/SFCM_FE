import { refreshToken } from "@/apis/access.api";
import { storeAccessToken, storeRefreshToken } from "@/lib/auth";
import { setMenu } from "@/redux/slice/menuSlice";
import { setUser } from "@/redux/slice/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
const data = [
  {
    name: "Quản lý người dùng",
    url: "user-manager",
    icon: "Users",
    child: [
      { name: "Người dùng", url: "user", component: "User" },
      { name: "Phân quyền", url: "permission", component: "Permission" }
    ]
  },
  {
    name: "Danh mục chung",
    url: "danhmucdungchung",
    icon: "List",
    child: [
      { name: "Danh mục kho", url: "1", component: "ErrorPage" },
      { name: "Thiết kế kho", url: "2", component: "ErrorPage" },
      { name: "Danh mục cổng", url: "3", component: "ErrorPage" },
      { name: "Danh mục loại thiết bị", url: "4", component: "ErrorPage" },
      { name: "Danh mục phương án", url: "5", component: "ErrorPage" },
      { name: "Danh mục loại hàng hóa", url: "6", component: "ErrorPage" },
      { name: "Danh mục đơn vị tính", url: "7", component: "ErrorPage" },
      { name: "Danh mục hợp đồng thuê", url: "8", component: "ErrorPage" },
      { name: "Danh mục loại khách hàng", url: "9", component: "ErrorPage" },
      { name: "Danh mục khách hàng", url: "10", component: "ErrorPage" }
    ]
  },
  {
    name: "Dữ liệu đầu vào",
    url: "dulieudauvao",
    icon: "FolderInput",
    child: [
      { name: "Thông tin tàu chuyến", url: "1", component: "ErrorPage" },
      { name: "Manifest - LoadingList (Container)", url: "2", component: "ErrorPage" },
      { name: "Thông tin Container biến động", url: "3", component: "ErrorPage" },
      { name: "Bảng kê danh mục hàng hóa", url: "4", component: "ErrorPage" }
    ]
  }
];
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userSlice.user);
  let { pathname } = useLocation();

  if (!user.refreshToken) {
    dispatch(setMenu(data));
    refreshToken()
      .then(res => {
        dispatch(setUser(res.data.metadata));
        storeRefreshToken(res.data.metadata.refreshToken);
        storeAccessToken(res.data.metadata.accessToken);
      })
      .catch(err => {});
  }

  useEffect(() => {}, [pathname]);

  return <>{children}</>;
}
