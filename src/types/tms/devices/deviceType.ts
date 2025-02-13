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

type LogChartTms = {
  probe: string
  result: string
  sn: string
  table: number
  _field: string
  _measurement: string
  _start: string
  _stop: string
  _time: string
  _value: number
}

type AddDeviceType = {
  id?: string
  ward: string
  hospital: string
  sn: string
  name: string
}

export type {
  CountTms,
  DeviceTmsType,
  DeviceListTmsType,
  DeviceLogTms,
  DeviceLogsTms,
  LogChartTms,
  AddDeviceType
}
