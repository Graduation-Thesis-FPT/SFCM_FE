// import { getAllEquipType } from "@/apis/equipment-type.api";
// import { createAndUpdateEquipment, deleteEquipment, getAllEquipment } from "@/apis/equipment.api";
// import { AgGrid } from "@/components/common/aggridreact/AgGrid";
// import {
//   BlockCodeRender,
//   DateTimeByTextRender,
//   EquTypeRender,
//   OnlyEditWithInsertCell,
//   WarehouseCodeRender
// } from "@/components/common/aggridreact/cellRender";
// import { bs_equipment } from "@/components/common/aggridreact/dbColumns";
// import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
// import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
// import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
// import { GrantPermission } from "@/components/common/grant-permission";
// import { useCustomToast } from "@/components/common/custom-toast";
// import { SearchInput } from "@/components/common/search";
// import { Section } from "@/components/common/section";
// import { actionGrantPermission } from "@/constants";
// import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
// import { useEffect, useRef, useState } from "react";
// import { getAllWarehouse } from "@/apis/warehouse.api";
// import { setWeek } from "date-fns";

// export function EquipmentList() {
//   const gridRef = useRef(null);
//   const toast = useCustomToast();
//   const [rowData, setRowData] = useState([]);
//   const [searchData, setSearchData] = useState("");
//   const BS_EQUIPMENT = new bs_equipment();
//   const [equipTypes, setEquipTypes] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);

//   const colDefs = [
//     {
//       cellClass: "text-gray-600 bg-gray-50 text-center",
//       width: 60,
//       comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
//         return nodeA.rowIndex - nodeB.rowIndex;
//       },
//       valueFormatter: params => {
//         return Number(params.node.id) + 1;
//       }
//     },
//     {
//       headerName: BS_EQUIPMENT.EQU_TYPE.headerName,
//       field: BS_EQUIPMENT.EQU_TYPE.field,
//       flex: 1,
//       filter: true,
//       editable: true,
//       cellRenderer: param => EquTypeRender(param, equipTypes)
//     },
//     {
//       headerName: BS_EQUIPMENT.EQU_CODE.headerName,
//       field: BS_EQUIPMENT.EQU_CODE.field,
//       flex: 1,
//       filter: true,
//       editable: OnlyEditWithInsertCell
//     },
//     {
//       headerName: BS_EQUIPMENT.EQU_CODE_NAME.headerName,
//       field: BS_EQUIPMENT.EQU_CODE_NAME.field,
//       flex: 1,
//       filter: true,
//       editable: true
//     },
//     {
//       headerName: BS_EQUIPMENT.WAREHOUSE_CODE.headerName,
//       field: BS_EQUIPMENT.WAREHOUSE_CODE.field,
//       flex: 1,
//       filter: true,
//       editable: true,
//       cellRenderer: params => WarehouseCodeRender(params, warehouses)
//     },
//     {
//       headerName: BS_EQUIPMENT.UPDATED_AT.headerName,
//       field: BS_EQUIPMENT.UPDATED_AT.field,
//       flex: 1,
//       filter: true,
//       cellRenderer: DateTimeByTextRender
//     }
//   ];

//   const handleAddRow = () => {
//     let newRowData = fnAddRowsVer2(rowData, colDefs);
//     setRowData(newRowData);
//   };

//   const handleSaveRows = () => {
//     const { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);
//     insertAndUpdateData.update.forEach(obj => {
//       Object.keys(obj).forEach(key => {
//         if (obj[key] === null) {
//           delete obj[key];
//         }
//       });
//       return obj;
//     });

//     createAndUpdateEquipment(insertAndUpdateData)
//       .then(res => {
//         toast.success(res);
//         getRowData();
//       })
//       .catch(err => {
//         toast.error(err);
//       });
//   };

//   const handleDeleteRows = selectedRows => {
//     const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
//       selectedRows,
//       rowData,
//       "EQU_CODE"
//     );
//     deleteEquipment(deleteIdList)
//       .then(res => {
//         toast.success(res);
//         setRowData(newRowDataAfterDeleted);
//       })
//       .catch(err => {
//         toast.error(err);
//       });
//   };

//   const getRowData = () => {
//     getAllEquipment()
//       .then(res => {
//         setRowData(res.data.metadata);
//       })
//       .catch(err => {
//         toast.error(err);
//       });
//   };

//   const getEquipType = () => {
//     getAllEquipType()
//       .then(res => {
//         setEquipTypes(res.data.metadata);
//       })
//       .catch(err => {
//         toast.error(err);
//       });
//   };

//   const getWarehouse = () => {
//     getAllWarehouse()
//       .then(res => {
//         setWarehouses(res.data.metadata);
//       })
//       .catch(err => toast.error(err));
//   };

//   useEffect(() => {
//     getEquipType();
//     getWarehouse();
//   }, []);

//   return (
//     <Section>
//       <Section.Header title="Danh mục thiết bị"></Section.Header>
//       <Section.Content>
//         <div className="flex justify-between">
//           <SearchInput
//             handleSearch={value => {
//               setSearchData(value);
//             }}
//           />
//           <LayoutTool>
//             <GrantPermission action={actionGrantPermission.CREATE}>
//               <BtnAddRow onAddRow={handleAddRow} />
//             </GrantPermission>
//             <GrantPermission action={actionGrantPermission.UPDATE}>
//               <BtnSave onClick={handleSaveRows} />
//             </GrantPermission>
//           </LayoutTool>
//         </div>

//         <AgGrid
//           contextMenu={true}
//           setRowData={data => {
//             setRowData(data);
//           }}
//           ref={gridRef}
//           className="h-[50vh]"
//           rowData={rowData?.filter(item => {
//             if (searchData === "") return item;
//             return (
//               item.EQU_CODE?.toLowerCase().includes(searchData.toLowerCase()) ||
//               item.EQU_TYPE?.toLowerCase().includes(searchData.toLowerCase()) ||
//               item.EQU_CODE_NAME?.toLowerCase().includes(searchData.toLowerCase()) ||
//               item.EQU_BLOCK?.toLowerCase().includes(searchData.toLowerCase())
//             );
//           })}
//           colDefs={colDefs}
//           onDeleteRow={selectedRows => {
//             handleDeleteRows(selectedRows);
//           }}
//           onGridReady={() => {
//             gridRef.current.api.showLoadingOverlay();
//             getRowData();
//           }}
//         />
//       </Section.Content>
//     </Section>
//   );
// }
