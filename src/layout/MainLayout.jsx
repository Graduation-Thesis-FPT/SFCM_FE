import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuMobile from "@/layout/menu/MenuMobile";
import MenuWeb from "@/layout/menu/MenuWeb";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Loader2, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";

export function MainLayout() {
  const menu = useSelector(state => state.menuSlice.menu);
  const user = useSelector(state => state.userSlice.user);
  let { pathname } = useLocation();
  const [isCollapse, setIsCollapse] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  function getFirstLetterOfLastWord(text) {
    if (!text) return "";
    const words = text.split(" ");
    const lastWord = words.pop();
    return lastWord ? lastWord[0].toUpperCase() : "";
  }

  return (
    <>
      <div
        className={`${
          !isCollapse ? "md:grid-cols-[256px_1fr]" : "md:grid-cols-[92px_1fr]"
        } grid min-h-screen bg-gray-50 duration-200`}
      >
        <div className="hidden h-screen rounded-r-md bg-white shadow-inner md:block">
          <MenuWeb
            menu={menu}
            handleScale={() => setIsCollapse(!isCollapse)}
            isCollapse={isCollapse}
          />
        </div>
        <div className="md:pl-5">
          <header className="mb-3 flex h-24 items-center justify-between rounded-md bg-white px-6 shadow-md">
            <h1 className="text-3xl font-bold text-blue-800">
              {menu?.map(item =>
                item?.child?.map(child => {
                  let isMenuSelected = pathname === `/${item.url}/${child.url}`;
                  if (isMenuSelected) {
                    return child.name;
                  }
                })
              )}
            </h1>
            {/* <MenuMobile /> */}
            <div className="flex items-center">
              <div className="flex gap-4 rounded-md bg-gray-50 p-3 shadow-md">
                <Bell />
                <MessageCircle />
              </div>
              <div className="mx-3 text-center">
                <div className="text-sm font-bold text-gray-900">{user?.userInfo?.FULLNAME}</div>
                <div className="text-sm font-normal text-gray-600">{user?.userInfo?.ROLE_NAME}</div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="flex items-center">
                    <Button variant="blue" size="icon" className="rounded-full">
                      {getFirstLetterOfLastWord(user?.userInfo?.FULLNAME)}
                    </Button>
                    <ChevronDown className="ml-3 size-6" />
                  </span>
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
            </div>
          </header>
          <main>
            <div className="h-minusHeader w-screen overflow-y-auto rounded-md bg-white md:w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
{
  /* <div
        className={`grid min-h-screen w-full duration-200 ${
          !isCollapse ? "md:grid-cols-[256px_1fr]" : "md:grid-cols-[70px_1fr]"
        } `}
      >
        <div className="hidden border-r bg-muted/40 md:block">
          <MenuWeb handleScale={() => setIsCollapse(!isCollapse)} isCollapse={isCollapse} />
        </div>
        <div className="z-10 flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
      </div> */
}
