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

const fnDeleteRows = (listIdDeleted, rowData, PRIMARY_KEY) => {
  return rowData.filter(
    row => !listIdDeleted.includes(PRIMARY_KEY ? row[PRIMARY_KEY] : row.ROWGUID)
  );
};

function fnFilterInsertAndUpdateData(listData) {
  const insertData = listData
    .filter(item => item.status === "insert")
    .map(({ status, key, ...rest }) => rest);
  const updateData = listData
    .filter(item => item.status === "update")
    .map(({ status, ...rest }) => rest);
  return {
    insertData: { insert: insertData },
    updateData: { update: updateData },
    insertAndUpdateData: { insert: insertData, update: updateData }
  };
}

export { fnAddRows, fnAddKey, fnDeleteRows, fnFilterInsertAndUpdateData };
