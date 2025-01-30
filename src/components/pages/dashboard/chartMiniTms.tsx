import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../types/tms/devices/deviceType'

interface ChartMiniProps {
  deviceLogs: DeviceLogTms | undefined
  minTemp: number | undefined
  maxTemp: number | undefined
}

const ChartMiniTms = (props: ChartMiniProps) => {
  const { t } = useTranslation()
  const { deviceLogs, minTemp, maxTemp } = props

  const tempAvgValues = deviceLogs?.log
    ? deviceLogs?.log.map(item => item.tempValue)
    : [0]
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2

  const mappedData = deviceLogs?.log
    ? deviceLogs?.log.map(item => {
        const time = new Date(item.createdAt).getTime()
        return {
          time,
          tempAvg: item.tempValue,
          door: item.door ? 1 : 0
        }
      })
    : [{ time: '', tempAvg: 0, door: 0 }]

  const series: ApexAxisChartSeries = [
    {
      type: 'area',
      zIndex: 50,
      name: t('temperatureName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
    {
      type: 'area',
      name: t('tempMin'),
      zIndex: 60,
      data: mappedData.map(data => ({
        x: data.time,
        y: minTemp
      }))
    },
    {
      type: 'area',
      name: t('tempMax'),
      zIndex: 60,
      data: mappedData.map(data => ({
        x: data.time,
        y: maxTemp
      }))
    },
    {
      type: 'area',
      name: t('dashDoor'),
      zIndex: 30,
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
      strokeDashArray: 5,
      borderColor: 'oklch(61% 0 238 / var(--tw-text-opacity, .15))',
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
      curve: ['smooth', 'smooth', 'smooth', 'stepline'],
      width: [2.5, 0.8, 0.8, 1.5]
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
          color: 'oklch(72% 0.1938 31 / 1)'
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
      'oklch(72% 0.1938 31 / var(--tw-text-opacity, 1))',
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
          'oklch(79.71% 0.1332 31 / var(--tw-text-opacity, 1))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))'
        ],
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 85]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'right'
    }
  }

  return (
    <div className='mb-5'>
      <Chart options={options} series={series} height={310} />
    </div>
  )
}

export default ChartMiniTms
