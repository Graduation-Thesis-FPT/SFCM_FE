import { package_type } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";

const PACKAGE_TYPE = new package_type();

export const checkItemType = gridRef => {
  const tariffCodeSchema = z.object({
    ID: z
      .string({
        required_error: `${rmLastAstAddBrk(PACKAGE_TYPE.ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TYPE.ID.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(PACKAGE_TYPE.ID.headerName)} không được để trống.`),
    NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(PACKAGE_TYPE.NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TYPE.NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(PACKAGE_TYPE.NAME.headerName)} không được để trống.`)
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
