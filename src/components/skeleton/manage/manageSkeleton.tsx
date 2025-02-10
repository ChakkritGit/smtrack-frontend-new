const ManageSkeleton = () => {
  return (
    <div className='p-3 px-[16px]'>
      <div className='skeleton h-[40px] w-[350px] mt-4'></div>
      <div className='flex flex-col items-end md:flex-row md:items-center justify-end gap-4 mt-4 p-4'>
        <div className='skeleton w-[77px] h-[25px]'></div>
        <div className='skeleton w-[107px] h-[48px]'></div>
      </div>
      <div className='skeleton w-full h-[300px] mt-5'></div>
    </div>
  )
}

export { ManageSkeleton }
