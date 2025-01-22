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
  if (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax) ||
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  ) {
    return true
  } else {
    return false
  }
}

const tempLimit = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined
) => {
  if (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax)
  ) {
    return true
  } else {
    return false
  }
}

const humiLimit = (
  humiMin: number,
  humiMax: number,
  humiDisplay: number | undefined
) => {
  if (
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  ) {
    return true
  } else {
    return false
  }
}

const doorOpen = (deviceData: DeviceLogsType | undefined) => {
  if (
    deviceData?.log[0]?.door1 ||
    deviceData?.log[0]?.door2 ||
    deviceData?.log[0]?.door3
  ) {
    return true
  } else {
    return false
  }
}

const unPlug = (deviceData: DeviceLogsType | undefined) => {
  if (deviceData?.log[0]?.plug) {
    return true
  } else {
    return false
  }
}

const battertyLevel = (deviceData: DeviceLogsType | undefined) => {
  const plugIn = deviceData?.log[0]?.plug
  const level = deviceData?.log[0]?.battery
  if (plugIn) {
    return <RiBatteryChargeLine />
  } else if (level === 0) {
    return <RiBatteryLine />
  } else if (level && level <= 50) {
    return <RiBatteryLowLine />
  } else if (level && level <= 100) {
    return <RiBatteryFill />
  } else {
    return <RiAlertLine />
  }
}

// const

export { probeLimitIcon, tempLimit, humiLimit, doorOpen, unPlug, battertyLevel }
