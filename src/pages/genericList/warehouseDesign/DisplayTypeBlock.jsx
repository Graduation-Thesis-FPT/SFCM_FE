import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

function transformAndSortBlockList(arr) {
  const grouped = arr.reduce((acc, item) => {
    if (!acc[item.BLOCK_NAME]) acc[item.BLOCK_NAME] = [];
    acc[item.BLOCK_NAME].push(item);
    return acc;
  }, {});

  const sortedGroup = Object.keys(grouped).map(block => ({
    BLOCK_NAME: block,
    child: grouped[block].sort((a, b) => a.TIER_COUNT - b.TIER_COUNT)
  }));

  return sortedGroup.sort((a, b) => {
    const nameA = a.BLOCK_NAME.toUpperCase();
    const nameB = b.BLOCK_NAME.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export function DisplayTypeBlock({ warehouses, blockList }) {
  const [transformBlockList, setTransformBlockList] = useState([]);
  const [filterData, setFilterData] = useState({
    warehouseCode: warehouses[0]?.WAREHOUSE_CODE,
    blockName: "All"
  });

  useEffect(() => {
    let filterBlockList = blockList.filter(
      block => block.WAREHOUSE_CODE === filterData.warehouseCode
    );
    setTransformBlockList(transformAndSortBlockList(filterBlockList));
  }, [filterData]);

  return (
    <>
      <span className="flex gap-x-3">
        <span>
          <div className="mb-2 text-xs font-medium">Mã kho</div>
          <Select
            onValueChange={value => {
              setFilterData({
                blockName: "All",
                warehouseCode: value
              });
            }}
            defaultValue={warehouses[0]?.WAREHOUSE_CODE}
          >
            <SelectTrigger className="h-[42px] w-[122px]">
              <SelectValue placeholder="Mã kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {warehouses?.map(item => (
                  <SelectItem value={item?.WAREHOUSE_CODE}>{item?.WAREHOUSE_CODE}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
        <span>
          <div className="mb-2 text-xs font-medium">Dãy</div>
          <Select
            onValueChange={value => {
              setFilterData(prevState => ({
                ...prevState,
                blockName: value
              }));
            }}
            value={filterData.blockName}
          >
            <SelectTrigger className="h-[42px] w-[122px]">
              <SelectValue placeholder="Mã kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">Tất cả</SelectItem>
                {transformBlockList?.map(item => (
                  <SelectItem value={item?.BLOCK_NAME}>{item?.BLOCK_NAME}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
      </span>
      <di className="mt-3 flex w-full flex-row gap-x-4 overflow-auto">
        {transformBlockList
          ?.filter(block => {
            if (filterData.blockName === "All") {
              return block;
            }
            return block.BLOCK_NAME === filterData.blockName;
          })
          .map(block => {
            return (
              <div>
                <div className="mb-2 text-center text-xl font-bold text-blue-600">
                  {block.BLOCK_NAME}
                </div>
                <span className="flex h-[50vh] flex-row gap-x-3 overflow-y-auto overflow-x-hidden rounded-lg border p-[14px] text-sm font-medium">
                  {block.child.map(child => {
                    return (
                      <span>
                        <div className="mb-3 text-center">Tầng {child.TIER_COUNT}</div>
                        <RenderCell child={child} />
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
      </di>
    </>
  );
}

function RenderCell({ child }) {
  const elements = [];

  for (let i = 0; i < child.SLOT_COUNT; i++) {
    elements.push(
      <span
        key={i}
        className="flex h-[69px] w-[118px] flex-col items-center justify-center gap-[6px] rounded-lg border text-center"
      >
        <div>
          {child.BLOCK_NAME}-{child.TIER_COUNT}-{i + 1}
        </div>
        <div>
          {child.STATUS ? (
            <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-800">
              Chứa hàng
            </span>
          ) : (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-800">Trống</span>
          )}
        </div>
      </span>
    );
  }

  return <div className="flex flex-col gap-3">{elements}</div>;
}
