import { z } from "zod";
import { trf_dis } from "@/components/common/aggridreact/dbColumns";
import { removeLastAsterisk } from "../utils";
import { handleResult } from ".";

export const checkDiscountTariff = gridRef => {
  const TRF_DIS = new trf_dis();
  const tariffCodeSchema = z.object({
    TRF_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_DIS.TRF_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.TRF_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_DIS.TRF_CODE.headerName)} không được để trống.`),
    TRF_DESC: z.string().nullable().optional(),
    TRF_TEMP_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_DIS.TRF_TEMP_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.TRF_TEMP_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_DIS.TRF_TEMP_CODE.headerName)} không được để trống.`)
      .optional(),
    METHOD_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_DIS.METHOD_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.METHOD_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_DIS.METHOD_CODE.headerName)} không được để trống.`),
    CUSTOMER_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_DIS.CUSTOMER_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.CUSTOMER_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_DIS.CUSTOMER_CODE.headerName)} không được để trống.`),
    ITEM_TYPE_CODE: z
      .string({
        required_error: `${removeLastAsterisk(TRF_DIS.ITEM_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.ITEM_TYPE_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${removeLastAsterisk(TRF_DIS.ITEM_TYPE_CODE.headerName)} không được để trống.`),
    AMT_CBM: z
      .number({
        required_error: `${removeLastAsterisk(TRF_DIS.AMT_CBM.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsterisk(TRF_DIS.AMT_CBM.headerName)} không được để trống.`
      })
      .min(0, `${removeLastAsterisk(TRF_DIS.AMT_CBM.headerName)} phải lớn hơn hoặc bằng 0.`),
    VAT: z
      .number()
      .min(0, `${removeLastAsterisk(TRF_DIS.VAT.headerName)} phải lớn hơn hoặc bằng 0.`)
      .nullable()
      .optional(),
    INCLUDE_VAT: z.boolean()
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
