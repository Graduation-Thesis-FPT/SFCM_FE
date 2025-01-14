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
        col.field && !["CREATED_BY", "UPDATED_BY", "UPDATED_AT", "CREATED_AT"].includes(col.field)
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
        newRow[col.field] = 0;
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
  const deleteIdList = selectedRows
    .filter(item => item.status !== "insert" && item[deleteBy])
    .map(item => item[deleteBy]);

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
    .map(({ status, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, ...rest }) => rest)
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
