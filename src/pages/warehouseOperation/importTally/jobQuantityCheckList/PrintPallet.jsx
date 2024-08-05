import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Printer } from "lucide-react";
import moment from "moment";
import QRCode from "qrcode.react";
import { forwardRef, useRef } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

export function PrintPallet({ data = {}, selectedPackage = {} }) {
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
      <ComponentPrint ref={printRef} selectedPackage={selectedPackage} data={data || {}} />
    </div>
  );
}

const ComponentPrint = forwardRef(({ data = {}, selectedPackage = {} }, ref) => {
  const baseURL = `${window.location.origin}/warehouse-operation/export-tally`;

  const createURLWithParams = (baseUrl, params) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url.toString();
  };

  return (
    <div ref={ref} className="hidden-to-print space-y-2 p-5">
      <div className="flex items-end justify-between">
        <div className="text-12">STT: {data?.SEQ}</div>
        <div className="font-bold">{data?.PALLET_NO}</div>
        <div className="text-12">
          SL: {data?.ESTIMATED_CARGO_PIECE}/{data?.ACTUAL_CARGO_PIECE}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-12">
        <div>
          Mã tàu: <b>{selectedPackage?.VOYAGEKEY}</b>
        </div>
        <div>
          Ngày kiểm đếm: <b>{moment(data?.START_DATE)?.format("DD/MM/Y")}</b>
        </div>
        <div>
          Số cont: <b>{selectedPackage?.CNTRNO}</b>
        </div>
        <div></div>
        <div>
          Loại hàng: <b>{selectedPackage?.ITEM_TYPE_NAME}</b>
        </div>
        <div>
          Ghi chú: <b>{data?.NOTE}</b>
        </div>
      </div>
      {/* <div className="flex flex-col">
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
      </div> */}
    </div>
  );
});
