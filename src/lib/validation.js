import { trf_codes } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { removeLastAsterisk } from "./utils";

const handleResult = (result, gridRef) => {
  if (!result.success) {
    let invalidRows = [];
    result.error.issues.forEach(issue => {
      const rowIndex = parseInt(issue.path[0]);
      if (!invalidRows.includes(rowIndex)) {
        invalidRows.push(rowIndex);
      }
    });

    let invalidRowNodes = [];
    gridRef.current.api.forEachNode(rowNode => {
      if (invalidRows.includes(Number(rowNode.id))) {
        invalidRowNodes.push(rowNode);
      }
    });
    gridRef.current.api.flashCells({ rowNodes: invalidRowNodes, flashDuration: 3000 });
    return { isValid: false, result: result.error.issues };
  }

  return { isValid: true, result: result };
};

export const checkTariffCode = gridRef => {
  const TRF_CODES = new trf_codes();
  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống!`,
        invalid_type_error: `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống!`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống!`),
    TRF_DESC: z
      .string({
        required_error: `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống!`,
        invalid_type_error: `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống!`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống!`)
  });

  const arrSchema = z.array(tariffCodeSchema);
  const data = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(data);

  return handleResult(result, gridRef);
};
