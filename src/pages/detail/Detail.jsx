import { useRef, useState, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";

export default function Detail() {
  const hotRef = useRef(null);
  // generate an array of arrays with dummy data
  const data = new Array(100) // number of rows
    .fill()
    .map((_, row) =>
      new Array(50) // number of columns
        .fill()
        .map((_, column) => `${row}, ${column}`)
    );
  useEffect(() => {});

  return (
    <>
      <div className="h-[500px] w-full">
        <HotTable
          data={data}
          rowHeaders={true}
          colHeaders={true}
          width="100%"
          height="100%"
          stretchH="all"
          // rowHeights={23}
          // colWidths={100}

          licenseKey="non-commercial-and-evaluation"
          ref={hotRef}
        />
      </div>
    </>
  );
}
