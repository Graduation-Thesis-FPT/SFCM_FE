class CommonColumns {
  CREATED_BY = { field: "CREATED_BY", headerName: "Người tạo" };
  CREATED_AT = { field: "CREATED_AT", headerName: "Ngày tạo" };
  UPDATED_BY = { field: "UPDATED_BY", headerName: "Người cập nhật" };
  UPDATED_AT = { field: "UPDATED_AT", headerName: "Ngày cập nhật" };
}

export class bs_warehouse extends CommonColumns {
  ID = { field: "ID", headerName: "Mã kho *" };
  NAME = { field: "NAME", headerName: "Tên kho *" };
  ACREAGE = { field: "ACREAGE", headerName: "Diện tích *" };
  STATUS = { field: "STATUS", headerName: "Trạng thái *" };
}

export class bs_block extends CommonColumns {
  ID = { field: "ID", headerName: "Mã dãy *" };
  NAME = { field: "NAME", headerName: "Tên dãy *" };
  WAREHOUSE_ID = { field: "WAREHOUSE_ID", headerName: "Mã kho *" };
  TOTAL_TIERS = { field: "TOTAL_TIERS", headerName: "Số tầng *" };
  TOTAL_CELLS = { field: "TOTAL_CELLS", headerName: "Số ô *" };
  BLOCK_WIDTH = { field: "BLOCK_WIDTH", headerName: "Chiều rộng (m)*" };
  BLOCK_HEIGHT = { field: "BLOCK_HEIGHT", headerName: "Chiều cao (m)*" };
  BLOCK_LENGTH = { field: "BLOCK_LENGTH", headerName: "Chiều dài (m)*" };
}

export class bs_gate extends CommonColumns {
  GATE_CODE = { field: "GATE_CODE", headerName: "Mã cổng *" };
  GATE_NAME = { field: "GATE_NAME", headerName: "Tên cổng *" };
  IS_IN_OUT = { field: "IS_IN_OUT", headerName: "Loại cổng *" };
}

export class bs_equipment_type extends CommonColumns {
  EQU_TYPE = { field: "EQU_TYPE", headerName: "Mã loại thiết bị *" };
  EQU_TYPE_NAME = { field: "EQU_TYPE_NAME", headerName: "Tên loại thiết bị *" };
}

export class bs_equipment extends CommonColumns {
  EQU_TYPE = { field: "EQU_TYPE", headerName: "Mã loại thiết bị *" };
  EQU_CODE = { field: "EQU_CODE", headerName: "Mã thiết bị *" };
  EQU_CODE_NAME = { field: "EQU_CODE_NAME", headerName: "Tên thiết bị *" };
  ID = { field: "ID", headerName: "Mã kho *" };
}

export class bs_method extends CommonColumns {
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  METHOD_NAME = { field: "METHOD_NAME", headerName: "Tên phương án *" };
  IS_IN_OUT = { field: "IS_IN_OUT", headerName: "Trạng thái *" };
  IS_SERVICE = { field: "IS_SERVICE", headerName: "Dịch vụ đính kèm *" };
}

export class bs_item_type extends CommonColumns {
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  ITEM_TYPE_NAME = { field: "ITEM_TYPE_NAME", headerName: "Tên loại hàng *" };
}

export class package_type extends CommonColumns {
  ID = { field: "ID", headerName: "Mã loại hàng *" };
  NAME = { field: "NAME", headerName: "Tên loại hàng *" };
}

export class bs_backage_unit extends CommonColumns {
  PACKAGE_UNIT_CODE = { field: "PACKAGE_UNIT_CODE", headerName: "Mã đơn vị *" };
  PACKAGE_UNIT_NAME = { field: "PACKAGE_UNIT_NAME", headerName: "Tên đơn vị *" };
}

export class bs_customer_type extends CommonColumns {
  CUSTOMER_TYPE_CODE = { field: "CUSTOMER_TYPE_CODE", headerName: "Mã loại khách hàng *" };
  CUSTOMER_TYPE_NAME = { field: "CUSTOMER_TYPE_NAME", headerName: "Tên loại khách hàng *" };
}

export class bs_customer extends CommonColumns {
  CUSTOMER_TYPE_CODE = { field: "CUSTOMER_TYPE_CODE", headerName: "Mã loại khách hàng *" };
  CUSTOMER_CODE = { field: "CUSTOMER_CODE", headerName: "Mã khách hàng *" };
  CUSTOMER_NAME = { field: "CUSTOMER_NAME", headerName: "Tên khách hàng *" };
  ADDRESS = { field: "ADDRESS", headerName: "Địa chỉ *" };
  TAX_CODE = { field: "TAX_CODE", headerName: "Mã số thuế *" };
  EMAIL = { field: "EMAIL", headerName: "Email *" };
  IS_ACTIVE = { field: "IS_ACTIVE", headerName: "Trạng thái *" };
}
export class customer extends CommonColumns {
  ID = { field: "ID", headerName: "Mã khách hàng *" };
  USERNAME = { field: "USERNAME", headerName: "Tên tài khoản*" };
  CUSTOMER_TYPE = { field: "CUSTOMER_TYPE", headerName: "Loại khách hàng *" };
  TAX_CODE = { field: "TAX_CODE", headerName: "Mã số thuế *" };
}

