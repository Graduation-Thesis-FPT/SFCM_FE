import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  from_date: z.date({
    required_error: "Vui lòng chọn khoảng thời gian ngày tàu đến!"
  }),
  to_date: z.date({
    required_error: "Vui lòng chọn khoảng thời gian ngày tàu đến!"
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
      cellRenderer: DateTimePickerRender
    },
    {
      headerName: DT_VESSEL_VISIT.ETD.headerName,
      field: DT_VESSEL_VISIT.ETD.field,
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
                  <FormLabel>Ngày tàu đến</FormLabel>
                  <FormControl>
                    <DatePickerWithRangeInForm
                      date={{ from: form.getValues("from_date"), to: form.getValues("to_date") }}
                      onSelected={value => {
                        form.setValue("from_date", value?.from);
                        form.setValue("to_date", value?.to);
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors?.from_date?.message ||
                      form.formState.errors?.to_date?.message}
                  </FormMessage>
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
        <span className="flex justify-between">
          <div>{/* Sau này để cái gì đó vô đây */}</div>
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
