import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'

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
    ? deviceLogs.log.map(item => ({
        time: new Date(item.createdAt).getTime(),
        tempAvg: item.tempValue,
        door: item.door ? 1 : 0,
        mcuId: item.mcuId
      }))
    : [{ time: 0, tempAvg: 0, door: 0, mcuId: '' }]

  const groupedByDevice: Record<string, { x: number; y: number }[]> = {}

  mappedData.forEach(item => {
    if (!groupedByDevice[item.mcuId]) {
      groupedByDevice[item.mcuId] = []
    }
    groupedByDevice[item.mcuId].push({ x: item.time, y: item.tempAvg })
  })

  const series: ApexAxisChartSeries = Object.keys(groupedByDevice).map(
    mcuId => ({
      type: 'area',
      name: `${mcuId} - ${t('temperatureName')}`,
      data: groupedByDevice[mcuId],
      zIndex: 50
    })
  )

  series.push(
    {
      type: 'area',
      name: t('tempMin'),
      zIndex: 60,
      data: mappedData.map(data => ({ x: data.time, y: minTemp }))
    },
    {
      type: 'area',
      name: t('tempMax'),
      zIndex: 60,
      data: mappedData.map(data => ({ x: data.time, y: maxTemp }))
    },
    {
      type: 'area',
      name: t('dashDoor'),
      zIndex: 30,
      data: mappedData.map(data => ({ x: data.time, y: data.door }))
    }
  )

  const generateColors = (count: number) => {
    const colors = ['oklch(72% 0.2 25 / 1)']
    for (let i = 1; i < count; i++) {
      const chroma = (Math.random() * 0.2 + 0.1).toFixed(4)
      const hue = (Math.random() * 360).toFixed(0)
      colors.push(`oklch(72% ${chroma} ${hue} / 1)`)
    }
    return colors
  }

  const dynamicColors = generateColors(series.length)

  const dynamicStrokeCurves = Array.from({ length: series.length }, (_, i) =>
    i === series.length - 1 ? 'stepline' : 'smooth'
  )

  const dynamicStrokeWidths = Array.from({ length: series.length }, (_, i) =>
    i === 0 ? 2.0 : i === series.length - 1 ? 1.5 : 0.8
  )

  const dynamicYaxis = Array.from({ length: series.length }, (_, i) => ({
    show: i === 0,
    axisTicks: {
      show: i === 0
    },
    axisBorder: {
      show: i === 0,
      color: 'oklch(72% 0.1938 31 / 1)'
    },
    min: i === series.length - 1 ? 5 : minTempAvg,
    max: i === series.length - 1 ? 0 : maxTempAvg
  }))

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
      curve: dynamicStrokeCurves,
      width: dynamicStrokeWidths
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: dynamicYaxis,
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
    colors: dynamicColors,
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: dynamicColors.map(color =>
          color.replace('72%', '79.71%')
        ),
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 25]
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
