import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";
import { voyage_container_package } from "@/components/common/aggridreact/dbColumns";

const VOYAGE_CONTAINER_PACKAGE = new voyage_container_package();

export const checkVoyContPackage = gridRef => {
  const dataSchema = z.object({
    HOUSE_BILL: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName)} không được để trống.`
      )
      .max(
        100,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName)} không được quá 100 ký tự.`
      ),
    CONSIGNEE_ID: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName)} không được để trống.`
      )
      .max(
        255,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName)} không được quá 255 ký tự.`
      ),
    PACKAGE_TYPE_ID: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName)} không được để trống.`
      )
      .max(
        255,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName)} không được quá 255 ký tự.`
      ),
    PACKAGE_UNIT: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName)} không được để trống.`
      )
      .max(
        255,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName)} không được quá 50 ký tự.`
      ),
    TOTAL_ITEMS: z
      .number({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName)} không được để trống.`
      })
      .refine(value => value > 0, {
        message: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName)} phải lớn hơn 0.`
      })
      .refine(value => value < 10001, {
        message: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName)} phải nhỏ 10000.`
      }),
    CBM: z
      .number({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CBM.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CBM.headerName)} không được để trống.`
      })
      .refine(value => value > 0, {
        message: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CBM.headerName)} phải lớn hơn 0.`
      })
      .refine(value => value < 10001, {
        message: `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.CBM.headerName)} phải nhỏ 1000.`
      }),
    NOTE: z
      .union([
        z
          .string()
          .trim()
          .max(
            255,
            `${rmLastAstAddBrk(VOYAGE_CONTAINER_PACKAGE.NOTE.headerName)} không được quá 255 ký tự.`
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
