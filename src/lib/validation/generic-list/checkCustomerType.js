import { bs_customer_type } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";

const BS_CUSTOMER_TYPE = new bs_customer_type();

export const checkCustomerType = gridRef => {
  const customerListSchema = z.object({
    CUSTOMER_TYPE_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`
      )
      .regex(
        /^\S*$/,
        `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_CODE.headerName)} không được chứa khoảng trắng.`
      ),
    CUSTOMER_TYPE_NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(BS_CUSTOMER_TYPE.CUSTOMER_TYPE_NAME.headerName)} không được để trống.`
      )
  });

  const arrSchema = z.array(customerListSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
