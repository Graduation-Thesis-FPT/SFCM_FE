import { useRef, useState, useEffect } from "react";
import { Spreadsheet, Worksheet } from "@jspreadsheet/react";
import "jsuites/dist/jsuites.css";
import "jspreadsheet/dist/jspreadsheet.css";

const license = import.meta.env.VITE_JSPREADSHEET_LICENSE;

export default function Detail() {
  // Spreadsheet array of worksheets
  const spreadsheet = useRef();
  // Console
  const console = useRef();
  // Data
  const data = [
    {
      name: "Jorge",
      address: {
        number: "201",
        city: "New York"
      }
    },
    {
      name: "Paul",
      address: {
        number: "1",
        city: "New Jersey"
      }
    }
  ];
  // Columns
  const columns = [
    {
      // Path to the data property for this column
      name: "name",
      title: "Full name",
      type: "text",
      width: "200px"
    },
    {
      // Path to the data property for this column
      name: "address.number",
      title: "Number",
      type: "text",
      width: "200px"
    },
    {
      // Path to the data property for this column
      name: "address.city",
      title: "City",
      type: "text",
      width: "600px"
    }
  ];
  // Render data grid component

  return (
    <>
      <Spreadsheet ref={spreadsheet} license={license}>
        <Worksheet
          data={data}
          tableOverflow={true}
          columns={columns}
          minDimensions
          search
          pagination="25"
          paginationOptions={[10, 25, 50, 100]}
        />
      </Spreadsheet>
    </>
  );
}
