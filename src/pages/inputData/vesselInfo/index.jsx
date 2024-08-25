import { Section } from "@/components/common/section";
import { useRef, useState } from "react";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { addDays } from "date-fns";
import { dt_vessel_visit } from "@/components/common/aggridreact/dbColumns";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { createAndUpdateVessel, deleteVessel, getVesselByFilter } from "@/apis/vessel.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { actionGrantPermission } from "@/constants";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { DateTimePickerRender } from "@/components/common/aggridreact/cellRender";
import { Label } from "@/components/common/ui/label";

const DT_VESSEL_VISIT = new dt_vessel_visit();
const initFilterData = {
  from_date: addDays(new Date(), -30),
  to_date: addDays(new Date(), 30)
};

export function VesselInfo() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState(initFilterData);
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
      headerName: DT_VESSEL_VISIT.VESSEL_NAME.headerName,
      field: DT_VESSEL_VISIT.VESSEL_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName,
      field: DT_VESSEL_VISIT.INBOUND_VOYAGE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_VESSEL_VISIT.ETA.headerName,
      field: DT_VESSEL_VISIT.ETA.field,
      flex: 1,
      cellRenderer: DateTimePickerRender
    },
    {
      headerName: DT_VESSEL_VISIT.CallSign.headerName,
      field: DT_VESSEL_VISIT.CallSign.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_VESSEL_VISIT.IMO.headerName,
      field: DT_VESSEL_VISIT.IMO.field,
      flex: 1,
      filter: true,
      editable: true
    }
  ];

  const handleAddRow = () => {
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }
    dispatch(setGlobalLoading(true));
    createAndUpdateVessel(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowData();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      selectedRows,
      rowData,
      "VOYAGEKEY"
    );
    dispatch(setGlobalLoading(true));
    deleteVessel(deleteIdList)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleSelectedDate = value => {
    setFilter({
      from_date: value?.from,
      to_date: value?.to
    });
    if (value?.from && value?.to) {
      dispatch(setGlobalLoading(true));
      getVesselByFilter(value.from, value.to)
        .then(res => {
          setRowData(
            res.data.metadata?.map(rowData => {
              return {
                ...rowData,
                ETA: rowData.ETA ? new Date(rowData.ETA) : null
              };
            })
          );
        })
        .catch(err => {
          toast.error(err);
        })
        .finally(() => {
          dispatch(setGlobalLoading(false));
        });
    }
  };

  const getRowData = () => {
    getVesselByFilter(filter.from_date, filter.to_date)
      .then(res => {
        setRowData(
          res.data.metadata?.map(rowData => {
            return {
              ...rowData,
              ETA: rowData.ETA ? new Date(rowData.ETA) : null
            };
          })
        );
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <Section>
      <Section.Header>
        <div>
          <Label>Ngày tàu đến</Label>
          <DatePickerWithRangeInForm
            date={{ from: filter.from_date, to: filter.to_date }}
            onSelected={handleSelectedDate}
          />
        </div>
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
            onGridReady={() => {
              gridRef.current.api.showLoadingOverlay();
              getRowData();
            }}
          />
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
