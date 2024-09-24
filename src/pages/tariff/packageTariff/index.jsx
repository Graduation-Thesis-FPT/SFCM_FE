import { getAllPackageType } from "@/apis/package-type.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  PackageTypeRender,
  ContainerTariffStatusRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { package_tariff_detail } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import moment from "moment";
import { useRef, useState } from "react";
import { CreateStandardTariffTemplate } from "./CreateStandardTariffTemplate";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import useFetchData from "@/hooks/useRefetchData";
import { formatVnd } from "@/lib/utils";
import {
  createAndUpdatePackageTariffDetail,
  getAllPackageTariff,
  getPackageTariffDetailByFK
} from "@/apis/package-tariff.api";
import { checkPackageTariffDetail } from "@/lib/validation/checkPackageTariffDetail";
import { ErrorWithDetail } from "@/components/common/custom-toast/ErrorWithDetail";

const PACKAGE_TARIFF_DETAIL = new package_tariff_detail();

export function PackageTariff() {
  const { data: packageTypeList } = useFetchData({
    service: getAllPackageType
  });
  const { data: packageTariffList, revalidate: reloadPackageTariffList } = useFetchData({
    service: getAllPackageTariff
  });
  const [packageTariffSelected, setPackageTariffSelected] = useState({});

  const toast = useCustomToast();
  const gridRef = useRef(null);
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);
  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },

    {
      headerName: PACKAGE_TARIFF_DETAIL.PACKAGE_TYPE_ID.headerName,
      field: PACKAGE_TARIFF_DETAIL.PACKAGE_TYPE_ID.field,
      flex: 1,
      filter: true,
      cellRenderer: params => {
        if (params.data.status === "insert") {
          return PackageTypeRender(params, packageTypeList);
        }
        let temp = packageTypeList?.find(item => item.ID === params.value);
        return `${params?.value} - ${temp?.NAME}`;
      }
    },
    {
      headerName: PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.headerName,
      field: PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: PACKAGE_TARIFF_DETAIL.VAT_RATE.headerName,
      field: PACKAGE_TARIFF_DETAIL.VAT_RATE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 100
      }
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: `${PACKAGE_TARIFF_DETAIL.UNIT_PRICE.headerName} (VND)`,
      field: PACKAGE_TARIFF_DETAIL.UNIT_PRICE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      cellDataType: "number",
      cellEditorParams: {
        min: 1000,
        max: 1000000000
      },
      valueFormatter: params => {
        return formatVnd(params?.value ?? 0).replace("VND", "");
      }
    },
    {
      headerName: PACKAGE_TARIFF_DETAIL.UNIT.headerName,
      field: PACKAGE_TARIFF_DETAIL.UNIT.field,
      flex: 1,
      cellRenderer: params => {
        if (params.value === undefined) {
          return params.setValue("m³/ngày");
        }
        return params.value;
      }
    },
    {
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center",
        justifyContent: "center",
        display: "flex"
      },
      headerName: PACKAGE_TARIFF_DETAIL.STATUS.headerName,
      field: PACKAGE_TARIFF_DETAIL.STATUS.field,
      flex: 1,
      cellRenderer: ContainerTariffStatusRender
    }
  ];

  const handleAddRow = () => {
    if (!packageTariffSelected.ID) {
      return toast.warning("Vui lòng chọn biểu cước!");
    }
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }

    const { isValid, mess } = checkPackageTariffDetail(gridRef);
    if (!isValid) {
      toast.errorWithDetail(<ErrorWithDetail mess={mess} />);
      return;
    }

    insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
      return { ...item, PACKAGE_TARIFF_ID: packageTariffSelected.ID };
    });
    dispatch(setGlobalLoading(true));
    createAndUpdatePackageTariffDetail(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getStandardTariffByFilter(packageTariffSelected.ID);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    return toast.warning("Không thể xóa chi tiết biểu cước đã lưu");
  };

  const handleCreateNewTemplate = res => {
    let ID = res.data.metadata[0]?.ID;
    reloadPackageTariffList();
    if (ID) {
      setPackageTariffSelected({
        template: ID,
        from: moment(ID?.split("-")[0], "DD/MM/YYYY")?._d,
        to: moment(ID?.split("-")[1], "DD/MM/YYYY")?._d,
        name: ID?.split("-")[2]
      });
    }
  };

  const getStandardTariffByFilter = ID => {
    getPackageTariffDetailByFK(ID)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <Section>
      <Section.Header className="flex items-end justify-between gap-3">
        <span className="flex gap-3">
          <div>
            <Label htmlFor="ID">Mã biểu cước</Label>
            <Select
              id="ID"
              onValueChange={value => {
                const selectedPackageTariff = packageTariffList?.find(item => item.ID === value);
                setPackageTariffSelected(selectedPackageTariff);
                getPackageTariffDetailByFK(value)
                  .then(res => {
                    toast.success(res);
                    setRowData(res.data.metadata);
                  })
                  .catch(err => {
                    toast.error(err);
                  });
              }}
              value={packageTariffSelected?.ID}
            >
              <SelectTrigger className="min-w-72">
                <SelectValue placeholder="Chọn biểu cước" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {packageTariffList?.map(item => (
                    <SelectItem key={item?.ID} value={item?.ID}>
                      {item?.ID}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="NAME">Tên biểu cước</Label>
            <Input
              value={packageTariffSelected?.NAME ?? ""}
              readOnly
              className="hover:cursor-not-allowed"
              id="NAME"
              placeholder="Chọn biểu cước"
            />
          </div>
          <div>
            <Label htmlFor="VALID_FROM">Hiệu lực từ ngày</Label>
            <Input
              value={
                packageTariffSelected?.VALID_FROM
                  ? moment(packageTariffSelected.VALID_FROM).format("DD/MM/Y")
                  : ""
              }
              readOnly
              className="hover:cursor-not-allowed"
              id="VALID_FROM"
              placeholder="Chọn biểu cước"
            />
          </div>
          <div>
            <Label htmlFor="VALID_UNTIL">Hiệu lực đến ngày</Label>
            <Input
              value={
                packageTariffSelected?.VALID_UNTIL
                  ? moment(packageTariffSelected.VALID_UNTIL).format("DD/MM/Y")
                  : ""
              }
              readOnly
              className="hover:cursor-not-allowed"
              id="VALID_UNTIL"
              placeholder="Chọn biểu cước"
            />
          </div>
        </span>
        <span className="flex items-end">
          <CreateStandardTariffTemplate onCreateNewTemplate={handleCreateNewTemplate} />
        </span>
      </Section.Header>
      <Section.Content>
        <div className="flex items-end justify-between">
          <span className="-mb-2 text-lg font-bold">
            Chi tiết của biểu cước: {packageTariffSelected?.ID}
          </span>
          <LayoutTool>
            <GrantPermission action={actionGrantPermission.CREATE}>
              <BtnAddRow onAddRow={handleAddRow} />
            </GrantPermission>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
        </div>
        <Section.Table>
          <AgGrid
            contextMenu={true}
            setRowData={data => {
              setRowData(data);
            }}
            ref={gridRef}
            rowData={rowData}
            colDefs={colDefs}
            onDeleteRow={selectedRows => {
              handleDeleteRows(selectedRows);
            }}
          />
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
