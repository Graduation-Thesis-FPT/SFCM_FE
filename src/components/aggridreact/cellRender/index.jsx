import moment from "moment";

export function DateTimeRenderByText(params) {
  return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
}
