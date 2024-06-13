import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
export function DateTimeByTextRender(params) {
  return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
}

export function OnlyEditWithInsertCell(params) {
  return params.data.status === "insert" ? true : false;
}

export function IsInOutRender(params) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue("I");
    }
  }, []);
  return (
    <Select
      onValueChange={value => {
        params.setValue(value);
      }}
      value={params.value}
    >
      <SelectTrigger className="border-none bg-white/0 focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="O">Ra</SelectItem>
          <SelectItem value="I">Vào</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function WarehouseCodeRender(params, warehouses) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(warehouses[0].WAREHOUSE_CODE);
    }
  }, []);
  return (
    <Select
      onValueChange={value => {
        params.setValue(value);
      }}
      value={params.value}
    >
      <SelectTrigger className="border-none bg-white/0 focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {warehouses.map(item => (
            <SelectItem key={item.WAREHOUSE_CODE} value={item.WAREHOUSE_CODE}>
              {item.WAREHOUSE_NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function EquTypeRender(params, equTypes) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(equTypes[0].EQU_TYPE);
    }
  }, []);
  return (
    <Select
      onValueChange={value => {
        params.setValue(value);
      }}
      value={params.value}
    >
      <SelectTrigger className="border-none bg-white/0 focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {equTypes.map(item => (
            <SelectItem key={item.EQU_TYPE} value={item.EQU_TYPE}>
              {item.EQU_TYPE}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function BlockCodeRender(params, blockCodes) {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(blockCodes);
    if (params.value === undefined) {
      params.setValue([]);
    }
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>{params.value?.length > 0 ? "" : "Chọn"}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {data.map((item, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            className="w-56"
            onSelect={event => event.preventDefault()}
            checked={item.checked}
            onCheckedChange={value => {
              let temp = [...data];
              temp[index]["checked"] = value;
              params.setValue(temp.filter(item => item.checked).map(item => item.name));
            }}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CustomerTypeRender(params, customerType) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(customerType[0].CUSTOMER_TYPE_CODE);
    }
  }, []);
  return (
    <Select
      onValueChange={value => {
        params.setValue(value);
      }}
      value={params.value}
    >
      <SelectTrigger className="border-none bg-white/0 focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {customerType.map(item => (
            <SelectItem key={item.CUSTOMER_TYPE_CODE} value={item.CUSTOMER_TYPE_CODE}>
              {item.CUSTOMER_TYPE_NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
