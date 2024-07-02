import { trf_codes } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { removeLastAsterisk } from "../utils";
import { handleResult } from ".";

export const checkTariffCode = gridRef => {
  const TRF_CODES = new trf_codes();
  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`),
    TRF_DESC: z
      .string({
        required_error: `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`)
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData.filter(row => row.status);
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
