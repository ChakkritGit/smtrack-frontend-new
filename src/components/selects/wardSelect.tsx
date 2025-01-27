import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import { useContext, useEffect, useState } from 'react'
import { setWardId } from '../../redux/actions/utilsActions'
import { Option, Ward } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { WardType } from '../../types/smtrack/wards/wardType'

const WardSelect = () => {
  const dispatch = useDispatch()
  const { hosId, wardId } = useSelector((state: RootState) => state.utils)
  const { ward } = useContext(GlobalContext) as GlobalContextType
  const [filterWard, setFilterWard] = useState<WardType[]>([])

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

  const getWard = (wardID: string | undefined) => {
    if (wardID !== '') {
      dispatch(setWardId(String(wardID)))
    } else {
      dispatch(setWardId(''))
    }
  }

  useEffect(() => {
    const filterWard = ward.filter(item =>
      item?.hosId?.toLowerCase().includes(hosId?.toLowerCase())
    )
    setFilterWard(filterWard)
  }, [ward, hosId])

  return (
    <Select
      options={mapOptions<Ward, keyof Ward>(ward, 'id', 'wardName')}
      value={mapDefaultValue<Ward, keyof Ward>(
        filterWard,
        wardId ? wardId : '',
        'id',
        'wardName'
      )}
      onChange={e => getWard(e?.value)}
      autoFocus={false}
      className='react-select-container z-30'
      classNamePrefix='react-select'
    />
  )
}

export default WardSelect
