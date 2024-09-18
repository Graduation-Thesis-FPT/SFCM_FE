import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";
import { voyage_container } from "@/components/common/aggridreact/dbColumns";
import { regexPattern } from "@/constants/regexPattern";

const VOYAGE_CONTAINER = new voyage_container();

export const checkVoyageContainer = gridRef => {
  const voyageContainerSchema = z.object({
    CNTR_NO: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_NO.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_NO.headerName)} không được để trống.`
      })
      .regex(
        regexPattern.CNTR_NO,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_NO.headerName)} không hợp lệ: gồm 4 chứ cái đầu và 7 số cuối.`
      ),
    CNTR_SIZE: z
      .number({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_SIZE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_SIZE.headerName)} không được để trống.`
      })
      .refine(val => [20, 40, 45].includes(val), {
        message: `${rmLastAstAddBrk(VOYAGE_CONTAINER.CNTR_SIZE.headerName)} không hợp lệ.`
      }),
    SHIPPER_ID: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.SHIPPER_ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE_CONTAINER.SHIPPER_ID.headerName)} không được để trống.`
      })
      .min(1, `${rmLastAstAddBrk(VOYAGE_CONTAINER.SHIPPER_ID.headerName)} không được để trống.`)
      .max(
        255,
        `${rmLastAstAddBrk(VOYAGE_CONTAINER.SHIPPER_ID.headerName)} không được quá 255 ký tự.`
      ),
    SEAL_NO: z
      .union([
        z
          .string()
          .trim()
          .max(
            255,
            `${rmLastAstAddBrk(VOYAGE_CONTAINER.SEAL_NO.headerName)} không được quá 255 ký tự.`
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
            255,
            `${rmLastAstAddBrk(VOYAGE_CONTAINER.NOTE.headerName)} không được quá 255 ký tự.`
          ),
        z.null()
      ])
      .optional()
  });

  const arrSchema = z.array(voyageContainerSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
