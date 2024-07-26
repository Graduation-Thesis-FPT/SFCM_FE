import { bs_customer } from "@/components/common/aggridreact/dbColumns";
import { z } from "zod";
import { rmLastAstAddBrk } from "@/lib/utils";
import { handleResult } from "..";

const BS_CUSTOMER = new bs_customer();

export const checkCustomerList = gridRef => {
  const customerListSchema = z.object({
    CUSTOMER_TYPE_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_TYPE_CODE.headerName)} không được để trống.`),
    CUSTOMER_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_CODE.headerName)} không được để trống.`),
    CUSTOMER_NAME: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_NAME.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_NAME.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.CUSTOMER_NAME.headerName)} không được để trống.`),
    ADDRESS: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.ADDRESS.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.ADDRESS.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.ADDRESS.headerName)} không được để trống.`),
    TAX_CODE: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.TAX_CODE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.TAX_CODE.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.TAX_CODE.headerName)} không được để trống.`),
    EMAIL: z
      .string({
        required_error: `${rmLastAstAddBrk(BS_CUSTOMER.EMAIL.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(BS_CUSTOMER.EMAIL.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(BS_CUSTOMER.EMAIL.headerName)} không được để trống.`)
      .email(`${rmLastAstAddBrk(BS_CUSTOMER.EMAIL.headerName)} không đúng định dạng.`),
    IS_ACTIVE: z.boolean()
  });

  const arrSchema = z.array(customerListSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
