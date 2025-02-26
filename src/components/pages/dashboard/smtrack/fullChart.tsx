import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLogs } from '../../../../types/smtrack/devices/deviceType'
import Loading from '../../../skeleton/table/loading'

interface FullChartPropType {
  dataLog: DeviceLogs[]
  tempMin: number
  tempMax: number
  isLoading: boolean
}

const FullChartComponent = (props: FullChartPropType) => {
  const { t } = useTranslation()
  const { dataLog, tempMin, tempMax, isLoading } = props

  const tempAvgValues = dataLog ? dataLog.map(item => item.temp) : [0]
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2

  const mappedData = dataLog.map(item => {
    const time = new Date(item._time).getTime()
    return {
      time,
      tempAvg: item.temp,
      humidityAvg: item.humidity,
      door: item.door1 || item.door2 || item.door3 ? 1 : 0
    }
  })

  const series: ApexAxisChartSeries = [
    {
      type: 'area',
      zIndex: 2,
      name: t('humidityName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.humidityAvg
      }))
    },
    {
      type: 'area',
      zIndex: 1,
      name: t('temperatureName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
    {
      type: 'area',
      name: t('tempMin'),
      zIndex: 3,
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMin
      }))
    },
    {
      type: 'area',
      name: t('tempMax'),
      zIndex: 4,
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMax
      }))
    },
    {
      type: 'area',
      name: t('dashDoor'),
      zIndex: 5,
      data: mappedData.map(data => ({
        x: data.time,
        y: data.door
      }))
    }
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true
        },
        dynamicAnimation: {
          speed: 500
        }
      },
      stacked: true,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show: true,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: true
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
      strokeDashArray: 5,
      borderColor: 'color(61% 0 238 / var(--tw-text-opacity, .15))',
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
      width: [3, 3, 1, 1, 2]
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: [
      {
        show: true,
        opposite: false,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: 'oklch(79% 0.1305 238 / 1)'
        },
        min: 0,
        max: 100
      },
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: 'oklch(73.24% 0.1973 44.47 / 1)'
        },
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
      text: t('nodata'),
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: 'oklch(61% 0 238 / var(--tw-text-opacity, 1))',
        fontSize: '14px',
        fontFamily: 'anuphan'
      }
    },
    colors: [
      'oklch(79% 0.1305 238 / var(--tw-text-opacity, 0.7))',
      'oklch(73.24% 0.1973 44.47 / var(--tw-text-opacity, 1))',
      'oklch(81% 0.1696 175 / var(--tw-text-opacity, 1))',
      'oklch(81% 0.1696 175 / var(--tw-text-opacity, 1))',
      'oklch(90% 0.1378 90 / var(--tw-text-opacity, 1))'
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [
          'oklch(84.41% 0.0937 238 / var(--tw-text-opacity, 0.7))',
          'oklch(76.18% 0.1702 44.47 / var(--tw-text-opacity, 1))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))'
        ],
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 70]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'right'
    }
  }

  return (
    <div className={`mt-3 ${isLoading ? 'h-[calc(100dvh-200px)]' : ''}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <Chart options={options} series={series} height={680} />
      )}
    </div>
  )
}

export default FullChartComponent
