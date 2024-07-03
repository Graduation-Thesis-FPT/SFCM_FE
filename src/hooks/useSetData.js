import { useEffect, useState } from "react";

export const useSetData = fetchedData => {
  const [data, setData] = useState(fetchedData);
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  return [data, setData];
};
