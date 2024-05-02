import { v4 as uuidv4 } from "uuid";

const fnAddRows = (numOfNewRow, rowData) => {
  let temp = [...rowData];
  for (let i = 0; i < numOfNewRow; i++) {
    temp.unshift({ key: uuidv4(), status: "insert" });
  }
  return temp;
};

const fnAddKey = rowData => {
  return rowData.map(item => {
    return { key: uuidv4(), ...item };
  });
};

const fnDeleteRows = (selectedRows, rowData) => {
  return rowData.filter(row => !selectedRows.includes(row));
};

export { fnAddRows, fnAddKey, fnDeleteRows };
