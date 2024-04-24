import React, { useRef } from "react";
import { Spreadsheet, Worksheet } from "@jspreadsheet/react";
import "jsuites/dist/jsuites.css";
import "jspreadsheet/dist/jspreadsheet.css";

const license = import.meta.env.VITE_JSPREADSHEET_LICENSE;

export default function Jspreadsheet({ dataSource, columns }) {
  const spreadsheet = useRef();
  return (
    <Spreadsheet ref={spreadsheet} license={license}>
      <Worksheet
        data={dataSource}
        tableOverflow={true}
        columns={columns}
        minDimensions
        search
        pagination="25"
        paginationOptions={[10, 25, 50, 100]}
      />
    </Spreadsheet>
  );
}
