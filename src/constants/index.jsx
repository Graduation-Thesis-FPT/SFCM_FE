export const ERROR_MESSAGE = {
  INVALID_REQUEST_MISSING_TOKEN: "Yêu cầu không hợp lệ, thiếu token",
  INVALID_REQUEST: "Yêu cầu không hợp lệ",
  MISSING_MENU_CODE: "Thiếu mã menu",
  YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE: "Bạn không có quyền truy cập trang này",
  YOU_DO_NOT_HAVE_THIS_PERMISSION: "Bạn không có quyền này",
  INVALID_USER_ID: "ID người dùng không hợp lệ",
  INVALID_ID: "ID không hợp lệ",
  USER_NAME_NOT_EXIST: "Tên người dùng không tồn tại",
  USER_IS_NOT_ACTIVE: "Người dùng không hoạt động",
  PASSWORD_IS_INCORRECT: "Mật khẩu không đúng",
  PASSWORD_IS_ALREADY: "Mật khẩu đã tồn tại",
  PASSWORD_IS_DEFAULT: "Mật khẩu là mặc định",
  UPDATE_PASSWORD_FAILED: "Cập nhật mật khẩu thất bại",
  USER_ALREADY_EXIST: "Người dùng đã tồn tại",
  USER_NOT_EXIST: "Người dùng không tồn tại",
  USER_NAME_IS_DUPLICATED: "Tên người dùng bị trùng",
  INTERNAL_SERVER_ERROR: "Lỗi máy chủ nội bộ",
  INVALID_TOKEN_PLEASE_LOGIN_AGAIN: "Token không hợp lệ, vui lòng đăng nhập lại",

  // Warehouse error
  WAREHOUSE_NOT_EXIST: "Kho hàng không tồn tại",
  INVALID_WAREHOUSE_CODE: "Mã kho hàng không hợp lệ",
  // Warehouse - block
  BLOCK_DUPLICATED: "Dãy bị trùng",
  BLOCK_NOT_EXIST: "Dãy không tồn tại",

  // gate
  GATE_NOT_EXIST: "Cổng không tồn tại", // check cổng này tồn tại hay không

  // equip type
  EQUIPTYPE_NOT_EXIST: "Loại thiết bị không tồn tại"
};

export const SUCCESS_MESSAGE = {
  SUCCESS: "Thành công",
  UPDATE_SUCCESS: "Cập nhật thành công",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  CHANGE_DEFAULT_PASSWORD_SUCCESS: "Thay đổi mật khẩu mặc định thành công",
  GET_TOKEN_SUCCESS: "Lấy token thành công",
  GET_MENU_SUCCESS: "Lấy menu thành công",
  GRANT_PERMISSION_SUCCESS: "Cấp quyền thành công",
  GET_PERMISSION_SUCCESS: "Lấy quyền thành công",
  GET_GRANT_PERMISSION_SUCCESS: "Lấy quyền cấp thành công",
  CREATE_USER_SUCCESS: "Tạo người dùng thành công",
  DELETE_USER_SUCCESS: "Xóa người dùng thành công",
  DEACTIVE_USER_SUCCESS: "Ngừng kích hoạt người dùng thành công",
  ACTIVE_USER_SUCCESS: "Kích hoạt người dùng thành công",
  UPDATE_USER_SUCCESS: "Cập nhật người dùng thành công",
  RESET_PASSWORD_SUCCESS: "Đặt lại mật khẩu thành công",

  // Warehouse success
  CREATE_BLOCK_SUCCESS: "Tạo khối thành công",
  DELETE_BLOCK_SUCCESS: "Xóa khối thành công",
  GET_BLOCK_SUCCESS: "Lấy khối thành công",
  // warehouse - block
  DELETE_WAREHOUSE_SUCCESS: "Xóa kho hàng thành công",
  GET_WAREHOUSE_SUCCESS: "Lấy kho hàng thành công",

  // gate
  CREATE_GATE_SUCCESS: "Tạo cổng thành công",
  DELETE_GATE_SUCCESS: "Xóa cổng thành công",
  GET_GATE_SUCCESS: "Lấy cổng thành công",

  // equipment
  CREATE_EQUIPTYPE_SUCCESS: "Tạo loại thiết bị thành công",
  DELETE_EQUIPTYPE_SUCCESS: "Xóa loại thiết bị thành công",
  GET_EQUIPTYPE_SUCCESS: "Lấy loại thiết bị thành công"
};

