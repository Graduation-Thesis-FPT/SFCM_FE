import { getAllItemType } from "@/apis/item-type.api";
import { getAllMethod } from "@/apis/method.api";
import { getAllTariffCode } from "@/apis/trf-codes.api";
import {
  createAndUpdateStandardTariff,
  deleteStandardTariff,
  getStandardTariffByTemplate
} from "@/apis/trf-std.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  ItemTypeCodeRender,
  MethodCodeRender,
  TrfCodeRender
} from "@/components/common/aggridreact/cellRender";
import { trf_std } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
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
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CreateStandardTariffTemplate } from "./CreateStandardTariffTemplate";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import useFetchData from "@/hooks/useRefetchData";
import { deleteTariffTemp, getAllTariffTemp } from "@/apis/tariff-temp.api";
import { Button } from "@/components/common/ui/button";

export function StandardTariff() {
  const { data: tariffCodes } = useFetchData({ service: getAllTariffCode });
  const { data: itemTypes } = useFetchData({ service: getAllItemType });
  const { data: methods } = useFetchData({ service: getAllMethod });

  const toast = useCustomToast();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const [tariffTemplateList, setTariffTemplateList] = useState([]);
  const [tariffTemplateFilter, setTariffTemplateFilter] = useState({
    template: "",
    from: "",
    to: "",
    name: ""
  });
  const [rowData, setRowData] = useState([]);
  const TRF_STD = new trf_std();
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
      headerName: TRF_STD.TRF_CODE.headerName,
      field: TRF_STD.TRF_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => TrfCodeRender(params, tariffCodes)
    },
    {
      headerName: TRF_STD.TRF_DESC.headerName,
      field: TRF_STD.TRF_DESC.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: TRF_STD.METHOD_CODE.headerName,
      field: TRF_STD.METHOD_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => MethodCodeRender(params, methods)
    },
    {
      headerName: TRF_STD.ITEM_TYPE_CODE.headerName,
      field: TRF_STD.ITEM_TYPE_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => ItemTypeCodeRender(params, itemTypes)
    },
    {
      headerName: TRF_STD.AMT_CBM.headerName,
      field: TRF_STD.AMT_CBM.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number"
    },
    {
      headerName: TRF_STD.VAT.headerName,
      field: TRF_STD.VAT.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number"
    },
    {
      headerName: TRF_STD.INCLUDE_VAT.headerName,
      field: TRF_STD.INCLUDE_VAT.field,
      headerClass: "center-header",
      cellStyle: {
        justifyContent: "center",
        display: "flex"
      },
      flex: 1,
      editable: true,
      cellEditor: "agCheckboxCellEditor",
      cellRenderer: "agCheckboxCellRenderer"
    }
  ];

  const handleAddRow = () => {
    if (!tariffTemplateFilter.template) {
      return toast.warning("Vui lòng chọn mẫu biểu cước!");
    }
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }
    insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
      return { ...item, TRF_TEMP_CODE: tariffTemplateFilter.template };
    });
    insertAndUpdateData.update = removeKeysFromArrayObjects(insertAndUpdateData.update, [
      "TRF_TEMP_CODE"
    ]);
    dispatch(setGlobalLoading(true));

    createAndUpdateStandardTariff(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getStandardTariffByFilter(tariffTemplateFilter.template);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  function removeKeysFromArrayObjects(array, keysToRemove) {
    // Trả về một mảng mới, mỗi đối tượng trong mảng được "lọc" để loại bỏ các key không mong muốn
    return array.map(object => {
      // Sử dụng reduce để tạo một đối tượng mới
      return Object.keys(object).reduce((newObject, currentKey) => {
        // Nếu key hiện tại không nằm trong danh sách keysToRemove, thêm nó vào đối tượng mới
        if (!keysToRemove.includes(currentKey)) {
          newObject[currentKey] = object[currentKey];
        }
        return newObject;
      }, {});
    });
  }

  const handleDeleteRows = selectedRows => {
    dispatch(setGlobalLoading(true));
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ROWGUID");

    deleteStandardTariff(deleteIdList)
      .then(res => {
        if (newRowDataAfterDeleted.length === 0) {
          getTariffTemp();
          setTariffTemplateFilter({ template: "", from: "", to: "", name: "" });
        }
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => toast.error(err))
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleCreateNewTemplate = res => {
    let TRF_TEMP_CODE = res.data.metadata[0]?.TRF_TEMP_CODE;
    getTariffTemp();
    if (TRF_TEMP_CODE) {
      setTariffTemplateFilter({
        template: TRF_TEMP_CODE,
        from: moment(TRF_TEMP_CODE?.split("-")[0], "DD/MM/YYYY")?._d,
        to: moment(TRF_TEMP_CODE?.split("-")[1], "DD/MM/YYYY")?._d,
        name: TRF_TEMP_CODE?.split("-")[2]
      });
    }
  };

  const handleDeleteTariffTemp = () => {
    if (!tariffTemplateFilter.template) {
      return toast.warning("Vui lòng chọn mẫu biểu cước!");
    }
    dispatch(setGlobalLoading(true));
    deleteTariffTemp([tariffTemplateFilter.template])
      .then(res => {
        toast.success(res);
        getTariffTemp();
        setTariffTemplateFilter({ template: "", from: "", to: "", name: "" });
        setRowData([]);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  useEffect(() => {
    getTariffTemp();
  }, []);

  const getStandardTariffByFilter = template => {
    getStandardTariffByTemplate(template)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getTariffTemp = () => {
    getAllTariffTemp()
      .then(res => {
        setTariffTemplateList(res.data.metadata);
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
            <Label htmlFor="TRF_TEMP_CODE">Mẫu biểu cước</Label>
            <Select
              id="TRF_TEMP_CODE"
              onValueChange={value => {
                setTariffTemplateFilter({
                  template: value,
                  from: moment(value.split("-")[0], "DD/MM/YYYY")?._d,
                  to: moment(value.split("-")[1], "DD/MM/YYYY")?._d,
                  name: value.split("-")[2]
                });
                getStandardTariffByTemplate(value)
                  .then(res => {
                    toast.success(res);
                    setRowData(res.data.metadata);
                  })
                  .catch(err => {
                    toast.error(err);
                  });
              }}
              value={tariffTemplateFilter.template}
            >
              <SelectTrigger className="min-w-72">
                <SelectValue placeholder="Chọn mẫu biểu cước" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tariffTemplateList.map(item => (
                    <SelectItem key={item?.TRF_TEMP_CODE} value={item?.TRF_TEMP_CODE}>
                      {item?.TRF_TEMP_CODE}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="TRF_NAME">Tên biểu cước</Label>
            <Input
              value={tariffTemplateFilter.name}
              readOnly
              className="hover:cursor-not-allowed"
              id="TRF_NAME"
              placeholder="Chọn mẫu biểu cước"
            />
          </div>
          <div>
            <Label htmlFor="FROM_DATE">Hiệu lực từ ngày</Label>
            <Input
              value={
                tariffTemplateFilter.from ? moment(tariffTemplateFilter.from).format("DD/MM/Y") : ""
              }
              readOnly
              className="hover:cursor-not-allowed"
              id="FROM_DATE"
              placeholder="Chọn mẫu biểu cước"
            />
          </div>
          <div>
            <Label htmlFor="TO_DATE">Hiệu lực đến ngày</Label>
            <Input
              value={
                tariffTemplateFilter.to ? moment(tariffTemplateFilter.to).format("DD/MM/Y") : ""
              }
              readOnly
              className="hover:cursor-not-allowed"
              id="TO_DATE"
              placeholder="Chọn mẫu biểu cước"
            />
          </div>
        </span>
        <span className="flex items-end space-x-3">
          <Button variant="outline" onClick={handleDeleteTariffTemp}>
            Xóa mẫu biểu cước
          </Button>
          <CreateStandardTariffTemplate onCreateNewTemplate={handleCreateNewTemplate} />
        </span>
      </Section.Header>
      <Section.Content>
        <LayoutTool>
          <BtnExportExcel gridRef={gridRef} />
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
        <Section.Table>
          <AgGrid
            showCountRowSelected={true}
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
