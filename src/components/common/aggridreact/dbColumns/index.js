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
  EQU_CODE_NAME = { field: "EQU_CODE_NAME", headerName: "Tên thiết bị" };
  BLOCK_CODE = { field: "BLOCK_CODE", headerName: "Mã dãy" };
  BLOCK = { field: "BLOCK", headerName: "Dãy" };
}

export class bs_method extends CommonColumns {
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  METHOD_NAME = { field: "METHOD_NAME", headerName: "Tên phương án *" };
  IS_IN_OUT = { field: "IS_IN_OUT", headerName: "Trạng thái *" };
  IS_SERVICE = { field: "IS_SERVICE", headerName: "Dịch vụ *" };
}

export class bs_item_type extends CommonColumns {
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  ITEM_TYPE_NAME = { field: "ITEM_TYPE_NAME", headerName: "Tên loại hàng *" };
}

export class bs_unit extends CommonColumns {
  UNIT_CODE = { field: "UNIT_CODE", headerName: "Mã đơn vị *" };
  UNIT_NAME = { field: "UNIT_NAME", headerName: "Tên đơn vị *" };
}

export class bs_customer_type extends CommonColumns {
  CUSTOMER_TYPE_CODE = { field: "CUSTOMER_TYPE_CODE", headerName: "Mã loại khách hàng *" };
  CUSTOMER_TYPE_NAME = { field: "CUSTOMER_TYPE_NAME", headerName: "Tên loại khách hàng *" };
}

export class bs_customer extends CommonColumns {
  CUSTOMER_TYPE_CODE = { field: "CUSTOMER_TYPE_CODE", headerName: "Mã loại khách hàng *" };
  CUSTOMER_CODE = { field: "CUSTOMER_CODE", headerName: "Mã khách hàng *" };
  CUSTOMER_NAME = { field: "CUSTOMER_NAME", headerName: "Tên khách hàng *" };
  ADDRESS = { field: "ADDRESS", headerName: "Địa chỉ" };
  TAX_CODE = { field: "TAX_CODE", headerName: "Mã số thuế *" };
  EMAIL = { field: "EMAIL", headerName: "Email" };
  IS_ACTIVE = { field: "IS_ACTIVE", headerName: "Hoạt động *" };
}

export class dt_vessel_visit extends CommonColumns {
  VOYAGEKEY = { field: "VOYAGEKEY", headerName: "Mã tàu *" };
  VESSEL_NAME = { field: "VESSEL_NAME", headerName: "Tên tàu *" };
  INBOUND_VOYAGE = { field: "INBOUND_VOYAGE", headerName: "Chuyến nhập *" };
  OUTBOUND_VOYAGE = { field: "OUTBOUND_VOYAGE", headerName: "Chuyến xuất" };
  ETA = { field: "ETA", headerName: "Ngày tàu đến *" };
  ETD = { field: "ETD", headerName: "Ngày tàu rời" };
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
  HOUSE_BILL = { field: "HOUSE_BILL", headerName: "Số House Bill *" };
  LOT_NO = { field: "LOT_NO", headerName: "Số lô" };
  ITEM_TYPE_CODE = { field: "ITEM_TYPE_CODE", headerName: "Mã loại hàng *" };
  UNIT_CODE = { field: "UNIT_CODE", headerName: "Đơn vị tính *" };
  CARGO_PIECE = { field: "CARGO_PIECE", headerName: "Số lượng *" };
  CBM = { field: "CBM", headerName: "CBM *" };
  DECLARE_NO = { field: "DECLARE_NO", headerName: "Số tờ khai" };
  NOTE = { field: "NOTE", headerName: "Ghi chú" };
  REF_CONTAINER = { field: "REF_CONTAINER", headerName: "Container tham chiếu *" };
}
