import { dt_vessel_visit } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";

const DT_VESSEL_VISIT = new dt_vessel_visit();

export const checkVessel = gridRef => {
  const vesselSchema = z.object({
    VESSEL_NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.VESSEL_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.VESSEL_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(DT_VESSEL_VISIT.VESSEL_NAME.headerName)} không được để trống.`)
      .max(
        100,
        `${rmLastAstAddBrk(DT_VESSEL_VISIT.VESSEL_NAME.headerName)} không được quá 100 ký tự.`
      ),
    INBOUND_VOYAGE: z
      .string({
        required_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName)} không được để trống.`)
      .max(
        20,
        `${rmLastAstAddBrk(DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName)} không được quá 20 ký tự.`
      ),
    ETA: z.date({
      required_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.ETA.headerName)} không được để trống.`,
      invalid_type_error: `${rmLastAstAddBrk(DT_VESSEL_VISIT.ETA.headerName)} không hợp lệ.`
    }),
    CallSign: z
      .union([
        z
          .string()
          .trim()
          .max(
            50,
            `${rmLastAstAddBrk(DT_VESSEL_VISIT.CallSign.headerName)} không được quá 50 ký tự.`
          ),
        z.null()
      ])
      .optional(),
    IMO: z
      .union([
        z
          .string()
          .trim()
          .max(30, `${rmLastAstAddBrk(DT_VESSEL_VISIT.IMO.headerName)} không được quá 30 ký tự.`),
        z.null()
      ])
      .optional()
  });

  const arrSchema = z.array(vesselSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
