import { Avatar } from "@/components/common/ui/avartar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/common/ui/dropdown-menu";
import { useToggle } from "@/hooks/useToggle";
import MenuWeb from "@/layout/menu/MenuWeb";
import { useCustomStore } from "@/lib/auth";
import { cn, getFirstLetterOfLastWord } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  CircleHelpIcon,
  CircleUserRound,
  Loader2,
  LogOutIcon,
  MessageCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export function MainLayout() {
  const menu = useSelector(state => state.menuSlice.menu);
  const user = useSelector(state => state.userSlice.user);
  const globalLoading = useSelector(state => state.globalLoadingSlice.globalLoading);
  let { pathname } = useLocation();
  const [isCollapse, setIsCollapse] = useToggle();
  const userGlobal = useCustomStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    userGlobal.remove();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen min-w-0 flex-row gap-2 bg-gray-50 duration-200">
      <div
        className={cn(
          "h-full rounded-r-md bg-white transition-all ease-linear",
          isCollapse ? "w-[92px]" : "w-64"
        )}
      >
        <MenuWeb
          menu={menu}
          handleScale={() => setIsCollapse(!isCollapse)}
          isCollapse={isCollapse}
        />
      </div>
      <div className="flex h-full flex-1 flex-col gap-1.5">
        <header className="flex max-h-16 min-h-16 flex-row items-center justify-between rounded-md bg-white px-6 shadow-sm">
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
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* {TODO: Setting and Support} */}
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <CircleUserRound size={18} className="mr-2" />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CircleHelpIcon size={18} className="mr-2" />
                  Tài liệu hướng dẫn
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-50 focus:text-red-600"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <LogOutIcon size={16} className="mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main
          className={cn(
            "min-h-0 w-full flex-1 rounded-md bg-white",
            globalLoading && "pointer-events-none opacity-50"
          )}
        >
          {globalLoading && (
            <div className="absolute left-1/2 top-1/2 z-50">
              <Loader2 className="size-28 animate-spin text-gray-500" />
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
