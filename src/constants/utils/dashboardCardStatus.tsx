import { RiErrorWarningLine, RiTempColdLine } from 'react-icons/ri'

const probeLimitIcon = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined
) => {
  if (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax)
  ) {
    return <RiErrorWarningLine />
  } else {
    return <RiTempColdLine />
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

export { probeLimitIcon, tempLimit, humiLimit }
