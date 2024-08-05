export const UpperCase = params => {
  let newValue = params?.newValue?.trim()?.toUpperCase();
  if (params.newValue !== params.oldValue) {
    params.node.setDataValue(params.column, newValue);
  }
};
