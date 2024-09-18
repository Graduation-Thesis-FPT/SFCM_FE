import { voyage } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";
import { regexPattern } from "@/constants/regexPattern";

const VOYAGE = new voyage();

export const checkVoyage = gridRef => {
  const vesselSchema = z.object({
    ID: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE.ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE.ID.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(VOYAGE.ID.headerName)} không được để trống.`)
      .max(255, `${rmLastAstAddBrk(VOYAGE.ID.headerName)} không được quá 255 ký tự.`)
      .regex(
        regexPattern.NO_SPACE,
        `${rmLastAstAddBrk(VOYAGE.ID.headerName)} không được chứa khoảng trắng.`
      ),
    VESSEL_NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(VOYAGE.VESSEL_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(VOYAGE.VESSEL_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(VOYAGE.VESSEL_NAME.headerName)} không được để trống.`)
      .max(255, `${rmLastAstAddBrk(VOYAGE.VESSEL_NAME.headerName)} không được quá 255 ký tự.`),
    ETA: z.date({
      required_error: `${rmLastAstAddBrk(VOYAGE.ETA.headerName)} không được để trống.`,
      invalid_type_error: `${rmLastAstAddBrk(VOYAGE.ETA.headerName)} không hợp lệ.`
    })
  });

  const arrSchema = z.array(vesselSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
