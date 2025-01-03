import { HospitalType } from "../hospitals/hospitalType"

type WardType = {
  createAt: string
  hosId: string
  id: string
  updateAt: string
  wardName: string
  wardSeq: number
  hospital: HospitalType
}

export type { WardType }
