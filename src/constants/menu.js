export const PATH_NAME = {
  /*Warehouse side*/
  //user-management
  userManagement: "user-management",
  user: "user",
  permission: "permission",

  //generic-list
  genericList: "generic-list",
  customerList: "customer-list",
  customerType: "customer-type",
  equipmentList: "equipment-list",
  itemType: "item-type",
  methodList: "method-list",
  packageUnitList: "package-unit-list",
  warehouseDesign: "warehouse-design",
  warehouseList: "warehouse-list",

  //input-data
  inputData: "input-data",
  goodManifest: "goods-manifest",
  manifestLoadingList: "manifest-loading-list",
  vesselInfo: "vessel-info",

  //tariff
  tariff: "tariff",
  configAttachService: "config-attach-srv",
  discountTariff: "discount-tariff",
  standardTariff: "standard-tariff",
  tariffCode: "tariff-code",

  //procedure
  procedure: "procedure",
  exportOrder: "export-order",
  importOrder: "import-order",

  //warehouseOperation
  warehouseOperation: "warehouse-operation",
  exportTally: "export-tally",
  forklift: "fork-lift",
  importTally: "import-tally",

  /*Customer side*/
  //customer-order
  customerOrder: "customer-order",

  paymentConfirmation: "payment-confirmation",
  allPatment: "all-payment",
  cancelledPayment: "cancelled-payment",
  paidPayment: "paid-payment",
  pendingPayment: "pending-payment"
};

export const ROUTE_TITLE_PAGE = {
  [PATH_NAME.userManagement]: "Quản lý người dùng",
  [PATH_NAME.user]: "Người dùng",
  [PATH_NAME.permission]: "Phân quyền",

  [PATH_NAME.genericList]: "Quản lý dữ liệu chung",
  [PATH_NAME.customerList]: "Khách hàng",
  [PATH_NAME.customerType]: "Phân loại khách hàng",
  [PATH_NAME.equipmentList]: "Thiết bị",
  [PATH_NAME.itemType]: "Phân loại hàng",
  [PATH_NAME.methodList]: "Phương án",
  [PATH_NAME.packageUnitList]: "Đơn vị kiện hàng",
  [PATH_NAME.warehouseDesign]: "Thiết kế kho",
  [PATH_NAME.warehouseList]: "Kho",

  [PATH_NAME.inputData]: "Dữ liệu đầu vào",
  [PATH_NAME.goodManifest]: "Kê khai hàng hóa",
  [PATH_NAME.manifestLoadingList]: "Kê khai container",
  [PATH_NAME.vesselInfo]: "Kê khai chuyến tàu",

  [PATH_NAME.tariff]: "Biểu cước",
  [PATH_NAME.configAttachService]: "Cấu hình dịch vụ đính kèm",
  [PATH_NAME.discountTariff]: "Biểu cước giảm giá",
  [PATH_NAME.standardTariff]: "Biểu cước chuẩn",
  [PATH_NAME.tariffCode]: "Mã biểu cước",

  [PATH_NAME.procedure]: "Thủ tục",
  [PATH_NAME.exportOrder]: "Lệnh xuất kho",
  [PATH_NAME.importOrder]: "Lệnh nhập kho",

  [PATH_NAME.warehouseOperation]: "Điều hành kho",
  [PATH_NAME.exportTally]: "Kiểm đếm xuất kho",
  [PATH_NAME.forklift]: "Quản lý hàng nhập/xuất kho",
  [PATH_NAME.importTally]: "Kiểm đếm nhập kho",

  [PATH_NAME.customerOrder]: "Đơn hàng của tôi"
};

export const MAIN_MENU = [
  PATH_NAME.userManagement,
  PATH_NAME.genericList,
  PATH_NAME.inputData,
  PATH_NAME.tariff,
  PATH_NAME.procedure,
  PATH_NAME.warehouseOperation,
  PATH_NAME.customerOrder,
  PATH_NAME.paymentConfirmation
];
