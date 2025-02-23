import { ReactNode, useCallback, useState } from 'react'
import PaginationPerpage from './paginationPerpage';
import { SingleValue } from 'react-select';
import { Option } from '../../types/global/hospitalAndWard';
import { useTranslation } from 'react-i18next';
import Loading from '../skeleton/table/loading';

type PaginationProps<T> = {
  data: T[];
  initialPerPage: number;
  itemPerPage: number[];
  renderItem: (item: T, index: number) => ReactNode;
  handlePageChange: (page: number) => void
  handlePerRowsChange: (newPerPage: number, page: number) => Promise<void>
  loading: boolean
}

const DevicePagination = <T,>({
  data,
  initialPerPage,
  renderItem,
  itemPerPage,
  handlePageChange,
  handlePerRowsChange,
  loading
}: PaginationProps<T>) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(initialPerPage)

  const totalPages = Math.ceil(data.length / perPage)
  const paginatedData = data.slice((currentPage - 1) * perPage, currentPage * perPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      handlePageChange(page)
    }
  }

  const handlePerPageChange = useCallback((event: SingleValue<Option>) => {
    setPerPage(Number(event?.value))
    handlePerRowsChange(Number(event?.value), currentPage)
    setCurrentPage(1)
  }, [currentPage])

  const generatePagination = () => {
    const pages: ReactNode[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`join-item btn ${currentPage === i ? 'btn-primary' : 'bg-base-300 border-base-300'}`}
            onClick={() => i  !== currentPage && goToPage(i)}
          >
            {i}
          </button>
        )
      }
    } else {
      if (currentPage > 3) {
        pages.push(
          <button
            key={1}
            className="join-item btn"
            onClick={() => goToPage(1)}
          >
            1
          </button>
        )
        if (currentPage > 4) {
          pages.push(
            <button key="start-dots" className="join-item btn btn-disabled">
              ...
            </button>
          )
        }
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`join-item btn ${currentPage === i ? 'btn-primary' : 'bg-base-300 border-base-300'}`}
            onClick={() => goToPage(i)}
          >
            {i}
          </button>
        )
      }

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
          pages.push(
            <button key="end-dots" className="join-item btn btn-disabled">
              ...
            </button>
          )
        }
        pages.push(
          <button
            key={totalPages}
            className="join-item btn"
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        )
      }
    }
    return pages
  }

  return (
    <>
      {
      !loading ?<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 content-center justify-items-center mt-5">
        {paginatedData.map((item, index) => renderItem(item, index))}
      </div>
      :
      <div>
        <Loading />
      </div>
      }

      <div className="flex flex-col lg:flex-row justify-between items-center mt-5 gap-4">
        <div className="flex items-center gap-2">
          <span>{t('selectPerPage')}</span>
          <PaginationPerpage
            perPage={itemPerPage}
            value={perPage}
            handlePerPageChange={handlePerPageChange} />
        </div>

        <div className="join">
          <button
            className="join-item btn bg-base-300 border-base-300"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          {generatePagination()}
          <button
            className="join-item btn bg-base-300 border-base-300"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </>
  )
}

export default DevicePagination
