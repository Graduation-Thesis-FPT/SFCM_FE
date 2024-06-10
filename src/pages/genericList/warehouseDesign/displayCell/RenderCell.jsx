export function RenderCell({ cell }) {
  return (
    <span className="flex h-[69px] w-[118px] flex-col items-center justify-center gap-[6px] rounded-lg border text-center">
      <div>
        {cell.BLOCK_CODE}-{cell.TIER_ORDERED}-{cell.SLOT_ORDERED}
      </div>
      <div>
        {cell.STATUS ? (
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
