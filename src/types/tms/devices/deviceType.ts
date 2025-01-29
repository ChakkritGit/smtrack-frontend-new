type DeviceTmsType = {
  adjTemp: number
  hospital: string
  id: string
  log: {
    createdAt: string
    date: string
    door: boolean
    id: string
    internet: boolean
    isAlert: boolean
    mcuId: string
    message: string
    plugin: boolean
    realValue: number
    tempValue: number
    time: string
    updatedAt: string
  }[]
  maxTemp: number
  minTemp: number
  name: string
  record: number
  sn: string
  ward: string
}

type CountTms = {
  door: number
  plug: number
  temp: number
}

export type { CountTms, DeviceTmsType }
