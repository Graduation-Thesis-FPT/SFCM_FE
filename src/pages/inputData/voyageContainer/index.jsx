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
import { voyage_container, voyage } from "@/components/common/aggridreact/dbColumns";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { useCustomToast } from "@/components/common/custom-toast";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { actionGrantPermission } from "@/constants";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Input } from "@/components/common/ui/input";
import {
  CntrSizeRender,
  CustomerRender,
  OnlyEditWithInsertCell,
  VoyContainerStatusRender
} from "@/components/common/aggridreact/cellRender";
import { VesselInfoSheet } from "./vesselInfoSheet";
import {
  createAndUpdateVoyageContainer,
  deleteManifestLoadingListCont,
  getVoyageContainerByVoyageID
} from "@/apis/voyage-container.api";
import { getCustomerByCustomerType } from "@/apis/customer.api";
import { GrantPermission } from "@/components/common/grant-permission";
import moment from "moment";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";
import { checkVoyageContainer } from "@/lib/validation/input-data/checkVoyageContainer";
import { ErrorWithDetail } from "@/components/common/custom-toast/ErrorWithDetail";
import useFetchData from "@/hooks/useRefetchData";
import { Badge } from "@/components/common/ui/badge";

const formSchema = z.object({
  ID: z.string().min(1, { message: "Vui lòng chọn chuyến tàu!" }),
  VESSEL_NAME: z.string().min(1, { message: "Vui lòng chọn chuyến tàu!" }),
  ETA: z.string().min(1, { message: "Vui lòng chọn chuyến tàu!" })
});

const VOYAGE_CONTAINER = new voyage_container();
const VOYAGE = new voyage();

const formField = [
  {
    name: VOYAGE.ID.field,
    label: VOYAGE.ID.headerName
  },
  { name: VOYAGE.VESSEL_NAME.field, label: VOYAGE.VESSEL_NAME.headerName },
  {
    name: VOYAGE.ETA.field,
    label: VOYAGE.ETA.headerName
  }
];

export function VoyageContainer() {
  const [openVesselInfoSheet, setOpenVesselInfoSheet] = useState(false);
  const [rowData, setRowData] = useState([]);
  const { data: shipperList } = useFetchData({
    service: getCustomerByCustomerType,
    params: "SHIPPER"
  });

  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ID: "",
      VESSEL_NAME: "",
      ETA: ""
    }
  });

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
      headerName: VOYAGE_CONTAINER.CNTR_NO.headerName,
      field: VOYAGE_CONTAINER.CNTR_NO.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      onCellValueChanged: UpperCase
    },
    {
      headerName: VOYAGE_CONTAINER.CNTR_SIZE.headerName,
      field: VOYAGE_CONTAINER.CNTR_SIZE.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: CntrSizeRender
    },
    {
      headerName: VOYAGE_CONTAINER.SHIPPER_ID.headerName,
      field: VOYAGE_CONTAINER.SHIPPER_ID.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: params => CustomerRender(params, shipperList)
    },
    {
      headerName: VOYAGE_CONTAINER.SEAL_NO.headerName,
      field: VOYAGE_CONTAINER.SEAL_NO.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: VOYAGE_CONTAINER.NOTE.headerName,
      field: VOYAGE_CONTAINER.NOTE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "Trạng thái cont",
      field: VOYAGE_CONTAINER.STATUS.field,
      flex: 1,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: VoyContainerStatusRender
    }
  ];

  const handleAddRow = () => {
    if (!form.getValues("ID")) {
      toast.warning("Vui lòng chọn chuyến tàu");
      return;
    }
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    const { isValid, mess } = checkVoyageContainer(gridRef);
    if (!isValid) {
      toast.errorWithDetail(<ErrorWithDetail mess={mess} />);
      return;
    }

    dispatch(setGlobalLoading(true));
    if (insertAndUpdateData.insert.length > 0) {
      insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
        return { ...item, VOYAGE_ID: form.getValues("ID") };
      });
    }
    createAndUpdateVoyageContainer(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowDataByFilter(form.getValues("ID"));
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ID");
    dispatch(setGlobalLoading(true));
    deleteManifestLoadingListCont(deleteIdList)
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

  const getRowDataByFilter = async ID => {
    await getVoyageContainerByVoyageID(ID)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const onSubmit = data => {};

  const handleChangeVesselInfo = async rowSelected => {
    setOpenVesselInfoSheet(false);
    form.setValue("ID", rowSelected[0].ID);
    form.setValue("VESSEL_NAME", rowSelected[0].VESSEL_NAME);
    form.setValue("ETA", moment(rowSelected[0].ETA).format("DD/MM/YYYY"));
    dispatch(setGlobalLoading(true));
    getVoyageContainerByVoyageID(rowSelected[0].ID)
      .then(res => {
        toast.success(res);
        setRowData(res.data.metadata);
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
            <span className="grid grid-cols-3 gap-3">
              {formField.map((item, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onClick={() => {
                            setOpenVesselInfoSheet(true);
                          }}
                          readOnly
                          className="hover:cursor-pointer"
                          placeholder="Chọn chuyến tàu "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </span>
            <Button
              variant="blue"
              type="button"
              onClick={() => {
                setOpenVesselInfoSheet(true);
              }}
            >
              Chọn chuyến tàu
            </Button>
          </form>
        </Form>
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
      <VesselInfoSheet
        onChangeVesselInfo={handleChangeVesselInfo}
        open={openVesselInfoSheet}
        onOpenChange={() => {
          setOpenVesselInfoSheet(false);
        }}
      />
    </Section>
  );
}
