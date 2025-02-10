import { TFunction } from 'i18next'
import { RiDashboardLine, RiFileSettingsLine, RiHome3Line, RiListSettingsLine, RiSettings3Line, RiShieldCheckLine, RiUser6Line } from 'react-icons/ri'

const menuDataArraySmtrack = (t: TFunction) => {
  return [
    {
      text: t('sideShowAllBox'),
      path: '/',
      icon: <RiHome3Line size={20} />
    },
    {
      text: t('sideDashboard'),
      path: '/dashboard',
      icon: <RiDashboardLine size={20} />
    },
    {
      text: t('sidePermission'),
      path: '/permission',
      icon: <RiUser6Line size={20} />
    },
    {
      text: t('sideManage'),
      path: '/management',
      icon: <RiListSettingsLine size={20} />
    },
    {
      text: t('sideRepair'),
      path: '/repair',
      icon: <RiFileSettingsLine size={20} />
    },
    {
      text: t('sideWarranty'),
      path: '/warranty',
      icon: <RiShieldCheckLine size={20} />
    },
    {
      text: t('sideSetting'),
      path: '/settings',
      icon: <RiSettings3Line size={20} />
    }
  ]
}

export { menuDataArraySmtrack }
