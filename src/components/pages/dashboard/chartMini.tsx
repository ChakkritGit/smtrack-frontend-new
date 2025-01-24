import Chart from 'react-apexcharts'
import { DeviceLogType } from '../../../types/smtrack/logs/deviceLog'
import { useTranslation } from 'react-i18next'

interface ChartMiniProps {
  logData: DeviceLogType[]
  tempMin: number
  tempMax: number
}

const ChartMini = (props: ChartMiniProps) => {
  const { t } = useTranslation()
  const { logData, tempMin, tempMax } = props

  const tempAvgValues = logData.map(item => item.temp)
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2

  const mappedData = logData.map(item => {
    const time = new Date(item.sendTime).getTime()
    return {
      time,
      tempAvg: item.tempDisplay,
      humidityAvg: item.humidityDisplay,
      door: item.door1 || item.door2 || item.door3 ? 1 : 0
    }
  })

  const series: ApexAxisChartSeries = [
    {
      name: t('temperatureName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
    {
      name: t('humidityName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.humidityAvg
      }))
    },
    {
      name: t('tempMin'),
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMin
      }))
    },
    {
      name: t('tempMax'),
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMax
      }))
    },
    {
      name: t('dashDoor'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.door
      }))
    }
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true
        },
        dynamicAnimation: {
          speed: 500
        }
      },
      stacked: false,
      zoom: {
        type: 'x',
        enabled: false,
        autoScaleYaxis: false
      },
      toolbar: {
        show: false,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: false
        }
      },
      locales: [
        {
          name: 'en',
          options: {
            months: [
              'มกราคม',
              'กุมภาพันธ์',
              'มีนาคม',
              'เมษายน',
              'พฤษภาคม',
              'มิถุนายน',
              'กรกฎาคม',
              'สิงหาคม',
              'กันยายน',
              'ตุลาคม',
              'พฤศจิกายน',
              'ธันวาคม'
            ],
            shortMonths: [
              'ม.ค.',
              'ก.พ.',
              'มี.ค.',
              'เม.ย.',
              'พ.ค.',
              'มิ.ย.',
              'ก.ค.',
              'ส.ค.',
              'ก.ย.',
              'ต.ค.',
              'พ.ย.',
              'ธ.ค.'
            ],
            days: [
              'อาทิตย์',
              'จันทร์',
              'อังคาร',
              'พุธ',
              'พฤหัสบดี',
              'ศุกร์',
              'เสาร์'
            ],
            shortDays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
            toolbar: {
              exportToSVG: 'Download SVG',
              exportToPNG: 'Download PNG',
              // "menu": "Menu",
              selection: 'เลือก',
              selectionZoom: 'ซูมเลือก',
              zoomIn: 'ซูมเข้า',
              zoomOut: 'ซูมออก',
              pan: 'การแพน',
              reset: 'ยกเลิกการซูม'
            } //make it component
          }
        }
      ],
      defaultLocale: 'en'
    },
    tooltip: {
      theme: 'apexcharts-tooltip',
      x: {
        format: 'dd MMM yy HH:mm'
      },
      style: {
        fontSize: '14px'
      }
    },
    grid: {
      show: true,
      // borderColor:
      //   theme.mode === 'dark'
      //     ? 'var(--grid-line-dark)'
      //     : 'var(--grid-line-light)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    stroke: {
      lineCap: 'round',
      curve: ['smooth', 'smooth', 'smooth', 'smooth', 'stepline'],
      width: [2.5, 2, 0.8, 0.8, 1.5]
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: 'oklch(0.7 0.2 27 / 1)'
        },
        min: minTempAvg,
        max: maxTempAvg
      },
      {
        show: true,
        opposite: false,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: 'oklch(0.8 0.15 230 / 1)'
        },
        min: 0,
        max: 100
      },
      {
        show: false,
        min: minTempAvg,
        max: maxTempAvg
      },
      {
        show: false,
        min: minTempAvg,
        max: maxTempAvg
      },
      {
        show: false,
        min: 5,
        max: 0
      }
    ],
    noData: {
      text: undefined,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    colors: [
      'oklch(0.7 0.15 27 / var(--tw-text-opacity, 1))',
      'oklch(0.8 0.2 230 / var(--tw-text-opacity, 1))',
      'oklch(0.75 0.18 190 / var(--tw-text-opacity, 1))',
      'oklch(0.75 0.18 190 / var(--tw-text-opacity, 1))',
      'oklch(0.85 0.3 90 / var(--tw-text-opacity, 1))'
    ]
  }

  return (
    <div className='mb-5'>
      <Chart type='line' options={options} series={series} height={300} />
    </div>
  )
}

export default ChartMini
