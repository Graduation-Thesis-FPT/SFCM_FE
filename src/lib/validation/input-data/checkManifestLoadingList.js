import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";
import { dt_cntr_mnf_ld } from "@/components/common/aggridreact/dbColumns";
import { regexPattern } from "@/constants/regexPattern";

const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();

export const checkManifestLoadingList = gridRef => {
  const vesselSchema = z.object({
    BILLOFLADING: z
      .union([
        z
          .string()
          .trim()
          .max(
            50,
            `${rmLastAstAddBrk(DT_CNTR_MNF_LD.BILLOFLADING.headerName)} không được quá 50 ký tự.`
          ),
        z.null()
      ])
      .optional(),
    CNTRNO: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRNO.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRNO.headerName)} không được để trống.`
      })
      .regex(
        regexPattern.CNTRNO,
        `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRNO.headerName)} không hợp lệ: gồm 4 chứ cái đầu và 7 số cuối.`
      ),
    CNTRSZTP: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRSZTP.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRSZTP.headerName)} không được để trống.`
      })
      .min(1, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRSZTP.headerName)} không được để trống.`)
      .max(5, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CNTRSZTP.headerName)} không được quá 5 ký tự.`),
    SEALNO: z
      .union([
        z
          .string()
          .trim()
          .max(30, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.SEALNO.headerName)} không được quá 30 ký tự.`),
        z.null()
      ])
      .optional(),
    CONSIGNEE: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CONSIGNEE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CONSIGNEE.headerName)} không được để trống.`
      })
      .min(1, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CONSIGNEE.headerName)} không được để trống.`)
      .max(50, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.CONSIGNEE.headerName)} không được quá 50 ký tự.`),
    ITEM_TYPE_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`
      })
      .min(1, `${rmLastAstAddBrk(DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`)
      .max(
        50,
        `${rmLastAstAddBrk(DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName)} không được quá 50 ký tự.`
      ),
    COMMODITYDESCRIPTION: z
      .union([
        z
          .string()
          .trim()
          .max(
            200,
            `${rmLastAstAddBrk(DT_CNTR_MNF_LD.COMMODITYDESCRIPTION.headerName)} không được quá 200 ký tự.`
          ),
        z.null()
      ])
      .optional()
  });

  const arrSchema = z.array(vesselSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
