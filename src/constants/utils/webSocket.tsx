import { MdOutlineSdCard, MdOutlineSdCardAlert } from 'react-icons/md'
import {
  RiAlarmWarningFill,
  RiDoorClosedLine,
  RiDoorOpenLine
} from 'react-icons/ri'
import {
  TbPlugConnected,
  TbPlugConnectedX,
  TbReportAnalytics
} from 'react-icons/tb'
import {
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
  FaTemperatureEmpty
} from 'react-icons/fa6'
import { TFunction } from 'i18next'

const changIcon = (text: string) => {
  if (text.split(':')[1]?.substring(1, 5) === 'DOOR') {
    if (text.split(' ')[3] === 'opened') {
      return <RiDoorOpenLine className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
    } else {
      return <RiDoorClosedLine className='text-primary text-[28px] xl:text-[32px] w-[15%]' />
    }
  } else if (text.split(' ')[0] === 'Power') {
    if (text.split(' ')[1] === 'off') {
      return <TbPlugConnectedX className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
    } else {
      return <TbPlugConnected className='text-primary text-[28px] xl:text-[32px] w-[15%]' />
    }
  } else if (text.split(' ')[0] === 'SDCard') {
    if (text.split(' ')[1] === 'failed') {
      return <MdOutlineSdCardAlert className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
    } else {
      return <MdOutlineSdCard className='text-primary text-[28px] xl:text-[32px] w-[15%]' />
    }
  } else if (text.split(' ')[0]?.substring(0, 5) === 'PROBE') {
    if (text.split(' ')[4] === 'high') {
      return <FaTemperatureArrowUp className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
    } else if (text.split(' ')[4] === 'low') {
      return <FaTemperatureArrowDown className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
    } else {
      return <FaTemperatureEmpty className='text-primary text-[28px] xl:text-[32px] w-[15%]' />
    }
  } else if (text.split('/')[0] === 'REPORT') {
    return <TbReportAnalytics className='text-primary text-[28px] xl:text-[32px] w-[15%]' />
  } else {
    return <RiAlarmWarningFill className='text-red-500 text-[28px] xl:text-[32px] w-[15%]' />
  }
}

const changText = (text: string, t: TFunction<'translation', undefined>) => {
  if (text.split(':')[1]?.substring(1, 5) === 'DOOR') {
    const probe = text.split(' ')
    const probeNumber = probe[0].replace('PROBE', '')?.substring(0, 1)
    const doorNumber = probe[1].replace('DOOR', '')
    const status = probe[3] === 'opened' ? t('stateOn') : t('stateOff')
    return `${t('deviceProbeTb')} ${probeNumber} ${t(
      'doorNum'
    )} ${doorNumber} ${status}`
  } else if (text.split(' ')[0] === 'Power') {
    if (text.split(' ')[1] === 'off') {
      return t('plugProblem')
    } else {
      return t('plugBackToNormal')
    }
  } else if (text.split(' ')[0] === 'SDCard') {
    if (text.split(' ')[1] === 'failed') {
      return t('SdCardProblem')
    } else {
      return t('SdCardBackToNormal')
    }
  } else if (text.split(' ')[0]?.substring(0, 5) === 'PROBE') {
    if (text.split(' ')[4] === 'high') {
      return t('tempHigherLimmit')
    } else if (text.split(' ')[4] === 'low') {
      return t('tempBelowLimmit')
    } else {
      return t('tempBackToNormal')
    }
  } else if (text.split('/')[0] === 'REPORT') {
    return `${t('reportText')}/ ${t('devicsmtrackTb')}: ${
      extractValues(text)?.temperature
        ? extractValues(text)?.temperature
        : '- -'
    }°C, ${t('deviceHumiTb')}: ${
      extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'
    }%`
  } else {
    return text
  }
}

const extractValues = (text: string) => {
  if (text.split('/')[0] === 'REPORT') {
    const matches = text.match(/(-?\d+(\.\d+)?)/g)

    if (matches && matches.length >= 2) {
      const temperature = parseFloat(matches[0])
      const humidity = parseFloat(matches[1])
      return { temperature, humidity }
    }
  }

  return null
}

export { changIcon, changText, extractValues }
