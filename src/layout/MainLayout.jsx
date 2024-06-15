import { Avatar } from "@/components/ui/avartar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import MenuWeb from "@/layout/menu/MenuWeb";
import { useCustomStore } from "@/lib/auth";
import { getFirstLetterOfLastWord } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  CircleHelpIcon,
  Loader2,
  LogOutIcon,
  MessageCircle,
  Settings
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const menu = useSelector(state => state.menuSlice.menu);
  const user = useSelector(state => state.userSlice.user);
  const globalLoading = useSelector(state => state.globalLoadingSlice.globalLoading);
  let { pathname } = useLocation();
  const [isCollapse, setIsCollapse] = useState(false);
  const userGlobal = useCustomStore();

  const handleLogout = () => {
    userGlobal.remove();
    window.location.href = "/login";
  };

  return (
    <div
      className={`${
        !isCollapse ? "md:grid-cols-[256px_1fr]" : "md:grid-cols-[92px_1fr]"
      } grid min-h-screen bg-gray-50 duration-200`}
    >
      <div className="hidden h-screen rounded-r-md bg-white md:block">
        <MenuWeb
          menu={menu}
          handleScale={() => setIsCollapse(!isCollapse)}
          isCollapse={isCollapse}
        />
      </div>
      <div className="md:pl-5">
        <header className="mb-1.5 flex h-16 items-center justify-between rounded-md bg-white px-6 shadow-sm">
          <h1 className="text-xl font-bold text-blue-800">
            {menu?.map(item =>
              item?.child?.map(child => {
                let isMenuSelected = pathname === `/${item.MENU_CODE}/${child.MENU_CODE}`;
                if (isMenuSelected) {
                  return child.MENU_NAME;
                }
              })
            )}
          </h1>
          {/* <MenuMobile /> */}
          <div className="flex items-center">
            {/* TODO: Notification and Message  */}
            <div className="flex min-h-9 items-center gap-4 rounded-md bg-gray-50 px-3 shadow-md">
              <Bell size={20} />
              <MessageCircle size={20} />
            </div>
            <div className="mx-3 space-y-1 text-center">
              <div className="text-sm font-bold text-gray-900">{user?.userInfo?.FULLNAME}</div>
              <div className="text-xs font-normal text-gray-600">{user?.userInfo?.ROLE_NAME}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex h-fit items-center gap-4">
                  <Avatar
                    alt="avatar"
                    radius="full"
                    size="32"
                    fallback="S"
                    className="h-8 w-8 cursor-pointer items-center justify-center bg-blue-500 text-white"
                  >
                    {getFirstLetterOfLastWord(user?.userInfo?.FULLNAME)}
                  </Avatar>

                  <ChevronDown className="size-5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* {TODO: Setting and Support} */}
                <DropdownMenuItem>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CircleHelpIcon size={16} className="mr-2" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-50 focus:text-red-600"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <LogOutIcon size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main>
          {globalLoading && (
            <div className="absolute left-1/2 top-1/2 z-50">
              <Loader2 className="size-28 animate-spin text-gray-500" />
            </div>
          )}
          <div
            className={`${globalLoading && "pointer-events-none opacity-50"} ${isCollapse ? "md:max-w-minusMenuIsCollapse" : "md:max-w-minusMenuNotCollapse"} h-minusHeader overflow-auto rounded-md bg-white md:w-full`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
