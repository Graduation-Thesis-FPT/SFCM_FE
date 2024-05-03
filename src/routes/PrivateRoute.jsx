import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { setMenu } from "@/redux/slice/menuSlice";
import { useDispatch } from "react-redux";
const data = [
  {
    name: "Quản lý người dùng",
    url: "userManagement",
    icon: "Users",
    child: [
      { name: "Nhóm người dùng", url: "1", component: "UserGroups" },
      { name: "Người dùng", url: "2", component: "UserAccounts" },
      { name: "Phân quyền", url: "3", component: "ErrorPage" }
    ]
  },
  {
    name: "Danh mục dùng chung",
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
export default function PrivateRoute() {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(setMenu(data));
    }
  }, []);
  return token ? <Outlet /> : <Navigate to={"/login"} />;
}
