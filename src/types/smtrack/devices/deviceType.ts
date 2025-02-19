import { ConfigType } from '../configs/configType'
import { DeviceLogType } from '../logs/deviceLog'
import { ProbeType } from '../probe/probeType'
import { WarrantiesType } from '../warranties/warranties'

type DevicesType = {
  createAt: string
  firmware: string
  hospital: string
  id: string
  installDate: string
  location?: string
  name?: string
  online: boolean
  position?: string
  positionPic?: string
  remark?: string
  seq: number
  staticName: string
  status: boolean
  tag?: string
  token: string
  updateAt: string
  ward: string
}

interface DeviceType extends DevicesType {
  config: ConfigType
  probe: ProbeType[]
  log: DeviceLogType[]
  warranty: WarrantiesType[]
}

interface DeviceLogsType extends DevicesType {
  config: ConfigType
  probe: ProbeType[]
  log: DeviceLogType[]
  warranty: WarrantiesType[]
  repair: []
}

type DeviceListType = {
  id: string
  name: string
  ward: string
  sn?: string
  staticName: string
}

interface DeviceLog extends DevicesType {
  config: ConfigType
  log: DeviceLogType[]
  probe: ProbeType[]
  repair: []
  warranty: WarrantiesType[]
}

type DeviceLogs = {
  _time: string
  door1: boolean
  door2: boolean
  door3: boolean
  humidity: number
  probe: string
  temp: number
}

export type {
  DevicesType,
  DeviceType,
  DeviceLogsType,
  DeviceListType,
  DeviceLog,
  DeviceLogs
}
