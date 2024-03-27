import { HotTable } from "@handsontable/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const hotTableRef = useRef(null);
  const [data, setData] = useState([]);

  const columns = [
    {
      data: "date",
      label: "Date",
      type: "date",
      dateFormat: "DD/MM/YYYY",
      correctFormat: true,
      className: "htCenter",
      allowEmpty: false,
      allowInvalid: false
    },
    {
      data: "time",
      label: "Time",
      type: "time",
      timeFormat: "HH:mm:ss",
      correctFormat: true,
      className: "htCenter",
      allowEmpty: false,
      allowInvalid: false
    },
    {
      data: "key"
    }
  ];

  const colHeaders = columns => {
    return columns.map(column => {
      return column.label;
    });
  };

  const handleAddNewRow = () => {
    const newRow = columns.reduce(
      (accumulator, { data }) => {
        if (data !== "key") {
          accumulator[data] = "";
        }
        return accumulator;
      },
      { status: "add", key: uuidv4() }
    );
    setData([newRow, ...data]);
  };

  useEffect(() => {
    const data = [
      { id: 1, name: "24:30:22", date: "22/04/2022 22:30:00" },
      { id: 2, name: "Frank Honest", date: "22/04/2022 22:30:00" },
      { id: 3, name: "Joan Well", date: "22/04/2022 22:30:00" },
      { id: 4, name: "Gail Polite", date: "22/04/2022 22:30:00" },
      { id: 5, name: "Michael Fair", date: "22/04/2022 22:30:00" }
    ];
    let temp = data.map(item => {
      const spaceIndex = item.date.indexOf(" ");
      const datePart = item.date.substring(0, spaceIndex);
      const timePart = item.date.substring(spaceIndex + 1);

      return { ...item, date: datePart, time: timePart, key: uuidv4() };
    });
    setData(temp);
  }, []);
  return (
    <div className="flex flex-col">
      <div className="w-full h-[500px]">
        <HotTable
          className="hot-table-custom"
          ref={hotTableRef}
          data={data}
          colHeaders={colHeaders(columns)}
          columns={columns}
          manualColumnResize={true}
          stretchH="all"
          width="100%"
          height="100%"
          navigableHeaders={true}
          autoWrapRow={true}
          autoWrapCol={true}
          rowHeaders={true}
          // colWidths={100}
          // colWidths={[1050, 100]}
          multiColumnSorting={true}
          licenseKey="non-commercial-and-evaluation"
          settings={{
            hiddenColumns: {
              columns: [columns.length - 1]
            }
          }}
          afterSetDataAtCell={changes => {
            changes.map(([row, prop, oldValue, newValue]) => {
              const { length, [length - 1]: key } =
                hotTableRef.current.hotInstance.getDataAtRow(row);
              let update = data.map(item => {
                if (item.key === key) {
                  item[prop] = newValue;
                  item["status"] = item["status"] ?? "edit";
                  return item;
                } else {
                  return item;
                }
              });
              setData(update);
            });
          }}
        />
      </div>
    </div>
  );
}
