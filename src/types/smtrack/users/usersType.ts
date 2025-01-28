import { UserRole } from "../../global/users/usersType"

type UsersType = {
  display: string
  id: string
  pic: string
  role: string
  status: boolean
  username: string
  ward: {
    hosId: string
    id: string
    wardName: string
  }
}

type FormState = {
  id?: string
  username: string
  password?: string
  display: string
  role: UserRole | undefined
  status: boolean
  wardId: string
  imageFile: File | null
  imagePreview: string | null
}

export type { UsersType, FormState }
