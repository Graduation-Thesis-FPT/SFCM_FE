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
import { useEffect, useRef, useState } from "react";
import { dt_cntr_mnf_ld, dt_vessel_visit } from "@/components/common/aggridreact/dbColumns";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { getAllVessel } from "@/apis/vessel.api";
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
import { getAllItemType } from "@/apis/item-type.api";
import {
  CntrSztpRender,
  ConsigneeRender,
  ItemTypeCodeRender
} from "@/components/common/aggridreact/cellRender";
import { VesselInfoSheet } from "./vesselInfoSheet";
import {
  createAndUpdateManifestLoadingListCont,
  deleteManifestLoadingListCont,
  getManifestLoadingListContByFilter
} from "@/apis/cntr-mnf-ld.api";
import { getAllCustomer } from "@/apis/customer.api";
import { GrantPermission } from "@/components/common/grant-permission";
import moment from "moment";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";

const formSchema = z.object({
  VOYAGEKEY: z.string().min(1, { message: "Vui lòng chọn tàu chuyến!" }),
  VESSEL_NAME: z.string().min(1, { message: "Vui lòng chọn tàu chuyến!" }),
  INBOUND_VOYAGE: z.string().min(1, { message: "Vui lòng chọn tàu chuyến!" }),
  ETA: z.string().min(1, { message: "Vui lòng chọn tàu chuyến!" })
});

const DT_VESSEL_VISIT = new dt_vessel_visit();

const formField = [
  { name: DT_VESSEL_VISIT.VESSEL_NAME.field, label: DT_VESSEL_VISIT.VESSEL_NAME.headerName },
  {
    name: DT_VESSEL_VISIT.INBOUND_VOYAGE.field,
    label: DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName
  },
  {
    name: DT_VESSEL_VISIT.ETA.field,
    label: DT_VESSEL_VISIT.ETA.headerName
  }
];

export function ManifestLoadingList() {
  const [openVesselInfoSheet, setOpenVesselInfoSheet] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [vesselList, setVesselList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [itemType, setItemType] = useState([]);
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      VOYAGEKEY: "",
      VESSEL_NAME: "",
      INBOUND_VOYAGE: "",
      ETA: ""
    }
  });
  const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();

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
      headerName: DT_CNTR_MNF_LD.BILLOFLADING.headerName,
      field: DT_CNTR_MNF_LD.BILLOFLADING.field,
      flex: 1,
      filter: true,
      editable: true,
      onCellValueChanged: UpperCase
    },
    {
      headerName: DT_CNTR_MNF_LD.CNTRNO.headerName,
      field: DT_CNTR_MNF_LD.CNTRNO.field,
      flex: 1,
      filter: true,
      editable: true,
      onCellValueChanged: UpperCase
    },
    {
      headerName: DT_CNTR_MNF_LD.CNTRSZTP.headerName,
      field: DT_CNTR_MNF_LD.CNTRSZTP.field,
      flex: 1,
      cellRenderer: CntrSztpRender
    },
    {
      headerName: DT_CNTR_MNF_LD.SEALNO.headerName,
      field: DT_CNTR_MNF_LD.SEALNO.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_CNTR_MNF_LD.CONSIGNEE.headerName,
      field: DT_CNTR_MNF_LD.CONSIGNEE.field,
      flex: 1,
      cellRenderer: params => ConsigneeRender(params, customerList)
    },
    {
      headerName: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName,
      field: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.field,
      flex: 1,
      cellRenderer: params => ItemTypeCodeRender(params, itemType)
    },
    {
      headerName: DT_CNTR_MNF_LD.COMMODITYDESCRIPTION.headerName,
      field: DT_CNTR_MNF_LD.COMMODITYDESCRIPTION.field,
      flex: 1,
      filter: true,
      editable: true
    }
  ];

  const handleAddRow = () => {
    if (!form.getValues("VOYAGEKEY")) {
      toast.error("Vui lòng chọn tàu chuyến");
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
    dispatch(setGlobalLoading(true));
    if (insertAndUpdateData.insert.length > 0) {
      insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
        return { ...item, VOYAGEKEY: form.getValues("VOYAGEKEY") };
      });
    }
    createAndUpdateManifestLoadingListCont(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowDataByFilter(form.getValues("VOYAGEKEY"));
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ROWGUID");
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

  const getRowDataByFilter = async VOYAGEKEY => {
    await getManifestLoadingListContByFilter(VOYAGEKEY)
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

    form.setValue("VOYAGEKEY", rowSelected[0].VOYAGEKEY);
    form.setValue("VESSEL_NAME", rowSelected[0].VESSEL_NAME);
    form.setValue("INBOUND_VOYAGE", rowSelected[0].INBOUND_VOYAGE);
    form.setValue("ETA", moment(rowSelected[0].ETA).format("DD/MM/YYYY HH:mm"));

    dispatch(setGlobalLoading(true));
    getManifestLoadingListContByFilter(rowSelected[0].VOYAGEKEY)
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

  const getVesselList = () => {
    getAllVessel()
      .then(res => {
        setVesselList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getItemType = () => {
    getAllItemType()
      .then(res => {
        setItemType(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getCustomerList = () => {
    getAllCustomer()
      .then(res => {
        setCustomerList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getItemType();
    getVesselList();
    getCustomerList();
  }, []);

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
                          placeholder="Chọn tàu chuyến"
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
              Chọn tàu chuyến
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
        vesselList={vesselList}
        open={openVesselInfoSheet}
        onOpenChange={() => {
          setOpenVesselInfoSheet(false);
        }}
      />
    </Section>
  );
}
