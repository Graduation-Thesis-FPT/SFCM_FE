import { getAllCellByWarehouseAndBlockCode } from "@/apis/block.api";
import { useCustomToast } from "@/components/common/custom-toast";
import React, { useEffect, useState } from "react";
import { RenderCell } from "./RenderCell";

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}

function transformData(arr) {
  // Group by ID
  const groupedByBlock = groupBy(arr, "BLOCK_ID");

  return Object.keys(groupedByBlock).map(blockCode => {
    // Group each block's items by TIER_ORDERED
    const tiersGrouped = groupBy(groupedByBlock[blockCode], "TIER_ORDERED");
    const tiers = Object.keys(tiersGrouped).map(tierOrdered => {
      // Create the CELLS array for each tier
      return {
        TIER_ORDERED: parseInt(tierOrdered),
        CELLS: tiersGrouped[tierOrdered]
      };
    });

    // Return the structured block
    return {
      ID: blockCode,
      TIERS: tiers
    };
  });
}

export function DisplayCell({ filterData }) {
  const [cellList, setCellList] = useState([]);
  const toast = useCustomToast();

  const getCell = () => {
    getAllCellByWarehouseAndBlockCode(filterData.warehouseID, filterData.blockID)
      .then(res => {
        const temp = transformData(res.data.metadata);
        setCellList(temp);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getCell();
  }, [filterData]);

  return (
    <>
      {cellList.length > 0 ? (
        <span className="mt-3 flex w-full flex-row gap-x-4 overflow-auto">
          {cellList.map(cell => {
            return (
              <span key={cell.ID}>
                <div className="mb-2 text-center text-xl font-bold text-blue-600">
                  Dãy {cell.ID}
                </div>
                <span className="flex h-[60vh] flex-row gap-x-3 overflow-y-auto overflow-x-hidden rounded-lg border p-[14px] text-sm font-medium">
                  {cell.TIERS.map(tier => (
                    <span key={tier.TIER_ORDERED}>
                      <div className="mb-3 text-center font-bold">Tầng {tier.TIER_ORDERED}</div>
                      <span className="flex flex-col gap-3">
                        {tier.CELLS.sort((a, b) => a.SLOT_ORDERED - b.SLOT_ORDERED).map(cell => (
                          <div key={cell.SLOT_ORDERED}>
                            <RenderCell cell={cell} />
                          </div>
                        ))}
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            );
          })}
        </span>
      ) : (
        <div className="mt-40 text-center text-sm opacity-50">Không có dữ liệu</div>
      )}
    </>
  );
}
