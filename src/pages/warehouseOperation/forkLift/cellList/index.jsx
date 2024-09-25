import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

const groupedByTierOrdered = arr => {
  return arr.reduce((acc, obj) => {
    const key = obj.TIER_ORDERED;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

export const CellList = forwardRef(
  ({ warehouseData = [], onSelectedCell, selectedCell = {} }, ref) => {
    const handleSelectedCell = cell => {
      onSelectedCell(cell);
    };

    return (
      <div className="flex h-full gap-4 overflow-hidden overflow-x-auto p-4" ref={ref}>
        {Object.keys(warehouseData)
          .sort()
          .map(block => {
            const listCellGroupedByTier = groupedByTierOrdered(warehouseData[block]);
            return (
              <div key={block} className="h-full pb-4">
                <div className="text-center font-bold ">Dãy {block}</div>
                <div className="flex h-full flex-row overflow-auto overflow-x-hidden rounded-md border p-2 shadow-md">
                  {Object.keys(listCellGroupedByTier).map(tier => {
                    return (
                      <span key={tier} className="flex flex-col text-sm">
                        <div className="text-center font-bold">Tầng {tier} </div>
                        {listCellGroupedByTier[tier]
                          .sort((a, b) => a.SLOT_ORDERED - b.SLOT_ORDERED)
                          .map((cell, index) => {
                            return (
                              <div
                                onClick={() => {
                                  handleSelectedCell(cell);
                                }}
                                id={cell.ROWGUID}
                                key={index}
                                className={cn(
                                  cell.ROWGUID === selectedCell.ROWGUID && "bg-blue-100",
                                  "m-2 min-w-44 rounded-md border shadow-md transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer"
                                )}
                              >
                                <div className="flex justify-between border-b px-2 py-1 font-bold">
                                  {cell.IS_FILLED ? (
                                    <div className="text-green-600">Chứa hàng</div>
                                  ) : (
                                    <div className="text-gray-500">Trống</div>
                                  )}
                                  <div>
                                    {block}-{tier}-{cell.SLOT_ORDERED}
                                  </div>
                                </div>
                                {cell.IS_FILLED ? (
                                  <div className="p-2 text-center">
                                    <div>Số lượng: {cell.ITEMS_IN_CELL}</div>
                                    <div className="font-bold">
                                      {cell.packageCellAllocation_ROWGUID}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-2 text-center opacity-40">
                                    <div>Kích thước (d-r-c)</div>
                                    <div className="font-bold">
                                      {cell.CELL_LENGTH}x{cell.CELL_WIDTH}x{cell.CELL_HEIGHT}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
);
