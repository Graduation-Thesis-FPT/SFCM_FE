import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => {
          localStorage.setItem("token", "token");
          navigate("/");
        }}
      >
        Login
      </Button>
    </div>
  );
}
