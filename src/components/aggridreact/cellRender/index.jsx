import moment from "moment";

export function DateTimeRenderByText(params) {
  return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
}

export function OnlyEditWithInsertCell(params) {
  return params.data.status === "insert" ? true : false;
}
