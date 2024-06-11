import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import moment from "moment";
import React, { useEffect } from "react";

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
