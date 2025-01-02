import { ConfigType } from "../configs/configType"
import { DeviceLogType } from "../logs/deviceLog"
import { ProbeType } from "../probe/probeType"

type DeviceType = {
  config: ConfigType,
  createAt: string,
  firmware: string,
  hospital: string,
  id: string,
  installDate: string,
  location?: string,
  log: DeviceLogType[],
  name?: string,
  online: boolean,
  position?: string,
  positionPic?: string,
  probe: ProbeType[],
  remark?: string,
  seq: number,
  staticName: string,
  status: boolean,
  tag?: string,
  token: string,
  updateAt: string,
  ward: string,
  warranty: []
}

export type { DeviceType }