export class user extends CommonColumns {
  USERNAME = { field: "USERNAME", headerName: "Tên tài khoản*" };
  PASSWORD = { field: "PASSWORD", headerName: "Mật khẩu*" };
  ROLE_ID = { field: "ROLE_ID", headerName: "Vai trò*" };
  FULLNAME = { field: "FULLNAME", headerName: "Họ và tên*" };
  BIRTHDAY = { field: "BIRTHDAY", headerName: "Ngày sinh*" };
  ADDRESS = { field: "ADDRESS", headerName: "Địa chỉ*" };
  TELEPHONE = { field: "TELEPHONE", headerName: "Số điện thoại*" };
  EMAIL = { field: "EMAIL", headerName: "Email*" };
  IS_ACTIVE = { field: "IS_ACTIVE", headerName: "Hoạt động*" };
  REMARK = { field: "REMARK", headerName: "Ghi chú*" };
}

export class container_tariff extends CommonColumns {
  ID = { field: "ID", headerName: "Mã biểu cước *" };
  NAME = { field: "NAME", headerName: "Tên biểu cước *" };
  CNTR_SIZE = { field: "CNTR_SIZE", headerName: "Kích thước cont *" };
  UNIT_PRICE = { field: "UNIT_PRICE", headerName: "Tổng tiền (VND) *" };
  VAT_RATE = { field: "VAT_RATE", headerName: "VAT (%) *" };
  VALID_FROM = { field: "VALID_FROM", headerName: "Sử dụng từ ngày *" };
  VALID_UNTIL = { field: "VALID_UNTIL", headerName: "Sử dụng đến ngày *" };
  STATUS = { field: "STATUS", headerName: "Trạng thái" };
}

export class dt_vessel_visit extends CommonColumns {
  VOYAGEKEY = { field: "VOYAGEKEY", headerName: "Mã tàu *" };
  VESSEL_NAME = { field: "VESSEL_NAME", headerName: "Tên tàu *" };
  INBOUND_VOYAGE = { field: "INBOUND_VOYAGE", headerName: "Chuyến nhập *" };
  ETA = { field: "ETA", headerName: "Ngày tàu đến *" };
  CallSign = { field: "CallSign", headerName: "CALLSIGN" };
  IMO = { field: "IMO", headerName: "IMO" };
}

export class voyage extends CommonColumns {
  ID = { field: "ID", headerName: "Mã chuyến tàu *" };
  VESSEL_NAME = { field: "VESSEL_NAME", headerName: "Tên tàu *" };
  ETA = { field: "ETA", headerName: "Ngày tàu đến *" };
}

export class dt_cntr_mnf_ld extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  VOYAGEKEY = { field: "VOYAGEKEY", headerName: "Mã tàu *" };
  BILLOFLADING = { field: "BILLOFLADING", headerName: "Số vận đơn" };
  SEALNO = { field: "SEALNO", headerName: "Số seal" };
  CNTRNO = { field: "CNTRNO", headerName: "Số container *" };
  CNTRSZTP = { field: "CNTRSZTP", headerName: "Kích cỡ container *" };
  STATUSOFGOOD = { field: "STATUSOFGOOD", headerName: "Trạng thái container *" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  CONSIGNEE = { field: "CONSIGNEE", headerName: "Mã đại lý *" };
  COMMODITYDESCRIPTION = { field: "COMMODITYDESCRIPTION", headerName: "Ghi chú" };
}

