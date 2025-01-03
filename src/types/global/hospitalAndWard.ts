interface Hospital {
  id: string
  hosName: string
}

interface Ward {
  id: string
  wardName: string
}

type Option = {
  value: string
  label: string
}

export type { Hospital, Ward, Option }
