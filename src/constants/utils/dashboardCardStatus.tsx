import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine
} from 'react-icons/ri'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'
import { DeviceLogType } from '../../types/smtrack/logs/deviceLog'

const probeLimitIcon = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined,
  humiMin: number,
  humiMax: number,
  humiDisplay: number | undefined
) => {
  return (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax) ||
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  )
}

const tempLimit = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined
) => {
  return (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax)
  )
}

const humiLimit = (
  humiMin: number,
  humiMax: number,
  humiDisplay: number | undefined
) => {
  return (
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  )
}

const doorOpen = (deviceData: DeviceLogsType | undefined) => {
  return (
    deviceData?.log[0]?.door1 ||
    deviceData?.log[0]?.door2 ||
    deviceData?.log[0]?.door3
  )
}

const unPlug = (deviceData: DeviceLogsType | undefined) => {
  return deviceData?.log[0]?.plug
}

const battertyLevel = (deviceData: DeviceLogsType | undefined) => {
  const plugIn = deviceData?.log[0]?.plug
  const level = deviceData?.log[0]?.battery
  if (plugIn) {
    return <RiBatteryChargeLine size={20} />
  } else if (level === 0) {
    return <RiBatteryLine size={20} />
  } else if (level && level <= 50) {
    return <RiBatteryLowLine size={20} />
  } else if (level && level <= 100) {
    return <RiBatteryFill size={20} />
  } else {
    return <RiAlertLine size={20} />
  }
}

const tempOfDay = (deviceData: DeviceLogsType | undefined, channel: string) => {
  const max =
    deviceData?.log?.length &&
    Number(
      Math.max(
        ...deviceData.log
          .filter(filter => filter.probe.includes(channel))
          .map(item => item.tempDisplay)
      )
    ).toFixed(2)
  const min =
    deviceData?.log?.length &&
    Number(
      Math.min(
        ...deviceData.log
          .filter(filter => filter.probe.includes(channel))
          .map(item => item.tempDisplay)
      )
    ).toFixed(2)

  return {
    min,
    max
  }
}

const sdCard = (deviceData: DeviceLogsType | undefined) => {
  return deviceData?.log[0]?.extMemory ?? false
}

const test = (count: number) => {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      battery: 100,
      createAt: new Date(Date.now() - i * 300000).toISOString(), // ลดเวลาทีละ 5 นาที
      door1: true,
      door2: false,
      door3: false,
      extMemory: false,
      humidity: Math.floor(Math.random() * 100),
      humidityDisplay: Math.floor(Math.random() * 100),
      id: `6777c${(i + 1000).toString(16)}6f441029ff9c31${i.toString(16)}`,
      internet: true,
      plug: Math.random() > 0.5,
      probe: '1',
      sendTime: new Date(Date.now() - i * 300000 - 5000).toISOString(), // ลดเวลาทีละ 5 นาที + 5 วินาที
      serial: 'eTPV1-1P-L0167-0267-002',
      temp: Math.floor(Math.random() * 32),
      tempDisplay: Math.floor(Math.random() * 32),
      tempInternal: (31 + Math.random() * 10).toFixed(2),
      updateAt: new Date(Date.now() - i * 300000).toISOString()
    })
  }

  return data as unknown as DeviceLogType[]
}

export {
  probeLimitIcon,
  tempLimit,
  humiLimit,
  doorOpen,
  unPlug,
  battertyLevel,
  tempOfDay,
  sdCard,
  test
}
