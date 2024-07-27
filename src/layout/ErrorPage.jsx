import logoNoText from "@/assets/image/logo-menu-notext.svg";
import { Loader2 } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export function ErrorPage() {
  const dataRoutes = useSelector(state => state.menuSlice.menu);
  if (!dataRoutes) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <img src={logoNoText} alt="logo" className="aspect-auto size-20 animate-pulse" />
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main>
      <div className="flex flex-col items-center py-40 text-zinc-900 dark:text-zinc-50">
        <p className="text-4xl font-bold md:text-5xl" aria-label="404">
          4💡4
        </p>
        <h1 className="text-center text-4xl font-bold md:text-5xl">Không tìm thấy trang</h1>
        <p className="mt-10 text-center text-base font-medium md:text-xl">
          Xin lỗi, trang bạn đang tìm kiếm không khả dụng hoặc chưa được cấp quyền <br />
          Vui lòng truy cập lại sau.
        </p>

        <a href="/" className="mt-5">
          <button
            title="Về trang chủ"
            className="rounded-md border border-gray-300 bg-blue-500 px-5 py-2 text-lg text-gray-50 shadow duration-200 hover:bg-blue-700 dark:border-gray-500 dark:text-gray-50"
          >
            Về trang chủ
          </button>
        </a>
      </div>
    </main>
  );
}
