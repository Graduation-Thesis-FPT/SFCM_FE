export function RenderCell({ cell }) {
  return (
    <span className="flex min-w-44 flex-col rounded-md border shadow-md">
      <div className="flex justify-between border-b px-2 py-1 font-bold">
        {cell.IS_FILLED ? (
          <div className="text-green-600">Chứa hàng</div>
        ) : (
          <div className="text-gray-500">Trống</div>
        )}
        <div>
          {cell.BLOCK_ID}-{cell.TIER_ORDERED}-{cell.SLOT_ORDERED}
        </div>
      </div>
      <div className="p-2 text-center opacity-40">
        <div>Kích thước (d-r-c)</div>
        <div className="font-bold">
          {cell.CELL_LENGTH}x{cell.CELL_WIDTH}x{cell.CELL_HEIGHT}
        </div>
      </div>
    </span>
  );
}