export class voyage_container extends CommonColumns {
  ID = { field: "ID", headerName: "Mã container chuyến tàu *" };
  VOYAGE_ID = { field: "VOYAGE_ID", headerName: "Mã chuyến tàu *" };
  CNTR_NO = { field: "CNTR_NO", headerName: "Số container *" };
  SHIPPER_ID = { field: "SHIPPER_ID", headerName: "Mã đại lý *" };
  CNTR_SIZE = { field: "CNTR_SIZE", headerName: "Kích thước container *" };
  SEAL_NO = { field: "SEAL_NO", headerName: "Số seal" };
  STATUS = { field: "STATUS", headerName: "Trạng thái container *" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}
export class dt_package_mnf_ld extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  PACKAGE_UNIT_CODE = { field: "PACKAGE_UNIT_CODE", headerName: "Đơn vị tính *" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  CONTAINER_ID = { field: "CONTAINER_ID", headerName: "Container tham chiếu *" };
  HOUSE_BILL = { field: "HOUSE_BILL", headerName: "Số House Bill *" };
  CARGO_PIECE = { field: "CARGO_PIECE", headerName: "Số lượng" };
  CBM = { field: "CBM", headerName: "Số khối (m³) *" };
  DECLARE_NO = { field: "DECLARE_NO", headerName: "Số tờ khai" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}

export class voyage_container_package extends CommonColumns {
  ID = { field: "ID", headerName: "Mã hàng hóa *" };
  VOYAGE_CONTAINER_ID = { field: "VOYAGE_CONTAINER_ID", headerName: "Mã container chuyến tàu *" };
  HOUSE_BILL = { field: "HOUSE_BILL", headerName: "Số House Bill *" };
  PACKAGE_TYPE_ID = { field: "PACKAGE_TYPE_ID", headerName: "Mã loại hàng *" };
  CONSIGNEE_ID = { field: "CONSIGNEE_ID", headerName: "Mã chủ hàng *" };
  PACKAGE_UNIT = { field: "PACKAGE_UNIT", headerName: "Đơn vị hàng *" };
  CBM = { field: "CBM", headerName: "Tổng số khối (m³) *" };
  TOTAL_ITEMS = { field: "TOTAL_ITEMS", headerName: "Tổng số lượng *" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
  TIME_IN = { field: "TIME_IN", headerName: "Thời gian vào" };
  STATUS = { field: "STATUS", headerName: "Trạng thái" };
}

export class trf_codes extends CommonColumns {
  TRF_CODE = { field: "TRF_CODE", headerName: "Mã biểu cước *" };
  TRF_DESC = { field: "TRF_DESC", headerName: "Mô tả *" };
}

export class trf_temp extends CommonColumns {
  TRF_TEMP_CODE = { field: "TRF_TEMPLATE", headerName: "Mã mẫu biểu cước *" };
  TRF_TEMP_NAME = { field: "TRF_NAME", headerName: "Tên mẫu biểu cước *" };
  FROM_DATE = { field: "FROM_DATE", headerName: "Hiệu lực từ ngày *" };
  TO_DATE = { field: "TO_DATE", headerName: "Hiệu lực đến ngày *" };
}

export class trf_std extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  TRF_CODE = { field: "TRF_CODE", headerName: "Mã biểu cước *" };
  TRF_DESC = { field: "TRF_DESC", headerName: "Mô tả chi tiết" };
  TRF_TEMP_CODE = { field: "TRF_TEMP_CODE", headerName: "Mã mẫu biểu cước *" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  AMT_CBM = { field: "AMT_CBM", headerName: "Tổng tiền *" };
  VAT = { field: "VAT", headerName: "VAT *" };
  INCLUDE_VAT = { field: "INCLUDE_VAT", headerName: "Bao gồm VAT" };
}

export class package_tariff_detail extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "Mã chi tiết biểu cước *" };
  PACKAGE_TARIFF_ID = { field: "PACKAGE_TARIFF_ID", headerName: "Mã biểu cước *" };
  PACKAGE_TYPE_ID = { field: "PACKAGE_TYPE_ID", headerName: "Mã loại hàng *" };
  PACKAGE_TARIFF_DESCRIPTION = {
    field: "PACKAGE_TARIFF_DESCRIPTION",
    headerName: "Mô tả chi tiết *"
  };
  UNIT = { field: "UNIT", headerName: "Đơn vị tính *" };
  UNIT_PRICE = { field: "UNIT_PRICE", headerName: "Tổng tiền *" };
  VAT_RATE = { field: "VAT_RATE", headerName: "VAT (%) *" };
  STATUS = { field: "STATUS", headerName: "Trạng thái *" };
}

export class trf_dis extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  TRF_CODE = { field: "TRF_CODE", headerName: "Mã biểu cước *" };
  TRF_DESC = { field: "TRF_DESC", headerName: "Mô tả chi tiết" };
  TRF_TEMP_CODE = { field: "TRF_TEMP_CODE", headerName: "Mã mẫu biểu cước *" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  AMT_CBM = { field: "AMT_CBM", headerName: "Tổng tiền *" };
  VAT = { field: "VAT", headerName: "VAT *" };
  INCLUDE_VAT = { field: "INCLUDE_VAT", headerName: "Bao gồm VAT" };
  CUSTOMER_CODE = { field: "CUSTOMER_CODE", headerName: "Mã khách hàng *" };
}

export class config_attach_srv extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  ATTACH_SERVICE_CODE = { field: "ATTACH_SERVICE_CODE", headerName: "Mã dịch vụ *" };
}

