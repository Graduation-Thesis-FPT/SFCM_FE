export const ERROR_MESSAGE = {
  INVALID_REQUEST_MISSING_TOKEN: "INVALID_REQUEST_MISSING_TOKEN",
  INVALID_REQUEST: "INVALID_REQUEST",
  MISSING_MENU_CODE: "MISSING_MENU_CODE",
  YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE: "YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE",
  YOU_DO_NOT_HAVE_THIS_PERMISSION: "YOU_DO_NOT_HAVE_THIS_PERMISSION",
  INVALID_USER_ID: "INVALID_USER_ID",
  INVALID_ID: "INVALID_ID",
  USER_NAME_NOT_EXIST: "USER_NAME_NOT_EXIST",
  USER_IS_NOT_ACTIVE: "USER_IS_NOT_ACTIVE",
  PASSWORD_IS_INCORRECT: "PASSWORD_IS_INCORRECT",
  PASSWORD_IS_ALREADY: "PASSWORD_IS_ALREADY",
  PASSWORD_IS_DEFAULT: "PASSWORD_IS_DEFAULT",
  UPDATE_PASSWORD_FAILED: "UPDATE_PASSWORD_FAILED",
  USER_ALREADY_EXIST: "USER_ALREADY_EXIST",
  USER_NOT_EXIST: "USER_NOT_EXIST",
  USER_NAME_IS_DUPLICATED: "USER_NAME_IS_DUPLICATED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  INVALID_TOKEN_PLEASE_LOGIN_AGAIN: "INVALID_TOKEN_PLEASE_LOGIN_AGAIN",

  // warehouse error
  WAREHOUSE_NOT_EXIST: "WAREHOUSE_NOT_EXIST",
  INVALID_WAREHOUSE_CODE: "INVALID_WAREHOUSE_CODE",
  // warehouse - block
  BLOCK_DUPLICATED: "BLOCK_DUPLICATED"
};

export const SUCCESS_MESSAGE = {
  SUCCESS: "SUCCESS",
  UPDATE_SUCCESS: "UPDATE_SUCCESS",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  CHANGE_DEFAULT_PASSWORD_SUCCESS: "CHANGE_DEFAULT_PASSWORD_SUCCESS",
  GET_TOKEN_SUCCESS: "GET_TOKEN_SUCCESS",
  GET_MENU_SUCCESS: "GET_MENU_SUCCESS",
  GRANT_PERMISSION_SUCCESS: "GRANT_PERMISSION_SUCCESS",
  GET_PERMISSION_SUCCESS: "GET_PERMISSION_SUCCESS",
  GET_GRANT_PERMISSION_SUCCESS: "GET_GRANT_PERMISSION_SUCCESS",
  CREATE_USER_SUCCESS: "CREATE_USER_SUCCESS",
  DELETE_USER_SUCCESS: "DELETE_USER_SUCCESS",
  DEACTIVE_USER_SUCCESS: "DEACTIVE_USER_SUCCESS",
  ACTIVE_USER_SUCCESS: "ACTIVE_USER_SUCCESS",
  UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",
  RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",

  // warehouse success
  CREATE_BLOCK_SUCCESS: "CREATE_BLOCK_SUCCESS",
  DELETE_BLOCK_SUCCESS: "DELETE_BLOCK_SUCCESS",
  // warehouse - block
  GET_BLOCK_SUCCESS: "GET_BLOCK_SUCCESS"
};

export const REASON_PHRASES = {
  ACCEPTED: "ACCEPTED",
  BAD_GATEWAY: "BAD_GATEWAY",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  CONTINUE: "CONTINUE",
  CREATED: "CREATED",
  EXPECTATION_FAILED: "EXPECTATION_FAILED",
  FAILED_DEPENDENCY: "FAILED_DEPENDENCY",
  FORBIDDEN: "FORBIDDEN",
  GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT",
  GONE: "GONE",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP_VERSION_NOT_SUPPORTED",
  IM_A_TEAPOT: "IM_A_TEAPOT",
  INSUFFICIENT_SPACE_ON_RESOURCE: "INSUFFICIENT_SPACE_ON_RESOURCE",
  INSUFFICIENT_STORAGE: "INSUFFICIENT_STORAGE",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  LENGTH_REQUIRED: "LENGTH_REQUIRED",
  LOCKED: "LOCKED",
  METHOD_FAILURE: "METHOD_FAILURE",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  MOVED_PERMANENTLY: "MOVED_PERMANENTLY",
  MOVED_TEMPORARILY: "MOVED_TEMPORARILY",
  MULTI_STATUS: "MULTI_STATUS",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES",
  NETWORK_AUTHENTICATION_REQUIRED: "NETWORK_AUTHENTICATION_REQUIRED",
  NO_CONTENT: "NO_CONTENT",
  NON_AUTHORITATIVE_INFORMATION: "NON_AUTHORITATIVE_INFORMATION",
  NOT_ACCEPTABLE: "NOT_ACCEPTABLE",
  NOT_FOUND: "NOT_FOUND",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  NOT_MODIFIED: "NOT_MODIFIED",
  OK: "OK",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  PERMANENT_REDIRECT: "PERMANENT_REDIRECT",
  PRECONDITION_FAILED: "PRECONDITION_FAILED",
  PRECONDITION_REQUIRED: "PRECONDITION_REQUIRED",
  PROCESSING: "PROCESSING",
  PROXY_AUTHENTICATION_REQUIRED: "PROXY_AUTHENTICATION_REQUIRED",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "REQUEST_HEADER_FIELDS_TOO_LARGE",
  REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
  REQUEST_TOO_LONG: "REQUEST_TOO_LONG",
  REQUEST_URI_TOO_LONG: "REQUEST_URI_TOO_LONG",
  REQUESTED_RANGE_NOT_SATISFIABLE: "REQUESTED_RANGE_NOT_SATISFIABLE",
  RESET_CONTENT: "RESET_CONTENT",
  SEE_OTHER: "SEE_OTHER",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  SWITCHING_PROTOCOLS: "SWITCHING_PROTOCOLS",
  TEMPORARY_REDIRECT: "TEMPORARY_REDIRECT",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNAVAILABLE_FOR_LEGAL_REASONS: "UNAVAILABLE_FOR_LEGAL_REASONS",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
  USE_PROXY: "USE_PROXY",
  MISDIRECTED_REQUEST: "MISDIRECTED_REQUEST"
};

export const actionGrantPermission = {
  VIEW: "IS_VIEW",
  CREATE: "IS_ADD_NEW",
  UPDATE: "IS_MODIFY",
  DELETE: "IS_DELETE"
};