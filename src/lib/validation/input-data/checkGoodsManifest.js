import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";
import { dt_package_mnf_ld } from "@/components/common/aggridreact/dbColumns";
import { regexPattern } from "@/constants/regexPattern";

const DT_PACKAGE_MNF_LD = new dt_package_mnf_ld();

export const checkGoodsManifest = gridRef => {
  const dataSchema = z.object({
    HOUSE_BILL: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName)} không được để trống.`
      })
      .min(1, `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName)} không được để trống.`)
      .max(
        100,
        `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName)} không được quá 100 ký tự.`
      ),
    ITEM_TYPE_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`
      })
      .min(
        1,
        `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName)} không được để trống.`
      )
      .max(
        50,
        `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName)} không được quá 50 ký tự.`
      ),
    PACKAGE_UNIT_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName)} không được để trống.`
      })
      .min(
        1,
        `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName)} không được để trống.`
      )
      .max(
        50,
        `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName)} không được quá 50 ký tự.`
      ),
    CARGO_PIECE: z
      .number({
        required_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName)} không được để trống.`
      })
      .refine(value => value > 0, {
        message: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName)} phải lớn hơn 0.`
      })
      .refine(value => value < 1001, {
        message: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName)} phải nhỏ 1000.`
      }),
    CBM: z
      .number({
        required_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CBM.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CBM.headerName)} không được để trống.`
      })
      .refine(value => value > 0, {
        message: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CBM.headerName)} phải lớn hơn 0.`
      })
      .refine(value => value < 1001, {
        message: `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.CBM.headerName)} phải nhỏ 1000.`
      }),
    DECLARE_NO: z
      .union([
        z
          .string()
          .trim()
          .max(
            200,
            `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.DECLARE_NO.headerName)} không được quá 200 ký tự.`
          ),
        z.null()
      ])
      .optional(),
    NOTE: z
      .union([
        z
          .string()
          .trim()
          .max(
            200,
            `${rmLastAstAddBrk(DT_PACKAGE_MNF_LD.NOTE.headerName)} không được quá 200 ký tự.`
          ),
        z.null()
      ])
      .optional()
  });

  const arrSchema = z.array(dataSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
