import { useMemo, useState, useEffect } from 'react';

export default function usePagination<T>(items: T[] = [], pageSize = 12) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = useMemo(() => {
    const len = items?.length ?? 0;
    return len === 0 ? 0 : Math.max(1, Math.ceil(len / pageSize));
  }, [items, pageSize]);

  // ensure currentPage is always within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages === 0 ? 1 : totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    if (!items || items.length === 0) return [];
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}