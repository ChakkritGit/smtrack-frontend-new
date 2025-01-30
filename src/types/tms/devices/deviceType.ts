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

type DeviceListTmsType = {
  hospital: string
  id: string
  name: string
  sn: string
  ward: string
}

type DeviceLogTms = {
  adjTemp: number
  hospital: string
  id: string
  maxTemp: number
  minTemp: number
  name: string
  record: number
  sn: string
  ward: string
  log: DeviceLogsTms[]
}

type DeviceLogsTms = {
  createdAt: string
  date: string
  door: boolean
  id: string
  internet: boolean
  isAlert: boolean
  mcuId: string
  message?: string
  plugin: boolean
  realValue: number
  tempValue: number
  time: string
  updatedAt: string
}

export type { CountTms, DeviceTmsType, DeviceListTmsType, DeviceLogTms, DeviceLogsTms }
