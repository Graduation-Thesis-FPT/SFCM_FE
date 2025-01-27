import { useCustomToast } from "@/components/common/custom-toast";
import { useEffect, useState } from "react";

const useFetchData = ({ service, params = {}, dependencies = [], shouldFetch = true }) => {
  const toast = useCustomToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await service(params);
      setData(response.data.metadata);
    } catch (err) {
      setError(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const revalidate = () => {
    if (shouldFetch) {
      fetchData();
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [service, ...dependencies]);

  return { data, error, loading, revalidate };
};

export default useFetchData;