export const REASON_PHRASES = {
  ACCEPTED: "Đã chấp nhận",
  BAD_GATEWAY: "Cổng không hợp lệ",
  BAD_REQUEST: "Yêu cầu không hợp lệ",
  CONFLICT: "Xung đột",
  CONTINUE: "Tiếp tục",
  CREATED: "Đã tạo",
  EXPECTATION_FAILED: "Yêu cầu không thành công",
  FAILED_DEPENDENCY: "Phụ thuộc không thành công",
  FORBIDDEN: "Cấm",
  GATEWAY_TIMEOUT: "Hết thời gian cổng",
  GONE: "Không tồn tại",
  HTTP_VERSION_NOT_SUPPORTED: "Phiên bản HTTP không được hỗ trợ",
  IM_A_TEAPOT: "Tôi là một ấm đun nước",
  INSUFFICIENT_SPACE_ON_RESOURCE: "Không đủ không gian trên tài nguyên",
  INSUFFICIENT_STORAGE: "Không đủ bộ nhớ",
  INTERNAL_SERVER_ERROR: "Lỗi máy chủ nội bộ",
  LENGTH_REQUIRED: "Yêu cầu độ dài",
  LOCKED: "Đã khóa",
  METHOD_FAILURE: "Phương thức không thành công",
  METHOD_NOT_ALLOWED: "Phương thức không được phép",
  MOVED_PERMANENTLY: "Đã chuyển hướng vĩnh viễn",
  MOVED_TEMPORARILY: "Đã chuyển hướng tạm thời",
  MULTI_STATUS: "Nhiều trạng thái",
  MULTIPLE_CHOICES: "Nhiều lựa chọn",
  NETWORK_AUTHENTICATION_REQUIRED: "Yêu cầu xác thực mạng",
  NO_CONTENT: "Không có nội dung",
  NON_AUTHORITATIVE_INFORMATION: "Thông tin không có quyền",
  NOT_ACCEPTABLE: "Không chấp nhận",
  NOT_FOUND: "Không tìm thấy",
  NOT_IMPLEMENTED: "Chưa được thực hiện",
  NOT_MODIFIED: "Không được sửa đổi",
  OK: "OK",
  PAYMENT_REQUIRED: "Yêu cầu thanh toán",
  PERMANENT_REDIRECT: "Chuyển hướng vĩnh viễn",
  PRECONDITION_FAILED: "Điều kiện trước không thành công",
  PRECONDITION_REQUIRED: "Yêu cầu điều kiện trước",
  PROCESSING: "Đang xử lý",
  PROXY_AUTHENTICATION_REQUIRED: "Yêu cầu xác thực proxy",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "Trường tiêu đề yêu cầu quá lớn",
  REQUEST_TIMEOUT: "Hết thời gian yêu cầu",
  REQUEST_TOO_LONG: "Yêu cầu quá dài",
  REQUEST_URI_TOO_LONG: "URI yêu cầu quá dài",
  REQUESTED_RANGE_NOT_SATISFIABLE: "Phạm vi yêu cầu không thỏa mãn",
  RESET_CONTENT: "Đặt lại nội dung",
  SEE_OTHER: "Xem khác",
  SERVICE_UNAVAILABLE: "Dịch vụ không khả dụng",
  SWITCHING_PROTOCOLS: "Chuyển đổi giao thức",
  TEMPORARY_REDIRECT: "Chuyển hướng tạm thời",
  TOO_MANY_REQUESTS: "Quá nhiều yêu cầu",
  UNAUTHORIZED: "Không được ủy quyền",
  UNAVAILABLE_FOR_LEGAL_REASONS: "Không khả dụng vì lý do pháp lý",
  UNPROCESSABLE_ENTITY: "Thực thể không thể xử lý",
  UNSUPPORTED_MEDIA_TYPE: "Loại phương tiện không được hỗ trợ",
  USE_PROXY: "Sử dụng proxy",
  MISDIRECTED_REQUEST: "Yêu cầu sai hướng"
};

export const actionGrantPermission = {
  VIEW: "IS_VIEW",
  CREATE: "IS_ADD_NEW",
  UPDATE: "IS_MODIFY",
  DELETE: "IS_DELETE"
};
