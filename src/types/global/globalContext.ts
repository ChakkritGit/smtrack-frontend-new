import { Dispatch, SetStateAction } from 'react'
import { HospitalType } from '../smtrack/hospitals/hospitalType'
import { WardType } from '../smtrack/wards/wardType'

type GlobalContextType = {
  hospital: HospitalType[]
  ward: WardType[]
  setHospital: Dispatch<SetStateAction<HospitalType[]>>
  setWard: Dispatch<SetStateAction<WardType[]>>
}

export type { GlobalContextType }
