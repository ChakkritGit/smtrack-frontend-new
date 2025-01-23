import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine
} from 'react-icons/ri'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'

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
    return <RiBatteryLine size={20}  />
  } else if (level && level <= 50) {
    return <RiBatteryLowLine size={20}  />
  } else if (level && level <= 100) {
    return <RiBatteryFill size={20}  />
  } else {
    return <RiAlertLine size={20}  />
  }
}

const tempOfDay = (deviceData: DeviceLogsType | undefined, channel: string) => {
  const max =
    deviceData?.log?.length &&
    Number(Math.max(...deviceData.log.filter(filter => filter.probe.includes(channel)).map(item => item.tempDisplay))).toFixed(2)
  const min =
    deviceData?.log?.length &&
    Number(Math.min(...deviceData.log.filter(filter => filter.probe.includes(channel)).map(item => item.tempDisplay))).toFixed(2)

  return {
    min,
    max
  }
}

const sdCard = (deviceData: DeviceLogsType | undefined) => {
  return deviceData?.log[0]?.extMemory ?? false
}

const test = [
  {
    battery: 100,
    createAt: '2025-01-03T17:50:32.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c0f86f441029ff9c31be',
    internet: true,
    plug: true,
    probe: '1',
    sendTime: '2025-01-03T17:50:25.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 31.75,
    updateAt: '2025-01-03T17:50:32.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T17:55:03.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c2076f441029ff9c31bf',
    internet: true,
    plug: false,
    probe: '1',
    sendTime: '2025-01-03T17:55:00.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 33.25,
    updateAt: '2025-01-03T17:55:03.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T18:00:04.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c3346f441029ff9c31c1',
    internet: true,
    plug: false,
    probe: '1',
    sendTime: '2025-01-03T18:00:00.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 36.75,
    updateAt: '2025-01-03T18:00:04.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T18:05:03.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c45f6f441029ff9c31c3',
    internet: true,
    plug: false,
    probe: '1',
    sendTime: '2025-01-03T18:05:00.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 38,
    updateAt: '2025-01-03T18:05:03.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T18:09:04.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c5506f441029ff9c31c7',
    internet: true,
    plug: true,
    probe: '1',
    sendTime: '2025-01-03T18:09:01.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 38.5,
    updateAt: '2025-01-03T18:09:04.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T18:09:12.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c5586f441029ff9c31c8',
    internet: true,
    plug: false,
    probe: '1',
    sendTime: '2025-01-03T18:09:05.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 38.5,
    updateAt: '2025-01-03T18:09:12.000Z'
  },
  {
    battery: 100,
    createAt: '2025-01-03T18:10:03.000Z',
    door1: true,
    door2: false,
    door3: false,
    extMemory: false,
    humidity: Math.floor(Math.random() * 100),
    humidityDisplay: Math.floor(Math.random() * 100),
    id: '6777c58b6f441029ff9c31c9',
    internet: true,
    plug: false,
    probe: '1',
    sendTime: '2025-01-03T18:10:00.000Z',
    serial: 'eTPV1-1P-L0167-0267-002',
    temp: Math.floor(Math.random() * 32),
    tempDisplay: Math.floor(Math.random() * 32),
    tempInternal: 38.5,
    updateAt: '2025-01-03T18:10:03.000Z'
  }
]

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