export class deliver_order extends CommonColumns {
  DE_ORDER_NO = { field: "DE_ORDER_NO", headerName: "Mã đơn hàng *" };
  CUSTOMER_CODE = { field: "CUSTOMER_CODE", headerName: "Mã khách hàng *" };
  CONTAINER_ID = { field: "CONTAINER_ID", headerName: "Số container" };
  PACKAGE_ID = { field: "PACKAGE_ID", headerName: "Số lô" };
  INV_ID = { field: "INV_ID", headerName: "Số hóa đơn" };
  INV_DRAFT_ID = { field: "INV_DRAFT_ID", headerName: "Số hóa đơn tạm" };
  ISSUE_DATE = { field: "ISSUE_DATE", headerName: "Ngày làm lệnh *" };
  EXP_DATE = { field: "EXP_DATE", headerName: "Ngày hết hạn lệnh *" };
  TOTAL_CBM = { field: "TOTAL_CBM", headerName: "Tổng khối lượng (m³)" };
  JOB_CHK = { field: "JOB_CHK", headerName: "Kiểm đếm *" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}

export class job_quantity_check extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  PACKAGE_ID = { field: "PACKAGE_ID", headerName: "Số lô *" };
  ESTIMATED_CARGO_PIECE = { field: "ESTIMATED_CARGO_PIECE", headerName: "Số lượng hàng *" };
  ACTUAL_CARGO_PIECE = { field: "ACTUAL_CARGO_PIECE", headerName: "Tổng số lượng kiện hàng" };
  SEQ = { field: "SEQ", headerName: "Thứ tự" };
  START_DATE = { field: "START_DATE", headerName: "Ngày bắt đầu" };
  FINISH_DATE = { field: "FINISH_DATE", headerName: "Ngày kết thúc" };
  JOB_STATUS = { field: "JOB_STATUS", headerName: "Trạng thái" };
}

export class dt_pallet_stock extends CommonColumns {
  PALLET_NO = { field: "PALLET_NO", headerName: "Mã pallet *" };
  JOB_QUANTITY_ID = { field: "JOB_QUANTITY_ID", headerName: "Mã kiểm đếm *" };
  CELL_ID = { field: "CELL_ID", headerName: "Mã ô" };
  PALLET_STATUS = { field: "PALLET_STATUS", headerName: "Trạng thái pallet" };
  PALLET_LENGTH = { field: "PALLET_LENGTH", headerName: "Chiều dài (m) *" };
  PALLET_WIDTH = { field: "PALLET_WIDTH", headerName: "Chiều rộng (m) *" };
  PALLET_HEIGHT = { field: "PALLET_HEIGHT", headerName: "Chiều cao (m) *" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}

export class bill_info extends CommonColumns {
  AMOUNT = { field: "AMOUNT", headerName: "Thành tiền" };
  AMT_CBM = { field: "AMT_CBM", headerName: "Tổng khối lượng (m³)" };
  INCLUDE_VAT = { field: "INCLUDE_VAT", headerName: "Bao gồm VAT" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án" };
  METHOD_NAME = { field: "METHOD_NAME", headerName: "Tên phương án" };
  QTY = { field: "QTY", headerName: "Tổng số khối (m³)" };
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID" };
  TAMOUNT = { field: "TAMOUNT", headerName: "Tổng tiền" };
  TRF_CODE = { field: "TRF_CODE", headerName: "Mã biểu cước" };
  TRF_DESC = { field: "TRF_DESC", headerName: "Mô tả chi tiết" };
  TRF_TEMP_CODE = { field: "TRF_TEMP_CODE", headerName: "Mã mẫu biểu cước" };
  UNIT_RATE = { field: "UNIT_RATE", headerName: "Đơn giá" };
  VAT = { field: "VAT", headerName: "VAT (%)" };
  VAT_PRICE = { field: "VAT_PRICE", headerName: "Tiền VAT" };
}

export class bs_order_tracking extends CommonColumns {
  DE_ORDER_NO = { field: "DE_ORDER_NO", headerName: "Mã đơn hàng" };
  CONTAINER_ID = { field: "CONTAINER_ID", headerName: "Số container" };
  PACKAGE_ID = { field: "PACKAGE_ID", headerName: "Số kiện hàng" };
  INV_ID = { field: "INV_ID", headerName: "Số hóa đơn" };
  INV_DRAFT_ID = { field: "INV_DRAFT_ID", headerName: "Số hóa đơn tạm" };
  ISSUE_DATE = { field: "ISSUE_DATE", headerName: "Ngày làm lệnh" };
  EXP_DATE = { field: "EXP_DATE", headerName: "Ngày hết hạn lệnh" };
  TOTAL_CBM = { field: "TOTAL_CBM", headerName: "Tổng khối lượng (m³)" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}
