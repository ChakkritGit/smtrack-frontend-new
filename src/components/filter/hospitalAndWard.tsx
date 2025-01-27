import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseLine, RiFilter3Line } from 'react-icons/ri'
import { Hospital, Option, Ward } from '../../types/global/hospitalAndWard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { HospitalType } from '../../types/smtrack/hospitals/hospitalType'
import { WardType } from '../../types/smtrack/wards/wardType'
import {
  cookieOptions,
  cookies,
  updateLocalStorageAndDispatch
} from '../../constants/utils/utilsConstants'
import { setHosId, setWardId } from '../../redux/actions/utilsActions'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'
import Select from 'react-select'

const HospitalAndWard = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { tokenDecode, wardId, hosId } = useSelector(
    (state: RootState) => state.utils
  )
  const { hospital, ward } = useContext(GlobalContext) as GlobalContextType
  const [showFilter, setShowFilter] = useState(false)
  const [wardName, setWardname] = useState<WardType[]>([])
  const { role } = tokenDecode || {}

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      .filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  const getHospital = (hospitalID: string | undefined) => {
    if (hospitalID !== '') {
      updateLocalStorageAndDispatch('hosId', hospitalID, setHosId, dispatch)
      setWardname(
        ward.filter(items =>
          hospitalID ? items.hospital.id.includes(hospitalID) : items
        )
      )
    } else {
      cookies.remove('hosId', cookieOptions)
      dispatch(setHosId(''))
    }
  }

  const getWard = (wardID: string | undefined) => {
    if (wardID !== '') {
      updateLocalStorageAndDispatch('wardId', wardID, setWardId, dispatch)
    } else {
      cookies.remove('wardId', cookieOptions)
      dispatch(setWardId(''))
    }
  }

  useEffect(() => {
    setWardname(
      ward?.filter(items => (hosId ? items.hospital.id.includes(hosId) : items))
    )
  }, [ward, hosId])

  const allHos = {
    id: '',
    hosName: 'ALL',
    createAt: '',
    updateAt: '',
    hospital: {} as HospitalType
  }
  const allWard = {
    id: '',
    wardName: 'ALL',
    wardSeq: 0,
    hosId: '',
    createAt: '',
    updateAt: '',
    hospital: {} as WardType
  }

  const updatedHosData = [allHos, ...(Array.isArray(hospital) ? hospital : [])]
  const updatedWardData = [
    allWard,
    ...(Array.isArray(wardName) ? wardName : [])
  ]

  return (
    <div className='flex items-center justify-center gap-3 h-[35px]'>
      {showFilter ? (
        <>
          {role !== 'ADMIN' && (
            <Select
              options={mapOptions<Hospital, keyof Hospital>(
                updatedHosData,
                'id',
                'hosName'
              )}
              value={mapDefaultValue<Hospital, keyof Hospital>(
                updatedHosData,
                hosId ? hosId : '',
                'id',
                'hosName'
              )}
              onChange={e => getHospital(e?.value)}
              autoFocus={false}
              className='react-select-container z-30 min-w-[150px]'
              classNamePrefix='react-select'
            />
          )}
          <Select
            options={mapOptions<Ward, keyof Ward>(
              updatedWardData,
              'id',
              'wardName'
            )}
            value={mapDefaultValue<Ward, keyof Ward>(
              updatedWardData,
              wardId ? wardId : '',
              'id',
              'wardName'
            )}
            onChange={e => getWard(e?.value)}
            autoFocus={false}
            className='react-select-container z-30 min-w-[150px]'
            classNamePrefix='react-select'
          />
          <RiCloseLine
            size={24}
            className='cursor-pointer hover:fill-primary duration-300'
            onClick={() => setShowFilter(false)}
          />
        </>
      ) : (
        <div
          className='flex items-center gap-2 cursor-pointer hover:fill-primary hover:text-primary duration-300'
          onClick={() => setShowFilter(true)}
        >
          <RiFilter3Line size={24} />
          <span>{t('deviceFilter')}</span>
        </div>
      )}
    </div>
  )
}

export default HospitalAndWard
