import { v4 as uuidv4 } from "uuid";

const fnAddRows = rowData => {
  let temp = [...rowData];
  temp.unshift({
    key: uuidv4(),
    status: "insert"
  });
  return temp;
};

const fnAddKey = rowData => {
  return rowData.map(item => {
    return { key: uuidv4(), ...item };
  });
};

const fnDeleteRows = (listIdDeleted, rowData) => {
  return rowData.filter(row => !listIdDeleted.includes(row.ROWGUID));
};

export { fnAddRows, fnAddKey, fnDeleteRows };
