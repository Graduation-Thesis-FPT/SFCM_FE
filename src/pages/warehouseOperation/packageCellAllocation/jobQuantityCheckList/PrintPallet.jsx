import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Printer } from "lucide-react";
import moment from "moment";
import { forwardRef, useRef } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import logo from "@/assets/image/Logo_64x64.svg";
import { Separator } from "@/components/common/ui/separator";

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
            <span>In mã pallet</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ComponentPrint ref={printRef} selectedPackage={selectedPackage} data={data || {}} />
    </div>
  );
}

const ComponentPrint = forwardRef(({ data = {}, selectedPackage = {} }, ref) => {
  return (
    <div ref={ref} className="hidden-to-print space-y-2 px-5 py-7">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center text-12">
          <div className="text-center">
            <div>Cảng quốc tế SFCM</div>
            <div>Kho SFCM</div>
          </div>
          <div>
            <img src={logo} className="size-[42px]" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-24 font-bold">Thông tin kiện hàng</div>
          <div className=" font-bold">{data?.ROWGUID}</div>
          <div>*****************</div>
        </div>
        <div className="flex size-[52px] flex-col text-center font-bold">
          <div className="text-12">STT</div>
          <div>{data?.SEQ}</div>
        </div>
      </div>
      <div className="pt-3 text-16">
        <div className="flex justify-between">
          <div className="space-y-3">
            <div>
              Mã tàu: <span>{selectedPackage?.ID} </span>
            </div>
            <div>
              Tên tàu: <span>{data?.VESSEL_NAME} </span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              Chuyến nhập: <span>{data?.ID} </span>
            </div>
            <div>
              Ngày tàu đến: <span>{moment(data?.ETA)?.format("DD/MM/Y HH:mm")} </span>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div>
            Số vận đơn: <span>{data?.BILLOFLADING ?? "...................."} </span>
          </div>
          <div>
            Số cont: <span>{data?.CNTRNO} </span>
          </div>
          <div>
            Kích cỡ cont: <span>{data?.CNTRSZTP} </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div className="space-y-3">
            <div>
              Kích thước: {data.PALLET_LENGTH}x{data.PALLET_WIDTH}x{data.PALLET_HEIGHT} (m)
            </div>
            <div>
              Số lượng hàng:{" "}
              <span>
                {data?.ESTIMATED_CARGO_PIECE}/{data?.ACTUAL_CARGO_PIECE} ({data?.PACKAGE_UNIT_CODE}{" "}
                - {data?.PACKAGE_UNIT_NAME})
              </span>
            </div>
            <div>
              Loại hàng:{" "}
              <span>
                {data?.ITEM_TYPE_CODE} - {data?.ITEM_TYPE_NAME}
              </span>
            </div>
          </div>
          <div>Ngày kiểm đếm: {moment(data?.START_DATE)?.format("DD/MM/YYYY")}</div>
        </div>
        {data?.NOTE && (
          <div className="mt-3">
            Ghi chú: <span>{data?.NOTE}</span>
          </div>
        )}
      </div>
    </div>
  );
});
