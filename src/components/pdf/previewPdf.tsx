import { PDFViewer, usePDF } from '@react-pdf/renderer'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  RiBarChart2Line,
  RiDashboardLine,
  RiFilePdf2Fill
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import Fullchartpdf from './fullChartPdf'
import { useMemo } from 'react'
import { UAParser } from 'ua-parser-js'
import Loading from '../skeleton/table/loading'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

function PreviewPDF () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    title,
    ward,
    image,
    hospital,
    devSn,
    devName,
    chartIMG,
    dateTime,
    hosImg,
    tempMin,
    tempMax
  } = state
  const parser = new UAParser()
  const os = parser.getOS().name
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const pdfUrl = '/pdf.worker.min.js'

  const pdfViewer = useMemo(
    () => (
      <Fullchartpdf
        title={title}
        image={image}
        chartIMG={chartIMG}
        devSn={devSn}
        devName={devName}
        hospital={hospital}
        ward={ward}
        dateTime={dateTime}
        hosImg={hosImg}
      />
    ),
    [state]
  )

  const [instance, _update] = usePDF({ document: pdfViewer })

  return (
    <div className='container mx-auto p-3 h-[calc(100dvh-130px)]'>
      <div className='breadcrumbs text-sm mt-3'>
        <ul>
          <li>
            <a onClick={() => navigate('/dashboard')}>
              <RiDashboardLine size={16} className='mr-1' />
              {t('sideDashboard')}
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                navigate('/dashboard/chart', {
                  state: {
                    deviceLogs: {
                      sn: devSn,
                      minTemp: tempMin,
                      maxTemp: tempMax,
                      name: devName,
                      ward: ward,
                      hospital: hospital
                    }
                  }
                })
              }
            >
              <RiBarChart2Line size={16} className='mr-1' />
              {t('fullChart')}
            </a>
          </li>
          <li>
            <span className='inline-flex items-center gap-2'>
              <RiFilePdf2Fill size={16} className='mr-1' />
              {t('pagePDF')}
            </span>
          </li>
        </ul>
      </div>
      <div className='h-full mt-3'>
        {instance.loading ? (
          <Loading />
        ) : os === 'iOS' ? (
          <Worker workerUrl={pdfUrl}>
            <div className='w-full h-full'>
              <Viewer
                fileUrl={instance?.url ?? ''}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        ) : (
          <PDFViewer
            width={'100%'}
            height={'100%'}
            style={{ borderRadius: 'var(--border-radius-small)' }}
            className='!rounded-md'
          >
            {pdfViewer}
          </PDFViewer>
        )}
      </div>
    </div>
  )
}

export default PreviewPDF
