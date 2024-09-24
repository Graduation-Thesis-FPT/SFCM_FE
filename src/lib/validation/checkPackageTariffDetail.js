import { z } from "zod";
import { package_tariff_detail } from "@/components/common/aggridreact/dbColumns";
import { rmLastAstAddBrk } from "../utils";
import { handleResult } from ".";
const PACKAGE_TARIFF_DETAIL = new package_tariff_detail();

export const checkPackageTariffDetail = gridRef => {
  const tariffCodeSchema = z.object({
    PACKAGE_TYPE_ID: z
      .string({
        required_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TYPE_ID.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TYPE_ID.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TYPE_ID.headerName)} không được để trống.`
      ),
    PACKAGE_TARIFF_DESCRIPTION: z
      .string({
        required_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.headerName)} không được để trống.`
      })
      .trim()
      .min(
        1,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.headerName)} không được để trống.`
      )
      .max(
        255,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.PACKAGE_TARIFF_DESCRIPTION.headerName)} không được vượt quá 255 ký tự.`
      ),
    UNIT: z
      .string({
        required_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT.headerName)} không được để trống.`
      })
      .trim()
      .min(1, `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT.headerName)} không được để trống.`),

    UNIT_PRICE: z
      .number({
        required_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT_PRICE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT_PRICE.headerName)} không được để trống.`
      })
      .min(
        1000,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.UNIT_PRICE.headerName)} phải lớn hơn hoặc bằng 1000.`
      ),
    VAT_RATE: z
      .number({
        required_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.VAT_RATE.headerName)} không được để trống.`,
        invalid_type_error: `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.VAT_RATE.headerName)} không được để trống.`
      })
      .min(
        0,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.VAT_RATE.headerName)} phải lớn hơn hoặc bằng 0.`
      )
      .max(
        100,
        `${rmLastAstAddBrk(PACKAGE_TARIFF_DETAIL.VAT_RATE.headerName)} phải nhỏ hơn hoặc bằng 100.`
      )
  });

  const arrSchema = z.array(tariffCodeSchema);
  const rowData = gridRef.current.props.rowData;
  const result = arrSchema.safeParse(rowData);

  return handleResult(result, gridRef);
};
