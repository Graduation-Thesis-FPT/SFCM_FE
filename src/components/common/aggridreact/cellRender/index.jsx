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
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";

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
  return params.value ? `${moment(params.value).format("DD/MM/YYYY")}` : "";
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
      <SelectTrigger
        className={`${params.data.METHOD_CODE !== "NK" && params.data.METHOD_CODE !== "XK" && params.data.METHOD_CODE !== "LK" ? null : "pointer-events-none"} border-none bg-white/0 focus:ring-0`}
      >
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

export function IsInOutGateRender(params) {
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
      params.setValue(warehouses[0]?.ID);
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
            <SelectItem key={item?.ID} value={item?.ID}>
              {item?.ID} - {item?.NAME}
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
      params.setValue(equTypes[0]?.EQU_TYPE);
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
            <SelectItem key={item?.EQU_TYPE} value={item?.EQU_TYPE}>
              {item?.EQU_TYPE} - {item?.EQU_TYPE_NAME}
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

export function ContainerTariffStatusRender(params) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue("ACTIVE");
    }
  }, []);
  return (
    <div className="flex items-center justify-center gap-2">
      <Switch
        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
        checked={params.value === "ACTIVE"}
        onCheckedChange={value => {
          params.setValue(value ? "ACTIVE" : "INACTIVE");
        }}
      ></Switch>
      <div
        className={`flex text-sm font-medium  ${params.value === "ACTIVE" ? "text-blue-600" : "text-gray-600"}`}
      >
        {params.value === "ACTIVE" ? "Hoạt động" : "Dừng"}
      </div>
    </div>
  );
}

export function PackageTariffDetailStatusRender(params) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue("ACTIVE");
    }
  }, []);
  return (
    <div className="flex items-center justify-center gap-2">
      <Switch
        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
        checked={params.value === "ACTIVE"}
        onCheckedChange={value => {
          params.setValue(value ? "ACTIVE" : "INACTIVE");
        }}
      ></Switch>
      <div
        className={`flex text-sm font-medium  ${params.value === "ACTIVE" ? "text-blue-600" : "text-gray-600"}`}
      >
        {params.value === "ACTIVE" ? "Hoạt động" : "Dừng"}
      </div>
    </div>
  );
}

export function CustomerTypeRender(params) {
  const customerType = [
    {
      ID: "SHIPPER",
      NAME: "Đại lý"
    },
    {
      ID: "CONSIGNEE",
      NAME: "Chủ hàng"
    }
  ];
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(customerType[0]?.ID);
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
          {customerType?.map(item => (
            <SelectItem key={item?.ID} value={item?.ID}>
              {item?.NAME}
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
      params.setValue(true);
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

export const StatusOrderPaymentRender = params => {
  const getStatusBadge = () => {
    switch (params.value) {
      case "PENDING":
        return (
          <Badge className="rounded-sm border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Chờ thanh toán
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
            Đã thanh toán
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="rounded-sm border-transparent bg-red-100 text-red-800 hover:bg-red-200">
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };
  return <div>{getStatusBadge()}</div>;
};

export function VoyContPackageStatusRender(params) {
  const getStatusBadge = () => {
    switch (params.value) {
      case "IN_CONTAINER":
        return (
          <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
            Trên Container
          </Badge>
        );
      case "ALLOCATING":
        return (
          <Badge className="rounded-sm border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Đang tách hàng
          </Badge>
        );
      case "IN_WAREHOUSE":
        return (
          <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
            Trong Kho
          </Badge>
        );
      case "OUT_FOR_DELIVERY":
        return (
          <Badge className="rounded-sm border-transparent  bg-red-100 text-red-800 hover:bg-red-200">
            Đã xuất kho
          </Badge>
        );
      default:
        return null;
    }
  };
  return <div>{getStatusBadge()}</div>;
}

export function VoyContainerStatusRender(params) {
  const getStatusBadge = () => {
    switch (params.value) {
      case "IMPORTED":
        return (
          <Badge className="rounded-sm border-transparent bg-red-100 text-red-800 hover:bg-red-200">
            Đã nhập
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
            Chưa nhập
          </Badge>
        );

      default:
        return null;
    }
  };
  return <div>{getStatusBadge()}</div>;
}

export function PackageTypeRender(params, packageType) {
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
          {packageType.map(item => (
            <SelectItem key={item?.ID} value={item?.ID}>
              {item?.ID} - {item?.NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function CustomerRender(params, customerList) {
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
            <SelectItem key={item?.ID} value={item?.ID}>
              {item?.ID} - {item?.FULLNAME}
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
      params.setValue(customerList[0]?.CUSTOMER_CODE);
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
            <SelectItem key={item?.CUSTOMER_CODE} value={item?.CUSTOMER_CODE}>
              {item?.CUSTOMER_CODE} - {item?.CUSTOMER_NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function CntrSizeRender(params) {
  let cntrSztpList = [
    { label: "20", value: 20 },
    { label: "40", value: 40 },
    { label: "45", value: 45 }
  ];
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
          {cntrSztpList.map(item => (
            <SelectItem key={item?.value} value={item?.value}>
              {item?.label}
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

export function PackageUnitCodeRender(params, packageUnitList) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(packageUnitList[0]?.PACKAGE_UNIT_CODE);
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
          {packageUnitList.map(item => (
            <SelectItem key={item?.PACKAGE_UNIT_CODE} value={item?.PACKAGE_UNIT_CODE}>
              {item?.PACKAGE_UNIT_CODE} - {item?.PACKAGE_UNIT_NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TrfCodeRender(params, TrfCode) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(TrfCode[0]?.TRF_CODE);
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
          {TrfCode.map(item => (
            <SelectItem key={item?.TRF_CODE} value={item?.TRF_CODE}>
              {item?.TRF_CODE} - {item?.TRF_DESC}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function MethodCodeRender(params, method) {
  useEffect(() => {
    if (params.value === undefined) {
      params.setValue(method[0]?.METHOD_CODE);
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
          {method.map(item => (
            <SelectItem key={item?.METHOD_CODE} value={item?.METHOD_CODE}>
              {item?.METHOD_CODE} - {item?.METHOD_NAME}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
