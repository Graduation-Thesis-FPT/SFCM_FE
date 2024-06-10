class CommonColumns {
  CREATE_BY = { field: "CREATE_BY", headerName: "Người tạo" };
  CREATE_DATE = { field: "CREATE_DATE", headerName: "Ngày tạo" };
  UPDATE_BY = { field: "UPDATE_BY", headerName: "Người cập nhật" };
  UPDATE_DATE = { field: "UPDATE_DATE", headerName: "Ngày cập nhật" };
}

export class bs_equipment_type extends CommonColumns {
  EQU_TYPE = { field: "EQU_TYPE", headerName: "Mã thiết bị *" };
  EQU_TYPE_NAME = { field: "EQU_TYPE_NAME", headerName: "Tên thiết bị *" };
}

export class bs_equipment extends CommonColumns {
  EQU_CODE = { field: "EQU_CODE", headerName: "Mã thiết bị *" };
  EQU_TYPE = { field: "EQU_TYPE", headerName: "Loại thiết bị *" };
  EQU_CODE_NAME = { field: "EQU_CODE_NAME", headerName: "Tên thiết bị" };
  BLOCK_CODE = { field: "BLOCK_CODE", headerName: "Mã dãy" };
  BLOCK = { field: "BLOCK", headerName: "Dãy" };
}

export class bs_method extends CommonColumns {
  METHOD_CODE = { field: "METHOD_CODE", headerName: "Mã phương án *" };
  METHOD_NAME = { field: "METHOD_NAME", headerName: "Tên phương án *" };
  IS_IN_OUT = { field: "EQU_CODE_NAME", headerName: "Trạng thái" };
  IS_SERVICE = { field: "IS_SERVICE", headerName: "Dịch vụ" };
}
