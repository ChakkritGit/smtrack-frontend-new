const HomeSkeleton = () => {
  return (
    <div className='p-3 px-[16px]'>
      <div className='skeleton h-[25px] w-[250px] mt-4'></div>
      <div className='flex items-center justify-center flex-wrap gap-4 mt-4 p-4'>
        <div className='skeleton w-[145px] h-[125px]'></div>
        <div className='skeleton w-[145px] h-[125px]'></div>
        <div className='skeleton w-[145px] h-[125px]'></div>
        <div className='skeleton w-[145px] h-[125px]'></div>
        <div className='skeleton w-[145px] h-[125px]'></div>
        <div className='skeleton w-[145px] h-[125px]'></div>
      </div>
      <div className='flex items-center justify-between h-[40px] mt-4'>
        <div className='skeleton h-[25px] w-[250px]'></div>
        <div className='flex items-center gap-2'>
          <div className="skeleton h-[25px] w-[100px]"></div>
          <div className='skeleton h-[36px] w-[36px]'></div>
          <div className='skeleton h-[36px] w-[36px]'></div>
        </div>
      </div>
      <div className='skeleton w-full h-[500px] mt-4'></div>
    </div>
  )
}

export { HomeSkeleton }
