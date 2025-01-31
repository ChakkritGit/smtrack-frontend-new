const UserSkeleton = () => {
  return (
    <div className='p-3 px-[16px]'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <div className='skeleton w-[100px] h-[25px]'></div>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <div className='skeleton w-[100px] h-[25px]'></div>
          <div className='skeleton w-[100px] h-[50px]'></div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 content-center justify-items-center mt-5'>
        <div className='skeleton min-h-[240px] max-h-[270px] sm:w-[300px] lg:w-full w-full'></div>
        <div className='skeleton min-h-[240px] max-h-[270px] sm:w-[300px] lg:w-full w-full'></div>
        <div className='skeleton min-h-[240px] max-h-[270px] sm:w-[300px] lg:w-full w-full'></div>
      </div>
      <div className='flex flex-col lg:flex-row justify-between items-center mt-5 gap-4'>
        <div className='flex items-center gap-2'>
          <div className='skeleton w-[100px] h-[25px]'></div>
          <div className='skeleton w-[100px] h-[50px]'></div>
        </div>
        <div className='join gap-1'>
          <div className='skeleton w-[150px] h-[50px]'></div>
        </div>
      </div>
    </div>
  )
}

export { UserSkeleton }
