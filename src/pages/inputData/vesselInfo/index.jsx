import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { DatePickerWithRangeInForm } from "@/components/date-range-picker";
import { addDays } from "date-fns";
import { dt_vessel_visit } from "@/components/aggridreact/dbColumns";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { createAndUpdateVessel, deleteVessel, getVesselByFilter } from "@/apis/vessel.api";
import { useCustomToast } from "@/components/custom-toast";
import { LayoutTool } from "@/components/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common";
import { actionGrantPermission } from "@/constants";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { BtnExportExcel } from "@/components/aggridreact/tableTools/BtnExportExcel";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";

const formSchema = z.object({
  from_date: z.date({
    required_error: "Vui lòng chọn ngày!"
  }),
  to_date: z.date({
    required_error: "Vui lòng chọn ngày!"
  })
});

export function VesselInfo() {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_date: addDays(new Date(), -30),
      to_date: addDays(new Date(), 30)
    }
  });
  const DT_VESSEL_VISIT = new dt_vessel_visit();

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
      headerName: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.headerName,
      field: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_VESSEL_VISIT.ETA.headerName,
      field: DT_VESSEL_VISIT.ETA.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "date"
    },
    {
      headerName: DT_VESSEL_VISIT.ETD.headerName,
      field: DT_VESSEL_VISIT.ETD.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "date"
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

  const getRowData = () => {
    getVesselByFilter(form.getValues("from_date"), form.getValues("to_date"))
      .then(res => {
        setRowData(
          res.data.metadata?.map(rowData => {
            return {
              ...rowData,
              ETA: rowData.ETA ? new Date(rowData.ETA) : null,
              ETD: rowData.ETD ? new Date(rowData.ETD) : null
            };
          })
        );
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleAddRow = () => {
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.error("Không có dữ liệu để lưu");
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

  const onSubmit = () => {
    dispatch(setGlobalLoading(true));
    getVesselByFilter(form.getValues("from_date"), form.getValues("to_date"))
      .then(res => {
        setRowData(
          res.data.metadata?.map(rowData => {
            return {
              ...rowData,
              ETA: rowData.ETA ? new Date(rowData.ETA) : null,
              ETD: rowData.ETD ? new Date(rowData.ETD) : null
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
  };

  return (
    <Section>
      <Section.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end justify-between">
            <FormField
              control={form.control}
              name="from_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày tàu đến - tàu rời</FormLabel>
                  <FormControl>
                    <DatePickerWithRangeInForm
                      date={{ from: form.getValues("from_date"), to: form.getValues("to_date") }}
                      onSelected={value => {
                        form.setValue("from_date", value.from);
                        form.setValue("to_date", value.to);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="blue" type="submit">
              Nạp dữ liệu
            </Button>
          </form>
        </Form>
      </Section.Header>
      <Section.Content>
        <span className="mb-[25px] flex justify-between">
          <div></div>
          <LayoutTool>
            <BtnExportExcel gridRef={gridRef} />
            <GrantPermission action={actionGrantPermission.CREATE}>
              <BtnAddRow onAddRow={handleAddRow} />
            </GrantPermission>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
        </span>
        <AgGrid
          contextMenu={true}
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          className="h-[50vh]"
          rowData={rowData}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRows(selectedRows);
          }}
        />
      </Section.Content>
    </Section>
  );
}
