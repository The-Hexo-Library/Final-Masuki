import { useCallback, useEffect, useState } from "react";
import type { PagedResult } from "../services/api";

/**
 * Spring server pages or client-only slicing: sync `first`/`last` whenever `page` / `totalPages` change.
 */
export function usePaginationState(initialPage = 0, initialSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    const tp = Math.max(0, totalPages);
    setFirst(page <= 0);
    setLast(tp <= 0 ? true : page >= tp - 1);
  }, [page, totalPages]);

  const applyResult = useCallback(<T,>(p: PagedResult<T>) => {
    setTotalPages(p.totalPages);
    setTotalElements(p.totalElements);
    setPage(p.page);
  }, []);

  /** For client-side paging over a full in-memory list (e.g. public catalog). */
  const syncClientPagination = useCallback(
    (totalItems: number, pageSize: number) => {
      setTotalElements(totalItems);
      const tp = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
      setTotalPages(tp);
      setPage((p) => Math.min(Math.max(0, p), tp - 1));
    },
    []
  );

  const goNext = useCallback(() => {
    setPage((n) => (last ? n : n + 1));
  }, [last]);

  const goPrev = useCallback(() => {
    setPage((n) => (first ? n : Math.max(0, n - 1)));
  }, [first]);

  const reset = useCallback((to = 0) => {
    setPage(to);
    setTotalPages(0);
    setTotalElements(0);
    setFirst(true);
    setLast(true);
  }, []);

  return {
    page,
    size,
    setPage,
    totalPages,
    totalElements,
    first,
    last,
    hasNext: !last,
    hasPrev: !first,
    applyResult,
    syncClientPagination,
    goNext,
    goPrev,
    reset,
  };
}
