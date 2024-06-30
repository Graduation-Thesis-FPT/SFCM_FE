export function LayoutTool({ children }) {
  return (
    <span className="w-fit">
      <div className="mb-2 text-xs font-medium">Công cụ</div>
      <div className="flex h-[36px] items-center rounded-md bg-gray-100 px-3">{children}</div>
    </span>
  );
}
