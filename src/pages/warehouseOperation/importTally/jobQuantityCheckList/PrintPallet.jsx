import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Printer } from "lucide-react";
import QRCode from "qrcode.react";
import { forwardRef, useRef } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

export function PrintPallet({ data = {} }) {
  const printRef = useRef(null);
  const dispatch = useDispatch();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => dispatch(setGlobalLoading(true)),
    onAfterPrint: () => dispatch(setGlobalLoading(false))
  });

  return (
    <div>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Printer onClick={handlePrint} className="size-4 hover:cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>In mã pallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ComponentPrint ref={printRef} data={data || {}} />
    </div>
  );
}

const ComponentPrint = forwardRef(({ data = {} }, ref) => {
  const baseURL = `${window.location.origin}/warehouse-operation/export-tally`;

  const createURLWithParams = (baseUrl, params) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url.toString();
  };

  return (
    <div ref={ref} className="hidden-to-print space-y-2 p-5">
      <div className="flex justify-between">
        <div>STT: {data?.SEQ}</div>
        <div className="font-bold">{data?.PALLET_NO}</div>
        <div>SL: {data?.ESTIMATED_CARGO_PIECE}</div>
      </div>
      <div className="flex flex-col">
        <QRCode
          value={createURLWithParams(baseURL, data)}
          size={258}
          className="m-auto"
          level={"L"}
        />
        <div className="mt-1 text-center text-12">
          <div>
            Kích thước: {data?.PALLET_LENGTH}x{data?.PALLET_WIDTH}x{data?.PALLET_HEIGHT} (m)
          </div>
          {data?.NOTE && <div>Ghi chú: {data?.NOTE}</div>}
        </div>
      </div>
    </div>
  );
});
