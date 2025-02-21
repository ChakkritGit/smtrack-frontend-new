import {
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { ProbeType } from '../../types/smtrack/probe/probeType'
import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiCloseLargeLine
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { Option } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import ReactSlider from 'react-slider'
import { client } from '../../services/mqtt'
import { useDispatch } from 'react-redux'
import { setSubmitLoading } from '../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { ProbeListType } from '../../types/tms/devices/probeType'
import { AxiosError } from 'axios'
import AppMute from './appMute'
import Loading from '../skeleton/table/loading'

type AdjustmentsProps = {
  setProbeData: (value: SetStateAction<ProbeType[]>) => void
  openAdjustModalRef: RefObject<HTMLDialogElement | null>
  probe: ProbeType[]
  serial: string
  fetchDevices: (page: number, size?: number) => Promise<void>
}

const Adjustments = (props: AdjustmentsProps) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { openAdjustModalRef, probe, serial, setProbeData, fetchDevices } =
    props
  const [selectedProbe, setSelectedProbe] = useState<string>('')
  const [adjustmentsForm, setAdjustmentsForm] = useState({
    tempMin: 0,
    tempMax: 0,
    humiMin: 0,
    humiMax: 0,
    adjustTemp: 0,
    adjustHumi: 0
  })
  const [mqData, setMqData] = useState({ temp: 0, humi: 0 })
  const deviceModel = serial.substring(0, 3) === 'eTP' ? 'etemp' : 'items'
  const version = serial.substring(3, 5).toLowerCase()
  const [probeBefore, setProbeBefore] = useState<ProbeType | undefined>(
    undefined
  )
  const [tab, setTab] = useState(1)

  const [muteMode, setMuteMode] = useState({
    choichOne: 'immediately',
    choichtwo: 'send',
    choichthree: 'onetime',
    choichfour: 'on'
  })
  const [sendTime, setSendTime] = useState({
    after: 5,
    every: 5
  })
  const [scheduleDay, setScheduleDay] = useState({
    firstDay: '',
    seccondDay: '',
    thirdDay: ''
  })
  const [scheduleTime, setScheduleTime] = useState({
    firstTime: '',
    secondTime: '',
    thirdTime: '',
    firstMinute: '',
    seccondMinute: '',
    thirdMinute: ''
  })
  const [isLoadingMqtt, setIsLoadingMqtt] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    const body = {
      tempMin: adjustmentsForm.tempMin,
      tempMax: adjustmentsForm.tempMax,
      humiMin: adjustmentsForm.humiMin,
      humiMax: adjustmentsForm.humiMax,
      tempAdj: adjustmentsForm.adjustTemp,
      humiAdj: adjustmentsForm.adjustHumi
    }
    try {
      await axiosInstance.put<responseType<ProbeListType>>(
        `/devices/probe/${selectedProbe}`,
        body
      )
      await fetchDevices(1, 10)
      openAdjustModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => openAdjustModalRef.current?.showModal())
    } catch (error) {
      openAdjustModalRef.current?.close()
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      } else {
        console.error(error)
        Swal.fire({
          title: t('alertHeaderError'),
          text: t('descriptionErrorWrong'),
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const handleSubmitAppSetting = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    const body = {
      firstDay: scheduleDay.firstDay,
      secondDay: scheduleDay.seccondDay,
      thirdDay: scheduleDay.thirdDay,
      firstTime: `${scheduleTime.firstTime}${scheduleTime.firstMinute}`,
      secondTime: `${scheduleTime.secondTime}${scheduleTime.seccondMinute}`,
      thirdTime: `${scheduleTime.thirdTime}${scheduleTime.thirdMinute}`,
      notiDelay: muteMode.choichOne === 'immediately' ? 0 : sendTime.after,
      notiMobile: muteMode.choichfour === 'on' ? true : false,
      notiRepeat: muteMode.choichthree === 'onetime' ? 0 : sendTime.every,
      notiToNormal: muteMode.choichtwo === 'send' ? true : false
    }
    try {
      await axiosInstance.put<responseType<ProbeListType>>(
        `/devices/probe/${selectedProbe}`,
        body
      )
      await fetchDevices(1, 10)
      openAdjustModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => openAdjustModalRef.current?.showModal())
    } catch (error) {
      openAdjustModalRef.current?.close()
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      } else {
        console.error(error)
        Swal.fire({
          title: t('alertHeaderError'),
          text: t('descriptionErrorWrong'),
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: (item[labelKey] as unknown as string) ?? t('nameNotRegister')
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      .filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: (item[labelKey] as unknown as string) ?? t('nameNotRegister')
      }))[0]

  const resetForm = () => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item)
    client.publish(`${serial}/${filter?.channel}/temp`, 'off')
    setAdjustmentsForm({
      tempMin: 0,
      tempMax: 0,
      humiMin: 0,
      humiMax: 0,
      adjustTemp: 0,
      adjustHumi: 0
    })
    setSelectedProbe('')
    setMqData({ temp: 0, humi: 0 })
    setTab(1)
    setProbeData([])
    openAdjustModalRef.current?.close()
  }

  useEffect(() => {
    if (tab === 2) {
      const filter = probe
        .filter(item => item.id === selectedProbe)
        .find(item => item) as ProbeType
      setMuteMode({
        choichOne: filter?.notiDelay < 5 ? 'immediately' : 'after',
        choichtwo: filter?.notiToNormal ? 'send' : 'donotsend',
        choichthree: filter?.notiRepeat < 5 ? 'onetime' : 'every',
        choichfour: filter?.notiMobile ? 'on' : 'off'
      })
      setSendTime({
        after: filter?.notiDelay < 5 ? 5 : filter.notiDelay,
        every: filter?.notiRepeat < 5 ? 5 : filter.notiRepeat
      })
      setScheduleDay({
        firstDay: filter?.firstDay,
        seccondDay: filter?.secondDay,
        thirdDay: filter?.thirdDay
      })
      setScheduleTime({
        firstTime: filter?.firstTime.substring(0, 2),
        secondTime: filter?.secondTime.substring(0, 2),
        thirdTime: filter?.thirdTime.substring(0, 2),
        firstMinute: filter?.firstTime.substring(2, 4),
        seccondMinute: filter?.secondTime.substring(2, 4),
        thirdMinute: filter?.thirdTime.substring(2, 4)
      })
    }
  }, [tab, probe, selectedProbe])

  useEffect(() => {
    if (selectedProbe === '' && probe.length > 0) {
      setSelectedProbe(probe[0]?.id)
    }
  }, [probe])

  useEffect(() => {
    if (selectedProbe !== '' && tab === 1) {
      const filter = probe
        .filter(item => item.id === selectedProbe)
        .find(item => item)
      setAdjustmentsForm({
        tempMin: filter?.tempMin ?? 0,
        tempMax: filter?.tempMax ?? 0,
        humiMin: filter?.humiMin ?? 0,
        humiMax: filter?.humiMax ?? 0,
        adjustTemp: filter?.tempAdj ?? 0,
        adjustHumi: filter?.humiAdj ?? 0
      })
      setProbeBefore(filter)
      client.subscribe(`${serial}/temp/real`, err => {
        if (err) {
          console.error('MQTT Suubscribe Error', err)
        }
      })
      setIsLoadingMqtt(true)
      if (deviceModel === 'etemp') {
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/${filter?.channel}/temp`,
          'on'
        )
      } else {
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/${filter?.channel}/temp`,
          'on'
        )
      }
      client.publish(`${serial}/${filter?.channel}/temp`, 'on')

      client.on('message', (_topic, message) => {
        setMqData(JSON.parse(message.toString()))
        setIsLoadingMqtt(false)
      })

      client.on('error', err => {
        console.error('MQTT Error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        console.error('MQTT Reconnecting...')
      })
    }
  }, [probe, selectedProbe, serial, tab])

  return (
    <dialog ref={openAdjustModalRef} className='modal overflow-y-scroll py-10'>
      <form
        onSubmit={tab === 1 ? handleSubmit : handleSubmitAppSetting}
        className='modal-box w-5/6 max-w-[50rem] h-max max-h-max'
      >
        <div className='flex items-center justify-between gap-2'>
          <h3 className='font-bold text-base'>{serial}</h3>
          <button
            type='button'
            className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300'
            onClick={resetForm}
          >
            <RiCloseLargeLine size={20} />
          </button>
        </div>
        <div className='divider divider-vertical my-2'></div>

        <div className='form-control w-full'>
          <label className='label flex-col items-start'>
            <span className='label-text mb-2'>{t('selectProbe')}</span>
            <Select
              options={mapOptions<ProbeType, keyof ProbeType>(
                probe,
                'id',
                'name'
              )}
              value={mapDefaultValue<ProbeType, keyof ProbeType>(
                probe,
                selectedProbe,
                'id',
                'name'
              )}
              onChange={e => {
                setSelectedProbe(String(e?.value))
              }}
              autoFocus={false}
              className='react-select-container z-[150] custom-menu-select w-full'
              classNamePrefix='react-select'
            />
          </label>
        </div>

        <div role='tablist' className='tabs tabs-bordered mt-3'>
          <input
            type='radio'
            name='my_tabs_1'
            role='tab'
            className='tab'
            aria-label={t('adjustMents')}
            defaultChecked
            checked={tab === 1}
            onClick={() => setTab(1)}
          />
          <div role='tabpanel' className='tab-content'>
            <div className='mt-3'>
              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.tempMin > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: parseFloat(
                            (adjustmentsForm.tempMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='tempMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={adjustmentsForm.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.tempMin < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: parseFloat(
                            (adjustmentsForm.tempMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.tempMax > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: parseFloat(
                            (adjustmentsForm.tempMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='tempMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={adjustmentsForm.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.tempMax < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: parseFloat(
                            (adjustmentsForm.tempMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMin > 0) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: parseFloat(
                            (adjustmentsForm.humiMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='humiMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMin < 100) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: parseFloat(
                            (adjustmentsForm.humiMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMax > 0) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: parseFloat(
                            (adjustmentsForm.humiMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='humiMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMax < 100) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: parseFloat(
                            (adjustmentsForm.humiMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>
                      {t('probeTempSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-btn'
                      value={[adjustmentsForm.tempMin, adjustmentsForm.tempMax]}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: values[0],
                          tempMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={-40}
                      max={120}
                      renderThumb={(props, state) => (
                        <div
                          {...props}
                          className='flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-orange-500/50'
                        >
                          {state.valueNow}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Humidity */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>
                      {t('probeHumiSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-btn'
                      value={[adjustmentsForm.humiMin, adjustmentsForm.humiMax]}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: values[0],
                          humiMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={0}
                      max={100}
                      renderThumb={(props, state) => (
                        <div
                          {...props}
                          className='flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-blue-500/50'
                        >
                          {state.valueNow}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    name='tempMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={adjustmentsForm.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMin: num })
                      }
                    }}
                  />
                  <input
                    name='tempMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={adjustmentsForm.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMax: num })
                      }
                    }}
                  />
                </div>

                {/* Humidity */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    name='humiMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMin: num })
                      }
                    }}
                  />
                  <input
                    name='humiMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMax: num })
                      }
                    }}
                  />
                </div>
              </div>

              <div className='divider divider-vertical my-2'></div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* AdjustTemperature */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>{t('adjustTemp')}</span>
                    <ReactSlider
                      className={`relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3 ${
                        isLoadingMqtt ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-btn'
                      value={adjustmentsForm.adjustTemp}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: values
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={-40}
                      max={120}
                      disabled={isLoadingMqtt}
                      renderThumb={(props, state) => (
                        <div
                          {...props}
                          className={`flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-orange-500/50 ${
                            isLoadingMqtt ? 'cursor-not-allowed' : ''
                          }`}
                        >
                          {state.valueNow}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* AdjustHumidity */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>{t('adjustHumi')}</span>
                    <ReactSlider
                      className={`relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3 ${
                        isLoadingMqtt ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-btn'
                      value={adjustmentsForm.adjustHumi}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: values
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={0}
                      max={100}
                      disabled={isLoadingMqtt}
                      renderThumb={(props, state) => (
                        <div
                          {...props}
                          className={`flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-blue-500/50 ${
                            isLoadingMqtt ? 'cursor-not-allowed' : ''
                          }`}
                        >
                          {state.valueNow}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    name='adjustTemp'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={adjustmentsForm.adjustTemp}
                    disabled={isLoadingMqtt}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: num
                        })
                      }
                    }}
                  />
                </div>

                {/* Humidity */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    name='adjustMumi'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.adjustHumi}
                    disabled={isLoadingMqtt}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: num
                        })
                      }
                    }}
                  />
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('adjustTemp')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    disabled={isLoadingMqtt}
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustTemp > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: parseFloat(
                            (adjustmentsForm.adjustTemp - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='adjustTemp'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    value={adjustmentsForm.adjustTemp}
                    disabled={isLoadingMqtt}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: num
                        })
                      }
                    }}
                  />
                  <button
                    disabled={isLoadingMqtt}
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustTemp < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: parseFloat(
                            (adjustmentsForm.adjustTemp + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('adjustHumi')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    disabled={isLoadingMqtt}
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustHumi > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: parseFloat(
                            (adjustmentsForm.adjustHumi - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='adjustHumi'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    value={adjustmentsForm.adjustHumi}
                    disabled={isLoadingMqtt}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: num
                        })
                      }
                    }}
                  />
                  <button
                    disabled={isLoadingMqtt}
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustHumi < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: parseFloat(
                            (adjustmentsForm.adjustHumi + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {!isLoadingMqtt ? (
              <>
                <div className='flex flex-col md:flex-row items-center justify-around gap-5 md:gap-2 mt-5'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>{t('currentTemp')}</span>
                    <div className='flex items-center justify-center h-[55px] min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.temp ? `${mqData.temp.toFixed(2)}°C` : '—'}
                    </div>
                  </div>
                  <RiArrowRightLine size={24} className='hidden md:flex mt-5' />
                  <RiArrowDownLine size={24} className='flex md:hidden' />
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>
                      {t('adjustAfterTemp')}
                    </span>
                    <div className='flex items-center justify-center h-[55px] min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.temp
                        ? `${(
                            mqData.temp +
                            adjustmentsForm.adjustTemp -
                            (probeBefore?.tempAdj ?? 0)
                          ).toFixed(2)}°C`
                        : '—'}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-around gap-5 md:gap-2 mt-5'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>{t('currentHum')}</span>
                    <div className='flex items-center justify-center h-[55px] min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.humi ? `${mqData.humi.toFixed(2)}%` : '—'}
                    </div>
                  </div>
                  <RiArrowRightLine size={24} className='hidden md:flex mt-5' />
                  <RiArrowDownLine size={24} className='flex md:hidden' />
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>
                      {t('adjustAfterHum')}
                    </span>
                    <div className='flex items-center justify-center h-[55px] min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.humi
                        ? `${(
                            mqData.humi +
                            adjustmentsForm.adjustHumi -
                            (probeBefore?.humiAdj ?? 0)
                          ).toFixed(2)}%`
                        : '—'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='mt-5'>
                <Loading />
              </div>
            )}
          </div>

          <input
            type='radio'
            name='my_tabs_1'
            role='tab'
            className='tab'
            aria-label={t('notificationSettings')}
            checked={tab === 2}
            onClick={() => setTab(2)}
          />
          <div role='tabpanel' className='tab-content mt-3'>
            <AppMute
              muteMode={muteMode}
              setMuteMode={setMuteMode}
              sendTime={sendTime}
              setSendTime={setSendTime}
              scheduleDay={scheduleDay}
              setScheduleDay={setScheduleDay}
              scheduleTime={scheduleTime}
              setScheduleTime={setScheduleTime}
            />
          </div>

          <input
            type='radio'
            name='my_tabs_1'
            role='tab'
            className='tab'
            aria-label={t('muteSetting')}
            checked={tab === 3}
            onClick={() => setTab(3)}
          />
          <div role='tabpanel' className='tab-content mt-3'>
            Tab content 3
          </div>
        </div>

        {(tab === 1 || tab === 2) && (
          <div className={`modal-action ${isLoadingMqtt ? 'mt-0' : 'mt-6'}`}>
            <button type='submit' className='btn btn-primary'>
              {t('submitButton')}
            </button>
          </div>
        )}
      </form>
    </dialog>
  )
}

export default Adjustments
