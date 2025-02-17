import { TFunction } from 'i18next'
import {
  RiDashboardLine,
  RiFileSettingsLine,
  RiHome3Line,
  RiListSettingsLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiUser6Line
} from 'react-icons/ri'

const menuDataArraySmtrack = (t: TFunction) => {
  return [
    {
      text: t('sideShowAllBox'),
      path: '/',
      tag: 'Show all Devices, แสดงกล่องทั้งหมด',
      icon: <RiHome3Line size={20} />
    },
    {
      text: t('sideDashboard'),
      path: '/dashboard',
      tag: 'Dashboard, แดชบอร์ด',
      icon: <RiDashboardLine size={20} />
    },
    {
      text: t('sidePermission'),
      path: '/permission',
      tag: 'Manage Users, จัดการผู้ใช้',
      icon: <RiUser6Line size={20} />
    },
    {
      text: t('sideManage'),
      path: '/management',
      tag: 'Manage, จัดการ',
      icon: <RiListSettingsLine size={20} />
    },
    {
      text: t('sideRepair'),
      path: '/repair',
      tag: 'Repairs, แจ้งซ่อม',
      icon: <RiFileSettingsLine size={20} />
    },
    {
      text: t('sideWarranty'),
      path: '/warranty',
      tag: 'Warranties, การรับประกัน',
      icon: <RiShieldCheckLine size={20} />
    },
    {
      text: t('sideSetting'),
      path: '/settings',
      tag: 'Settings, การตั้งค่า',
      icon: <RiSettings3Line size={20} />
    }
  ]
}

export { menuDataArraySmtrack }
