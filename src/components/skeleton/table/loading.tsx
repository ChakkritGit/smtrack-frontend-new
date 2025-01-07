import Skeleton from 'react-loading-skeleton'

const DataTableLoading = () => {
  return (
    <div className='w-full p-3'>
      <div className='w-full skeletonTableHead'>
        <Skeleton count={5} height={25} baseColor='var(--fallback-bc, oklch(var(--bc) / 0.15))' highlightColor='oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity))' />
      </div>
      <div className='skeletonTableBody'>
        <Skeleton count={4} height={25} baseColor='var(--fallback-bc, oklch(var(--bc) / 0.15))' highlightColor='oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity))' />
      </div>
      <div className='skeletonTableFooter'>
        <Skeleton count={2} height={25} baseColor='var(--fallback-bc, oklch(var(--bc) / 0.15))' highlightColor='oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity))' />
      </div>
    </div>
  )
}

export default DataTableLoading
