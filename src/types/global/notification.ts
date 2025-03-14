type NotificationType = {
  createAt: string
  detail: string
  id: string
  message: string
  serial: string
  status: boolean
  updateAt: string
  mcuId: string
  device: {
    hospital: string
    name: string
    ward: string
  }
  createdAt: string
}

type NotificationHistoryType = {
  _time: string
  message: string
}

export type { NotificationType, NotificationHistoryType }
