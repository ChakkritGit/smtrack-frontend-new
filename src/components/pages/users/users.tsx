import { TFunction } from 'i18next'
import { UserRole } from '../../../types/global/users/usersType'

type RoleButtonProps = {
  role: UserRole | undefined
  deviceConnect: string
  handleFilterConnect: (status: string) => void
  t: TFunction
  tmsMode: boolean
}

const RoleButtons = (props: RoleButtonProps) => {
  const { deviceConnect, handleFilterConnect, role, t, tmsMode } = props

  const renderButton = (level: string) => {
    return (
      <button
        key={level}
        className={`flex items-center justify-center btn w-max h-[36px] min-h-0 p-2 font-normal ${
          deviceConnect === level
            ? 'btn-primary text-white'
            : 'btn-ghost border border-gray-500/50 text-gray-500'
        }`}
        onClick={() => handleFilterConnect(level)}
      >
        <span>
          {t(`level${level.charAt(0).toUpperCase() + level.slice(1)}`)}
        </span>
      </button>
    )
  }

  return (
    <div className='flex items-center justify-start flex-wrap gap-3 mt-5'>
      {/* LEGACY_ADMIN เห็นแค่ LEGACY_ADMIN และ LEGACY_USER */}
      {role === UserRole.LEGACY_ADMIN ? (
        <>
          {renderButton(UserRole.LEGACY_ADMIN)}
          {renderButton(UserRole.LEGACY_USER)}
        </>
      ) : (
        !tmsMode && (
          <>
            {/* SUPER เห็นทุก Role */}
            {role === UserRole.SUPER && (
              <>
                {renderButton(UserRole.SUPER)}
                {renderButton(UserRole.SERVICE)}
                {renderButton(UserRole.ADMIN)}
                {renderButton(UserRole.USER)}
                {renderButton(UserRole.LEGACY_ADMIN)}
                {renderButton(UserRole.LEGACY_USER)}
                {renderButton(UserRole.GUEST)}
              </>
            )}

            {/* SERVICE เห็น SERVICE ลงไปทั้งหมด (แต่ไม่เห็น GUEST) */}
            {role === UserRole.SERVICE && (
              <>
                {renderButton(UserRole.SERVICE)}
                {renderButton(UserRole.ADMIN)}
                {renderButton(UserRole.USER)}
                {renderButton(UserRole.LEGACY_ADMIN)}
                {renderButton(UserRole.LEGACY_USER)}
              </>
            )}

            {/* ADMIN เห็น ADMIN ลงไปทั้งหมด (แต่ไม่เห็น LEGACY_ADMIN, LEGACY_USER, GUEST) */}
            {role === UserRole.ADMIN && (
              <>
                {renderButton(UserRole.ADMIN)}
                {renderButton(UserRole.USER)}
              </>
            )}

            {/* USER เห็นแค่ USER */}
            {role === UserRole.USER && <>{renderButton(UserRole.USER)}</>}
          </>
        )
      )}
    </div>
  )
}

export default RoleButtons
