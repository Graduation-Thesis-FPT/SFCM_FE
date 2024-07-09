import { bs_backage_unit } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { removeLastAsteriskAndAddBrackets } from "@/lib/utils";
import { handleResult } from "..";

export const checkPackageUnit = gridRef => {
  const BS_PACKAGE_UNIT = new bs_backage_unit();
  const tariffCodeSchema = z.object({
    PACKAGE_UNIT_CODE: z
      .string({
        required_error: `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_CODE.headerName)} không được để trống.`
      ),
    PACKAGE_UNIT_NAME: z
      .string({
        required_error: `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${removeLastAsteriskAndAddBrackets(BS_PACKAGE_UNIT.PACKAGE_UNIT_NAME.headerName)} không được để trống.`
      )
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
