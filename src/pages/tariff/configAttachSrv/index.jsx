import {
  createAndUpdateConfigAttachSrvByMethodCode,
  getConfigAttachSrvByMethodCode
} from "@/apis/config-attach-srv.api";
import { getAllMethod } from "@/apis/method.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
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
import { fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function ConfigAttachSrv() {
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const [methodCodeFilter, setMethodCodeFilter] = useState("");
  const [rowData, setRowData] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [attachSrvList, setAttachSrvList] = useState([]);
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
      headerName: "Mã dịch vụ",
      field: "METHOD_CODE",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên dịch vụ",
      field: "METHOD_NAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Chọn",
      field: "SELECT",
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

  const handleSaveRows = () => {
    const { updateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }
    dispatch(setGlobalLoading(true));
    let deleteData = updateData.update.filter(item => !item.SELECT);
    let createData = updateData.update.filter(item => item.SELECT);
    createAndUpdateConfigAttachSrvByMethodCode(methodCodeFilter, { deleteData, createData })
      .then(res => {
        handleSelectMethodFilter(methodCodeFilter);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getMethodAndAttachSrv();
  }, []);

  const getMethodAndAttachSrv = () => {
    getAllMethod()
      .then(res => {
        if (res.data.metadata.length > 0) {
          setMethodList(res.data.metadata.filter(item => !item.IS_SERVICE));
          setAttachSrvList(
            res.data.metadata
              .filter(item => item.IS_SERVICE)
              .map(item => {
                return { ...item, SELECT: false };
              })
          );
        }
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleSelectMethodFilter = METHOD_CODE => {
    dispatch(setGlobalLoading(true));
    setMethodCodeFilter(METHOD_CODE);
    getConfigAttachSrvByMethodCode(METHOD_CODE)
      .then(res => {
        let resData = res.data.metadata;
        if (resData.length <= 0) {
          setRowData(attachSrvList);
        }

        let temp = attachSrvList.map(item => {
          if (resData.some(resItem => resItem.ATTACH_SERVICE_CODE === item.METHOD_CODE)) {
            item.SELECT = true;
          } else {
            item.SELECT = false;
          }
          return { status, ...item };
        });
        setRowData(temp);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  return (
    <Section>
      <Section.Header className="flex">
        <div>
          <Label htmlFor="METHOD">Phương án công việc</Label>
          <Select id="METHOD" onValueChange={handleSelectMethodFilter}>
            <SelectTrigger className="min-w-72">
              <SelectValue placeholder="Chọn phương án công việc" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {methodList.map(item => {
                  if (item.METHOD_CODE === "LK") return null;
                  return (
                    <SelectItem key={item?.METHOD_CODE} value={item?.METHOD_CODE}>
                      {item?.METHOD_CODE} - {item?.METHOD_NAME}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Section.Header>
      <Section.Content>
        <span className="flex items-end justify-between">
          <span className="text-lg font-bold leading-5 text-gray-900">
            Danh sách các dịch vụ đính kèm
          </span>
          <LayoutTool>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
        </span>
        <Section.Table>
          <AgGrid
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
