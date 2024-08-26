import { trf_codes } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "../utils";
import { handleResult } from ".";

export const checkTariffCode = gridRef => {
  const TRF_CODES = new trf_codes();
  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(TRF_CODES.TRF_CODE.headerName)} không được để trống.`),
    TRF_DESC: z
      .string({
        required_error: `${rmLastAstAddBrk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(TRF_CODES.TRF_DESC.headerName)} không được để trống.`)
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
