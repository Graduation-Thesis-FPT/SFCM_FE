import { bs_item_type } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";

const BS_ITEM_TYPE = new bs_item_type();

export const checkItemType = gridRef => {
  const tariffCodeSchema = z.object({
    ITEM_TYPE_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_CODE.headerName)} không được để trống.`),
    ITEM_TYPE_NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_ITEM_TYPE.ITEM_TYPE_NAME.headerName)} không được để trống.`)
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
