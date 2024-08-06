import { invoicePublishEx, saveExOrder, saveInOrder } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { bill_info, bs_customer } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { Separator } from "@/components/common/ui/separator";
import { socket } from "@/config/socket";
import { formatVnd, removeLastAsterisk } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const BILL_INFO = new bill_info();
const BS_CUSTOMER = new bs_customer();

export function DialogBillInfoEx({
  open = false,
  onOpenChange,
  packageFilter = {},
  packageList = [],
  billInfoEx = [],
  selectedCustomer = {},
  onSaveExOrderSuccess
}) {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [HTTT, setHTTT] = useState("TM");
  const [isSaveExOrder, setIsSaveExOrder] = useState(false);

  const colDefs = [
    {
      headerName: BILL_INFO.TRF_DESC.headerName,
      field: BILL_INFO.TRF_DESC.field,
      flex: 1
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: "Số ngày lưu kho",
      field: BILL_INFO.QTY.field,
      flex: 1,
      cellRenderer: params => {
        if (!params.value) {
          return "";
        }
        return Number(params.value);
      }
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: `${BILL_INFO.UNIT_RATE.headerName} (VND)`,
      field: BILL_INFO.UNIT_RATE.field,
      flex: 1,
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: BILL_INFO.VAT.headerName,
      field: BILL_INFO.VAT.field,
      flex: 1
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: `${BILL_INFO.VAT_PRICE.headerName} (VND)`,
      field: BILL_INFO.VAT_PRICE.field,
      flex: 1,
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: `${BILL_INFO.AMOUNT.headerName} (VND)`,
      field: BILL_INFO.AMOUNT.field,
      flex: 1,
      cellRenderer: params => {
        return Number(params.value).toLocaleString("it-IT", {
          currency: "VND"
        });
      }
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: `${BILL_INFO.TAMOUNT.headerName} (VND)`,
      field: BILL_INFO.TAMOUNT.field,
      flex: 1,
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    }
  ];

  const handleSaveExOrder = () => {
    setIsSaveExOrder(true);
    let datasTemp = billInfoEx.map(item => {
      return {
        TariffName: item.TRF_DESC,
        UnitCode: "CBM",
        UnitRate: item.UNIT_RATE,
        Amount: item.AMOUNT,
        Vat: item.VAT_PRICE,
        VatRate: item.VAT
      };
    });

    let args = {
      cusTaxCode: selectedCustomer.TAX_CODE,
      cusAddr: selectedCustomer.ADDRESS,
      cusName: selectedCustomer.CUSTOMER_NAME,
      sum_amount: billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0),
      vat_amount: billInfoEx?.reduce((a, b) => a + Number(Number(b[BILL_INFO.VAT_PRICE.field])), 0),
      total_amount: billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0),
      paymentMethod: HTTT,
      datas: [...datasTemp]
    };
    invoicePublishEx(args)
      .then(res => {
        if (!res.data.metadata.success) {
          throw new Error(res.data.metadata.error);
        }
        return res.data.metadata;
      })
      .then(invoiceInfo => {
        const reqData = packageList.map(item => {
          return {
            ...item,
            EXP_DATE: packageFilter.EXP_DATE,
            CUSTOMER_CODE: selectedCustomer.CUSTOMER_CODE,
            DE_ORDER_NO: invoiceInfo.fkey,
            PACKAGE_ID: item.ROWGUID
          };
        });

        const paymentInfoHeader = {
          INV_NO: invoiceInfo.inv,
          ACC_CD: HTTT,
          INV_DATE: invoiceInfo.invoiceDate,
          AMOUNT: billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0),
          VAT: billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0),
          TAMOUNT: billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0)
        };

        const paymentInfoDtl = billInfoEx.map(item => {
          return {
            QTY: item.QTY,
            UNIT_RATE: item.UNIT_RATE,
            AMOUNT: item.AMOUNT,
            VAT: item.VAT_PRICE,
            VAT_RATE: item.VAT,
            TAMOUNT: item.TAMOUNT,
            CARGO_TYPE: item.ITEM_TYPE_CODE,
            TRF_DESC: item.TRF_DESC
          };
        });

        saveExOrder(reqData, paymentInfoHeader, paymentInfoDtl)
          .then(res => {
            socket.emit("saveExOrderSuccess");
            toast.success(res);
            onSaveExOrderSuccess(res.data.metadata);
          })
          .catch(err => {
            toast.error(err);
          })
          .finally(() => {
            setIsSaveExOrder(false);
          });
      })
      .catch(err => {
        toast.error(err);
        setIsSaveExOrder(false);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!selectedCustomer.CUSTOMER_NAME || !packageList.length) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            <div className="grid grid-cols-3 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <p className="text-16 font-semibold">Thông tin thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <p>{removeLastAsterisk(BS_CUSTOMER.TAX_CODE.headerName)}</p>
                  <p>{selectedCustomer[BS_CUSTOMER.TAX_CODE.field]}</p>
                  <p>{removeLastAsterisk(BS_CUSTOMER.CUSTOMER_NAME.headerName)}</p>
                  <p>{selectedCustomer[BS_CUSTOMER.CUSTOMER_NAME.field]}</p>
                  <p>{removeLastAsterisk(BS_CUSTOMER.ADDRESS.headerName)}</p>
                  <p>{selectedCustomer[BS_CUSTOMER.ADDRESS.field]}</p>
                  <p>{removeLastAsterisk(BS_CUSTOMER.EMAIL.headerName)}</p>
                  <p>{selectedCustomer[BS_CUSTOMER.EMAIL.field]}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-16 font-semibold">Tổng tiền thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <p>{BILL_INFO.AMOUNT.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoEx.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0)
                    )}
                  </p>
                  <p>{BILL_INFO.VAT_PRICE.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0)
                    )}
                  </p>
                  <p>{BILL_INFO.TAMOUNT.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoEx?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-16 font-semibold">Hình thức thanh toán</div>
                <Separator />
                <Select
                  id="HTTT"
                  value={HTTT}
                  onValueChange={value => {
                    setHTTT(value);
                  }}
                >
                  <SelectTrigger className="min-w-full">
                    <SelectValue placeholder="Chọn hình thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="TM">Tiền mặt</SelectItem>
                      <SelectItem value="CK">Chuyển khoản</SelectItem>
                      <SelectItem value="TM/CK">Tiền mặt và chuyển khoản</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="flex justify-center">
                  <Button onClick={handleSaveExOrder} variant="blue" disabled={isSaveExOrder}>
                    {isSaveExOrder && <Loader2 className="mr-2 animate-spin" />}
                    Xác nhận thanh toán
                  </Button>
                </div>
              </div>

              <div className="col-span-3">
                <AgGrid
                  ref={gridRef}
                  rowSelection={"none"}
                  className="h-[200px]"
                  rowData={billInfoEx || []}
                  colDefs={colDefs}
                  pagination={false}
                />
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
