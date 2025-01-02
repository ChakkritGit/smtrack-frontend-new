import Skeleton from 'react-loading-skeleton'

const DataTableLoading = () => {
  return (
    <div className='w-full'>
      <div className='w-full bg-red-400'>
        <Skeleton  />
      </div>
      <div>2</div>
      <div>3</div>
    </div>
  )
}

export default DataTableLoading
