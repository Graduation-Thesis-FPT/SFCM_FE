import { Label } from "../../ui/label";

export function LayoutTool({ children }) {
  return (
    <span className="flex justify-end">
      <div>
        <Label htmlFor="tools">Công cụ</Label>
        <div id="tools" className="flex h-[36px] items-center rounded-md bg-gray-100 px-3">
          {children}
        </div>
      </div>
    </span>
  );
}
