import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { Option, Ward } from '../../types/global/hospitalAndWard'
import { WardType } from '../../types/smtrack/wards/wardType'
import { FormState } from '../../types/smtrack/users/usersType'
import Select from 'react-select'

interface WardSelectType {
  formData: FormState
  setFormData: Dispatch<SetStateAction<FormState>>
}

const WardSelect = (props: WardSelectType) => {
  const { hosId } = useSelector((state: RootState) => state.utils)
  const { formData, setFormData } = props
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
      setFormData({ ...formData, wardId: String(wardID) })
    }
  }

  useEffect(() => {
    const filteredWard = ward.filter(item =>
      hosId ? item?.hosId?.toLowerCase().includes(hosId?.toLowerCase()) : item
    )
    setFilterWard(filteredWard)
  }, [ward, hosId])

  return (
    <Select
      key={formData.wardId}
      options={mapOptions<Ward, keyof Ward>(filterWard, 'id', 'wardName')}
      value={mapDefaultValue<Ward, keyof Ward>(
        filterWard,
        formData.wardId,
        'id',
        'wardName'
      )}
      onChange={e => getWard(e?.value)}
      autoFocus={false}
      className='react-select-container custom-menu-select w-full'
      classNamePrefix='react-select'
    />
  )
}

export default WardSelect
