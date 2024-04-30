import { v4 as uuidv4 } from "uuid";

export const fnAddRows = (numOfNewRow, rowData) => {
  let temp = [...rowData];
  for (let i = 0; i < numOfNewRow; i++) {
    temp.unshift({ key: uuidv4(), status: "insert" });
  }
  return temp;
};

export const fnAddKey = rowData => {
  return rowData.map(item => {
    return { key: uuidv4(), ...item };
  });
};
