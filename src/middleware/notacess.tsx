import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { RiAlertFill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

const Notacess = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const langs = localStorage.getItem("lang")

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('Logo_SM_WBG.jpg')

    return () => {
      changeFavicon('Logo_SM_WBG.jpg')
    }
  }, [])

  return (
    <div>
      {/* <div $bgColor="rgba(200, 200, 0, 0.4)" $shadowColor="rgba(200, 200, 0, 0.7)" /> */}
      <RiAlertFill size={64} />
      <h1>titleNotAccess</h1>
      <p>descriptionNotAccess</p>
      <p>
        <i onClick={() => navigate(-1)}>buttonErrorBack</i>
      </p>
    </div>
  )
}

export default Notacess