import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const usePagination = (initialPage: number = 1) => {
  const [page, setPage] = useState(initialPage);
  const searchParams = useSearchParams();

  useEffect(() => {
    const pageFromQuery = Number(searchParams.get("page")) || initialPage;
    setPage(pageFromQuery);
  }, [searchParams, initialPage]);

  const handlePageChange = (newPage: number) => {
    const newUrl = `?page=${newPage}`;
    window.history.pushState({}, "", newUrl);
    setPage(newPage);
  };

  return { page, handlePageChange };
};

export default usePagination;
