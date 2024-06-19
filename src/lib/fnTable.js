import { v4 as uuidv4 } from "uuid";

const fnAddRows = rowData => {
  let temp = [...rowData];
  temp.unshift({
    key: uuidv4(),
    status: "insert"
  });
  return temp;
};

const fnAddRowsVer2 = (rowData, colDefs) => {
  let temp = [...rowData];
  let newRow = { key: uuidv4(), status: "insert" };

  colDefs
    .filter(
      col =>
        col.field && !["CREATE_BY", "UPDATE_BY", "UPDATE_DATE", "CREATE_DATE"].includes(col.field)
    )
    .forEach(col => {
      if (col.cellEditor === "agCheckboxCellEditor") {
        newRow[col.field] = false;
        return;
      }
      if (col.cellRenderer) {
        return;
      }
      if (col.cellDataType === "number") {
        //do something
        return;
      }
      if (col.cellDataType === "date") {
        newRow[col.field] = new Date();
        return;
      }
      newRow[col.field] = "";
    });

  temp.unshift(newRow);
  return temp;
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
    .map(({ status, key, ...rest }) => rest)
    .map(item =>
      Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, value === null ? "" : value])
      )
    );
  const updateData = listData
    .filter(item => item.status === "update")
    .map(({ status, CREATE_BY, CREATE_DATE, UPDATE_BY, UPDATE_DATE, ...rest }) => rest)
    .map(item =>
      Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, value === null ? "" : value])
      )
    );
  return {
    insertData: { insert: insertData },
    updateData: { update: updateData },
    insertAndUpdateData: { insert: insertData, update: updateData },
    isContinue: insertData.length > 0 || updateData.length > 0
  };
}

export { fnAddRows, fnDeleteRows, fnFilterInsertAndUpdateData, fnAddRowsVer2 };
