import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Printer } from "lucide-react";
import moment from "moment";
import { forwardRef, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import logo from "@/assets/image/Logo_64x64.svg";
import { Separator } from "@/components/common/ui/separator";
import { getPackageCellAllocationForDocByRowguid } from "@/apis/package-cell-allocation.api";
import { useCustomToast } from "@/components/common/custom-toast";

export function PrintPallet({ data = {} }) {
  const printRef = useRef(null);
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

  const [dataForPrint, setDataForPrint] = useState({});

  const handleGetDataForPrint = () => {
    dispatch(setGlobalLoading(true));
    getPackageCellAllocationForDocByRowguid(data.ROWGUID)
      .then(res => {
        setDataForPrint(res.data.metadata);
      })
      .then(() => {
        setTimeout(() => {
          handlePrint();
        }, 300);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
    return;
  };

  return (
    <div>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Printer onClick={handleGetDataForPrint} className="size-4 hover:cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <span>In mã pallet</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ComponentPrint ref={printRef} dataForPrint={dataForPrint} data={data || {}} />
    </div>
  );
}

const ComponentPrint = forwardRef(({ data = {}, dataForPrint = {} }, ref) => {
  return (
    <div ref={ref} className="hidden-to-print space-y-2 px-5 py-7">
      <div className="flex items-center space-x-4">
        <img src={logo} className="size-[110px]" />
        <div className="w-full">
          <span>
            <div className="text-center">
              <div>Cảng quốc tế SFCM</div>
              <div>Kho SFCM</div>
            </div>
            <Separator className="my-2" />
            <div className="text-center font-bold">
              <div className="text-32 ">Thông tin kiện hàng</div>
              <div className="text-12">{dataForPrint?.pca_ROWGUID}</div>
            </div>
          </span>
        </div>
      </div>

      <div className="pt-3 text-16">
        <div className="flex justify-between">
          <div className="space-y-3">
            <div>
              Mã chuyến tàu: <span>{dataForPrint?.voy_ID} </span>
            </div>
            <div>
              Tên tàu: <span>{dataForPrint?.voy_VESSEL_NAME} </span>
            </div>
          </div>
          <div>
            Ngày tàu đến: <span>{moment(dataForPrint?.voy_ETA)?.format("DD/MM/YYYY")} </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div>
            Số container: <span>{dataForPrint?.cont_CNTR_NO} </span>
          </div>
          <div>
            Kích thước container: <span>{dataForPrint?.cont_CNTR_SIZE} </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div className="space-y-3">
            <div>
              Số house bill: {dataForPrint?.pk_HOUSE_BILL} ({dataForPrint?.pca_SEQUENCE})
            </div>
            <div>
              Kích thước: {dataForPrint?.pca_SEPARATED_PACKAGE_LENGTH}x
              {dataForPrint?.pca_SEPARATED_PACKAGE_HEIGHT}x
              {dataForPrint?.pca_SEPARATED_PACKAGE_WIDTH} (m) (d-r-c)
            </div>
            <div>
              Số lượng hàng: {dataForPrint?.pca_ITEMS_IN_CELL} ({dataForPrint?.pk_PACKAGE_UNIT})
            </div>
            <div>Loại hàng: {dataForPrint?.pk_PACKAGE_TYPE_ID}</div>
          </div>
          <div>Ngày tách hàng: {moment(dataForPrint?.pca_CREATED_AT)?.format("DD/MM/YYYY")}</div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div>
            Chủ hàng: {dataForPrint?.us_FULLNAME} ({dataForPrint?.cus_ID})
          </div>
          <div>Email: {dataForPrint?.us_EMAIL}</div>
          <div>Số điện thoại: {dataForPrint?.us_TELEPHONE}</div>
          <div>Địa chỉ: {dataForPrint?.us_ADDRESS}</div>
        </div>
        {dataForPrint?.pca_NOTE && (
          <div className="mt-3">
            Ghi chú: <span>{dataForPrint?.pca_NOTE}</span>
          </div>
        )}
      </div>
    </div>
  );
});
