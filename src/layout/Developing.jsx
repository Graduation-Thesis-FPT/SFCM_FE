import isDeveloping from "@/assets/image/is-developing.svg";

export function Developing() {
  return (
    <div className="flex flex-col items-center py-40 text-zinc-900 dark:text-zinc-50">
      <img
        loading="eager"
        alt="is-developing"
        className="hidden aspect-auto h-40 object-cover md:col-span-5 md:flex"
        src={isDeveloping}
      />
      <h1 className="text-center text-3xl font-medium">Trang đang được phát triển</h1>
      <p className="mt-10 text-center text-base md:text-xl">
        Xin lỗi, trang đang được phát triển để cung cấp chất lượng tốt hơn! <br />
        Vui lòng truy cập lại sau.
      </p>
    </div>
  );
}
