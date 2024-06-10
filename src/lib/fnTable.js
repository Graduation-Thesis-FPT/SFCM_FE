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

const fnDeleteRows = (selectedRows, rowData, deleteBy) => {
  const deleteIdList = selectedRows.filter(item => item[deleteBy]).map(item => item[deleteBy]);

  const deleteKeys = selectedRows.map(item => item.key || item[deleteBy] || item.ROWGUID);
  const newRowDataAfterDeleted = rowData.filter(
    item => !deleteKeys.includes(item.key || item[deleteBy] || item.ROWGUID)
  );

  return { deleteIdList, newRowDataAfterDeleted };
};

function fnFilterInsertAndUpdateData(listData) {
  const insertData = listData
    .filter(item => item.status === "insert")
    .map(({ status, key, ...rest }) => rest);
  const updateData = listData
    .filter(item => item.status === "update")
    .map(({ status, CREATE_BY, CREATE_DATE, UPDATE_BY, UPDATE_DATE, ...rest }) => rest);
  return {
    insertData: { insert: insertData },
    updateData: { update: updateData },
    insertAndUpdateData: { insert: insertData, update: updateData }
  };
}

export { fnAddRows, fnAddKey, fnDeleteRows, fnFilterInsertAndUpdateData };
