import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/common/ui/dropdown-menu";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { loadCldr, L10n } from "@syncfusion/ej2-base";
import * as numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import * as gregorian from "cldr-data/main/vi/ca-gregorian.json";
import * as numbers from "cldr-data/main/vi/numbers.json";
import * as timeZoneNames from "cldr-data/main/vi/timeZoneNames.json";

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

L10n.load({
  vi: {
    datetimepicker: {
      placeholder: "Chọn ngày",
      today: "Hôm nay"
    }
  }
});

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

export function StatusOfGoodsRender(params) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(false);
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
          <SelectItem value={false}>Rỗng</SelectItem>
          <SelectItem value={true}>Có hàng</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function StatusOfGoodsByTextRender(params) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(false);
    }
  }, []);
  return params.value ? "Có hàng" : "Rỗng";
}

export function ItemTypeCodeRender(params, itemType) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(itemType[0].ITEM_TYPE_CODE);
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
          {itemType.map(item => (
            <SelectItem key={item.ITEM_TYPE_CODE} value={item.ITEM_TYPE_CODE}>
              {item.ITEM_TYPE_CODE}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ConsigneeRender(params, customerList) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(customerList[0].CUSTOMER_CODE);
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
          {customerList.map(item => (
            <SelectItem key={item.CUSTOMER_CODE} value={item.CUSTOMER_CODE}>
              {item.CUSTOMER_NAME} - {item.CUSTOMER_CODE}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function DateTimePickerRender(params) {
  const handleDateChange = e => {
    if (!e.value) {
      params.setValue(null);
      return;
    }
    params.setValue(e.value);
  };
  useEffect(() => {
    if (!params.value) {
      params.setValue(new Date());
    }
  }, []);
  return (
    <DateTimePickerComponent
      locale="vi"
      id="datetimepicker"
      format="dd/MM/yyyy HH:mm"
      value={params.value}
      onChange={handleDateChange}
    />
  );
}
