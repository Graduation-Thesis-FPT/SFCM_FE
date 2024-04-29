import { useRef, useState, useEffect } from "react";
import Jspreadsheet from "@/components/jspreadsheet/Jspreadsheet";
import AgGrid from "@/components/aggridreact/AgGrid";
import { Button } from "@/components/ui/button";
import { getTest } from "@/apis/user.api";

export default function Detail() {
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false }
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make", flex: 0.2 },
    { field: "model" },
    { field: "price", editable: false },
    { field: "electric" }
  ]);
  const [data, setData] = useState([
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
  ]);

  const columns = [
    {
      name: "name",
      title: "Full name",
      type: "text",
      width: "500px"
    },
    {
      name: "address.number",
      title: "Number",
      type: "text",
      width: "300px"
    },
    {
      name: "address.city",
      title: "City",
      type: "text",
      width: "900px"
    }
  ];

  return (
    <>
      <Button
        onClick={() => {
          getTest()
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(123);
            });
        }}
      >
        Click me
      </Button>
      <Jspreadsheet dataSource={data} columns={columns} />
      <AgGrid rowData={rowData} colDefs={colDefs} />
    </>
  );
}
