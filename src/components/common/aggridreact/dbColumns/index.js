class CommonColumns {
  CREATE_BY = { field: "CREATE_BY", headerName: "Người tạo" };
  CREATE_DATE = { field: "CREATE_DATE", headerName: "Ngày tạo" };
  UPDATE_BY = { field: "UPDATE_BY", headerName: "Người cập nhật" };
  UPDATE_DATE = { field: "UPDATE_DATE", headerName: "Ngày cập nhật" };
}

export class bs_warehouse extends CommonColumns {
  WAREHOUSE_CODE = { field: "WAREHOUSE_CODE", headerName: "Mã kho *" };
  WAREHOUSE_NAME = { field: "WAREHOUSE_NAME", headerName: "Tên kho *" };
  ACREAGE = { field: "ACREAGE", headerName: "Diện tích *" };
  STATUS = { field: "STATUS", headerName: "Trạng thái *" };
}

export class bs_block extends CommonColumns {
  WAREHOUSE_CODE = { field: "WAREHOUSE_CODE", headerName: "Mã kho *" };
  BLOCK_CODE = { field: "BLOCK_CODE", headerName: "Mã dãy *" };
  BLOCK_NAME = { field: "BLOCK_NAME", headerName: "Tên dãy *" };
  TIER_COUNT = { field: "TIER_COUNT", headerName: "Số tầng *" };
  SLOT_COUNT = { field: "SLOT_COUNT", headerName: "Số ô *" };
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
  WAREHOUSE_CODE = { field: "WAREHOUSE_CODE", headerName: "Mã kho *" };
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
  IS_ACTIVE = { field: "IS_ACTIVE", headerName: "Hoạt động *" };
}

export class dt_vessel_visit extends CommonColumns {
  VOYAGEKEY = { field: "VOYAGEKEY", headerName: "Mã tàu *" };
  VESSEL_NAME = { field: "VESSEL_NAME", headerName: "Tên tàu *" };
  INBOUND_VOYAGE = { field: "INBOUND_VOYAGE", headerName: "Chuyến nhập *" };
  ETA = { field: "ETA", headerName: "Ngày tàu đến *" };
  CallSign = { field: "CallSign", headerName: "CALLSIGN" };
  IMO = { field: "IMO", headerName: "IMO" };
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
  VAT = { field: "VAT", headerName: "VAT" };
  INCLUDE_VAT = { field: "INCLUDE_VAT", headerName: "Bao gồm VAT" };
}

export class trf_dis extends CommonColumns {
  ROWGUID = { field: "ROWGUID", headerName: "ROWGUID *" };
  TRF_CODE = { field: "TRF_CODE", headerName: "Mã biểu cước *" };
  TRF_DESC = { field: "TRF_DESC", headerName: "Mô tả chi tiết" };
  TRF_TEMP_CODE = { field: "TRF_TEMP_CODE", headerName: "Mã mẫu biểu cước *" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  AMT_CBM = { field: "AMT_CBM", headerName: "Tổng tiền *" };
  VAT = { field: "VAT", headerName: "VAT" };
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
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}

export class dt_pallet_stock extends CommonColumns {
  PALLET_NO = { field: "PALLET_NO", headerName: "Mã pallet *" };
  JOB_QUANTITY_ID = { field: "JOB_QUANTITY_ID", headerName: "Mã kiểm đếm *" };
  CELL_ID = { field: "CELL_ID", headerName: "Mã ô" };
  PALLET_STATUS = { field: "PALLET_STATUS", headerName: "Trạng thái pallet" };
  PALLET_LENGTH = { field: "PALLET_LENGTH", headerName: "Chiều dài (m)" };
  PALLET_WIDTH = { field: "PALLET_WIDTH", headerName: "Chiều rộng (m)" };
  PALLET_HEIGHT = { field: "PALLET_HEIGHT", headerName: "Chiều cao (m)" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
}

export class bill_info extends CommonColumns {
  AMOUNT = { field: "AMOUNT", headerName: "Thành tiền" };
  AMT_CBM = { field: "AMT_CBM", headerName: "Tổng khối lượng (m³)" };
  INCLUDE_VAT = { field: "INCLUDE_VAT", headerName: "Bao gồm VAT" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng" };
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án" };
  QTY = { field: "QTY", headerName: "Số lượng" };
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
