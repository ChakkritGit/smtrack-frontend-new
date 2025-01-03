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

export type { DevicesType, DeviceType }
