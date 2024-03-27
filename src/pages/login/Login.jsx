import { Button } from "@/components/ui/button";
import { setMenu } from "@/redux/slice/menuSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = [
    {
      name: "Trang chủ",
      url: "home",
      child: [
        { url: "homePage", component: "Home" },
        { url: "sum", component: "Home" }
      ]
    },
    { name: "Chi tiết", url: "detail", child: [{ url: "detailPage", component: "Detail" }] }
  ];
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      dispatch(setMenu(data));
      navigate("/home/homePage");
    }
  }, []);
  return (
    <div>
      <Button
        onClick={() => {
          localStorage.setItem("token", "token");
          navigate("/home/homePage");
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          localStorage.removeItem("token");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
