export const UpperCase = params => {
  let newValue = params?.newValue?.trim()?.toUpperCase();
  if (newValue !== params.oldValue) {
    params.node.setDataValue(params.column, newValue);
  }
};
