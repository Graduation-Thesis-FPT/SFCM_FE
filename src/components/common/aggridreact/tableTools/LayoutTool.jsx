export function LayoutTool({ children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium">Công cụ</div>
      <div className="flex w-fit h-[36px] items-center rounded-md bg-gray-100 px-3">{children}</div>
    </div>
  );
}
