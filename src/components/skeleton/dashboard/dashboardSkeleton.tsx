const DashboardSkeleton = () => {
  return (
    <div className='p-3 px-[16px]'>
      <div className='flex items-center justify-between mt-[16px]'>
        <div className='skeleton w-[200px] lg:w-[350px] h-[30px]'></div>
        <div className='skeleton w-[100px] h-[25px]'></div>
      </div>
      <div className='flex items-center gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
        <div className='skeleton w-full xl:w-[35%] h-[295px]'></div>
        <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full xl:w-[65%] justify-items-center'>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
          <div className='skeleton w-full h-[140px]'></div>
        </div>
      </div>
      <div className='flex items-center flex-wrap xl:flex-nowrap gap-4 mt-4'>
        <div className='skeleton w-full xl:w-[50%] h-[435px]'></div>
        <div className='skeleton w-full xl:w-[50%] h-[435px]'></div>
      </div>
    </div>
  )
}

export { DashboardSkeleton }
