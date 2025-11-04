import { useState, useMemo } from 'react';

function usePagination(data: any[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}

export default usePagination;
