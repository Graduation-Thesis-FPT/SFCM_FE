import { invoicePublishIn, saveInOrder } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { bill_info, bs_customer, customer } from "@/components/common/aggridreact/dbColumns";
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

export function DialogBillInfo({
  open = false,
  onOpenChange,
  onSaveInOrderSuccess,
  billInfoList = [],
  filterInfoSelected = {},
  selectedCustomer = {},
  EXP_DATE = "",
  rowData = []
}) {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const BILL_INFO = new bill_info();
  const BS_CUSTOMER = new bs_customer();
  const CUSTOMER = new customer();
  const toast = useCustomToast();
  const [HTTT, setHTTT] = useState("TM");
  const [isSaveInOrder, setIsSaveInOrder] = useState(false);

  const colDefs = [
    {
      headerName: "Mã biểu cước",
      field: "ID",
      flex: 1
    },
    {
      headerName: "Tên biểu cước",
      field: "NAME",
      flex: 1
    },
    {
      headerName: "Kích thước cont",
      field: "CNTR_SIZE",
      flex: 1
    },
    {
      headerName: "Số lượng (cont)",
      field: "QTY",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => {
        if (!params.value) {
          return "";
        }
        return Number(params.value);
      }
    },
    {
      headerName: "VAT (%)",
      field: "VAT_RATE",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Tiền thuế (VND)",
      field: "VAT_PRICE",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Thành tiền (VND)",
      field: "AMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    // {
    //   headerName: "Đơn giá (VND)",
    //   field: "UNIT_RATE",
    //   flex: 1,
    //   headerClass: "number-header",
    //   cellClass: "text-end",
    //   cellRenderer: params => formatVnd(params.value).replace("VND", "")
    // },

    {
      headerName: "Tổng tiền (VND)",
      field: "TAMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    }
  ];

  const handleSaveInOrder = () => {
    setIsSaveInOrder(true);
    let datasTemp = billInfoList.map(item => {
      return {
        TariffName: item.TRF_DESC,
        UnitCode: "CBM",
        UnitRate: item.UNIT_RATE,
        Amount: item.AMOUNT,
        Vat: item.VAT_PRICE,
        VatRate: item.VAT,
        QTY: item.QTY
      };
    });
    let args = {
      cusTaxCode: selectedCustomer.TAX_CODE,
      cusAddr: selectedCustomer.ADDRESS,
      cusName: selectedCustomer.CUSTOMER_NAME,
      sum_amount: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0),
      vat_amount: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0),
      total_amount: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0),
      paymentMethod: HTTT,
      datas: [...datasTemp]
    };
    invoicePublishIn(args)
      .then(res => {
        if (!res.data.metadata.success) {
          throw new Error(res.data.metadata.error);
        }
        return res.data.metadata;
      })
      .then(invoiceInfo => {
        const reqData = rowData.map(item => {
          return {
            ...item,
            EXP_DATE: EXP_DATE,
            CUSTOMER_CODE: selectedCustomer.CUSTOMER_CODE,
            DE_ORDER_NO: invoiceInfo.fkey
          };
        });

        const paymentInfoHeader = {
          INV_NO: invoiceInfo.inv,
          ACC_CD: HTTT,
          INV_DATE: invoiceInfo.invoiceDate,
          AMOUNT: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0),
          VAT: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0),
          TAMOUNT: billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0)
        };

        const paymentInfoDtl = billInfoList.map(item => {
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

        saveInOrder(reqData, paymentInfoHeader, paymentInfoDtl)
          .then(res => {
            onOpenChange();
            socket.emit("saveInOrderSuccess");
            onSaveInOrderSuccess(res.data.metadata);
            toast.success(res);
          })
          .catch(err => {
            toast.error(err);
          })
          .finally(() => {
            setIsSaveInOrder(false);
          });
      })
      .catch(err => {
        toast.error(err);
        setIsSaveInOrder(false);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            <div className="grid grid-cols-3 gap-x-8 gap-y-8">
              <div className="min-w-fit space-y-2">
                <p className="text-16 font-semibold">Thông tin thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-3 gap-x-2 gap-y-2">
                  <p>Mã số thuế</p>
                  <p className="col-span-2">{filterInfoSelected?.TAX_CODE}</p>
                  <p>Tên đại lý</p>
                  <p className="col-span-2">{filterInfoSelected?.FULLNAME}</p>
                  <p>Địa chỉ</p>
                  <p className="col-span-2">{filterInfoSelected?.ADDRESS}</p>
                  <p>Email</p>
                  <p className="col-span-2">{filterInfoSelected?.EMAIL}</p>
                </div>
              </div>

              <div className="min-w-fit space-y-2">
                <div className="text-16 font-semibold">Tổng tiền thanh toán</div>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <p>{BILL_INFO.AMOUNT.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoList.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0)
                    )}
                  </p>
                  <p>{BILL_INFO.VAT_PRICE.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0)
                    )}
                  </p>
                  <p>{BILL_INFO.TAMOUNT.headerName}</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-16 font-semibold">Hình thức thanh toán</div>
                <Separator />
                <div>
                  <Select
                    id="HTTT"
                    value={HTTT}
                    onValueChange={value => {
                      setHTTT(value);
                    }}
                  >
                    <SelectTrigger className="">
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
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleSaveInOrder} variant="blue" disabled={isSaveInOrder}>
                    {isSaveInOrder && <Loader2 className="mr-2 animate-spin" />}
                    Xác nhận
                  </Button>
                </div>
              </div>

              <span className="col-span-3">
                <AgGrid
                  ref={gridRef}
                  rowSelection={"none"}
                  className="h-[200px]"
                  rowData={billInfoList || []}
                  colDefs={colDefs}
                  pagination={false}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
