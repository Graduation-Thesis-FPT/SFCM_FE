export const handleResult = (result, gridRef) => {
  if (!result.success) {
    let invalidRows = [];
    result.error.issues.forEach(issue => {
      const rowIndex = parseInt(issue.path[0]);
      if (!invalidRows.includes(rowIndex)) {
        invalidRows.push(rowIndex);
      }
    });

    let invalidRowNodes = [];
    gridRef.current.api.forEachNode(rowNode => {
      if (invalidRows.includes(Number(rowNode.id))) {
        invalidRowNodes.push(rowNode);
      }
    });
    gridRef.current.api.flashCells({ rowNodes: invalidRowNodes, flashDuration: 3000 });

    let mess = [];
    result.error.issues.forEach(issue => {
      if (!mess.includes(issue.message)) {
        mess.push(issue.message);
      }
    });

    return { isValid: false, mess };
  }

  return { isValid: true, mess: [] };
};
