const FullDashboardSkeleton = () => {
  return (
    <div className='container mx-auto p-3 px-[16px]'>
      <div className='skeleton h-[35px] w-[250px] mt-4'></div>
      <div className='flex items-center justify-between mt-4 p-4'>
        <div className='skeleton w-[300px] h-[25px]'></div>
        <div className='skeleton w-[77px] h-[25px]'></div>
      </div>
      <div className='skeleton w-full h-[500px] mt-3'></div>
    </div>
  )
}

export default FullDashboardSkeleton
