import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuMobile from "@/layout/menu/MenuMobile";
import MenuWeb from "@/layout/menu/MenuWeb";
import { Button } from "@/components/ui/button";
import { CircleUser, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout() {
  const [isCollapse, setIsCollapse] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <>
      <div
        className={`grid min-h-screen w-full duration-200 ${
          !isCollapse ? "md:grid-cols-[220px_1fr]" : "md:grid-cols-[70px_1fr]"
        } `}
      >
        <div className="hidden border-r bg-muted/40 md:block">
          <MenuWeb handleScale={() => setIsCollapse(!isCollapse)} isCollapse={isCollapse} />
        </div>
        <div className="z-10 flex flex-col">
          <header
            className="flex h-14 items-center gap-4
             border-b bg-muted/40 px-4
           lg:h-[60px] lg:px-6 "
          >
            <MenuMobile />

            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main
            className={`${isCollapse ? "md:w-minusMenu_isCollapse" : "md:w-minusMenu_notCollapse"}`}
          >
            <div className="overflow-y-auto p-4 lg:h-minusHeader_lg">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}
