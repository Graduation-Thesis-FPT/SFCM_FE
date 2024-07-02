import { z } from "zod";
import { trf_std } from "@/components/common/aggridreact/dbColumns";
import { removeLastAsterisk } from "../utils";
import { handleResult } from ".";

export const checkStandardTariff = gridRef => {
  const TRF_STD = new trf_std();
  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_STD.TRF_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_STD.TRF_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_STD.TRF_CODE.headerName)} không được để trống.`),
    TRF_DESC: z.string().nullable().optional(),
    TRF_TEMP_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`)
      .optional(),
    METHOD_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`),
    ITEM_TYPE_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_STD.TRF_TEMP_CODE.headerName)} không được để trống.`),
    AMT_CBM: z
      .number({
        required_error: `${removeLastAsterisk(TRF_STD.AMT_CBM.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_STD.AMT_CBM.headerName)} không được để trống.`
      })
      .min(0, `${removeLastAsterisk(TRF_STD.AMT_CBM.headerName)} phải lớn hơn hoặc bằng 0.`),
    VAT: z
      .number()
      .min(0, `${removeLastAsterisk(TRF_STD.VAT.headerName)} phải lớn hơn hoặc bằng 0.`)
      .nullable()
      .optional(),
    INCLUDE_VAT: z.boolean()
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData.filter(row => row.status);
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
