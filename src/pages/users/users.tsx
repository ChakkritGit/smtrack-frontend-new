import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { UsersType } from '../../types/smtrack/users/usersType'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { RiDeleteBin7Line, RiEditLine, RiMore2Line } from 'react-icons/ri'
import defaultPic from '../../assets/images/default-user.jpg'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { getRoleLabel } from '../../constants/utils/utilsConstants'
import UserPagination from '../../components/pagination/userPagination'

const Users = () => {
  const { globalSearch, wardId, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { t } = useTranslation()
  const { role } = tokenDecode || {}
  const [users, setUsers] = useState<UsersType[]>([])
  const [usersFilter, setUsersFilter] = useState<UsersType[]>([])
  const [usersEdit, setUsersEdit] = useState<UsersType>()

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<UsersType[]>>(
        '/auth/user'
      )
      setUsers(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    try {
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filer = users.filter(item =>
      wardId
        ? (item.ward?.id?.toLowerCase().includes(wardId.toLowerCase()) &&
            item.display?.toLowerCase().includes(globalSearch.toLowerCase())) ||
          item.username?.toLowerCase().includes(globalSearch.toLowerCase())
        : item.display?.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.username?.toLowerCase().includes(globalSearch.toLowerCase())
    )
    setUsersFilter(filer)
  }, [users, globalSearch, wardId])

  const UserCard = useMemo(() => {
    if (usersFilter.length > 0) {
      return (
        <UserPagination
          data={usersFilter}
          initialPerPage={10}
          itemPerPage={[10, 30, 50, 100]}
          renderItem={(item, index) => (
            <div
              className='min-h-[240px] max-h-[270px] sm:w-[300px] lg:w-full w-full bg-base-100 rounded-btn'
              key={index}
            >
              <div
                className='h-full flex flex-col items-center gap-4 px-3 py-4'
                key={item.id}
              >
                <div className='flex items-center justify-between w-full'>
                  <span className='badge badge-primary bg-opacity-15 text-primary border-1 h-[30px]'>
                    {item.role ? getRoleLabel(item.role, t) : '—'}
                  </span>
                  <div className='dropdown dropdown-end'>
                    <button
                      tabIndex={0}
                      role='button'
                      data-tip={t('menuButton')}
                      className='btn btn-ghost flex p-0 max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px] tooltip tooltip-left'
                    >
                      <RiMore2Line size={20} />
                    </button>
                    <ul
                      tabIndex={0}
                      className='dropdown-content menu bg-base-100 rounded-box z-[1] max-w-[180px] w-[140px] p-2 shadow'
                    >
                      <li onClick={() => setUsersEdit(item)}>
                        <div className='flex items-center gap-3 text-[16px]'>
                          <RiEditLine size={20} />
                          <a>{t('editButton')}</a>
                        </div>
                      </li>
                      {(role === 'SUPER' || role === 'ADMIN') && (
                        <>
                          <div className='divider my-1 h-2 before:h-[1px] after:h-[1px]'></div>
                          <li>
                            <div className='flex items-center gap-3 text-[16px] text-red-500 hover:bg-red-500 hover:text-white'>
                              <RiDeleteBin7Line size={20} />
                              <a>{t('deleteButton')}</a>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <div className='avatar'>
                    <div className='w-24 rounded-btn'>
                      <img src={item.pic ? item.pic : defaultPic} alt='user' />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <label
                    htmlFor='span'
                    className='tooltip tooltip-top'
                    data-tip={item.display ?? '—'}
                  >
                    <span className='truncate block max-w-[180px] text-[20px]'>
                      {item.display ?? '—'}
                    </span>
                  </label>
                  <label
                    htmlFor='span'
                    className='tooltip tooltip-bottom'
                    data-tip={item.username ?? '—'}
                  >
                    <span className='truncate block max-w-[180px] text-base-content/50 text-[16px]'>
                      @{item.username ?? '—'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        />
      )
    } else {
      return (
        <div className='flex items-center justify-center loading-hieght-full'>
          <div>No Data!</div>
        </div>
      )
    }
  }, [usersFilter, role, t])

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[28px] font-medium'>{t('sidePermission')}</span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button className='btn btn-primary max-w-[130px]'>
            {t('addUserButton')}
          </button>
        </div>
      </div>
      {UserCard}
    </div>
  )
}

export default Users
