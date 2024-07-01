import { trf_codes } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";

export const checkTariffCode = gridRef => {
  let data = gridRef.current.props.rowData;
  const TRF_CODES = new trf_codes();

  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${TRF_CODES.TRF_CODE.headerName} không được để trống!`,
        invalid_type_error: `${TRF_CODES.TRF_CODE.headerName} không được để trống!`
      })
      .trim()
      .min(1, `${TRF_CODES.TRF_CODE.headerName} không được để trống!`),
    TRF_DESC: z
      .string({
        required_error: `${TRF_CODES.TRF_DESC.headerName} không được để trống!`,
        invalid_type_error: `${TRF_CODES.TRF_DESC.headerName}  không được để trống!`
      })
      .trim()
      .min(1, `${TRF_CODES.TRF_DESC.headerName} không được để trống!`)
  });
  const arrSchema = z.array(tariffCodeSchema);
  const result = arrSchema.safeParse(data);

  let invalidRows = [];
  if (!result.success) {
    result.error.issues.forEach(issue => {
      const rowIndex = parseInt(issue.path[0]);
      if (!invalidRows.includes(rowIndex)) {
        invalidRows.push(rowIndex);
      }
    });

    let inValidRowNode = [];
    gridRef.current.api.forEachNode(rowNode => {
      if (invalidRows.includes(Number(rowNode.id))) {
        inValidRowNode.push(rowNode);
      }
    });
    gridRef.current.api.flashCells({ rowNodes: inValidRowNode, flashDuration: 2000 });
    return { isValid: false, result: result.error.issues };
  }

  return { isValid: true, result: result };
};
