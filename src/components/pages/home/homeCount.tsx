import { RiThermometerLine } from "react-icons/ri"
import { DeviceCountPropType } from "../../../types/smtrack/devices/deviceCount"

const HomeCount = (props: DeviceCountPropType) => {
  const { deviceCount, countFilter, setCountFilter } = props

  const card = [
    { name: 'Temperature', count: deviceCount?.temp, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'Door', count: deviceCount?.door, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'Internet', count: deviceCount?.internet, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'Plug', count: deviceCount?.plug, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'SD Card', count: deviceCount?.sdcard, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'Repairs', count: deviceCount?.repairs, time: 'Times', icon: <RiThermometerLine /> },
    { name: 'Warranties', count: deviceCount?.warranties, time: 'Times', icon: <RiThermometerLine /> }
  ]

  const changFilter = (selected: string) => {
    if ((countFilter === "Temperature"))
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 mt-4 p-4">
      {card.map((card, index) => (
        <div className="card bg-base-100 w-[145px] h-[125px] overflow-hidden shadow-xl hover:scale-105 duration-300 cursor-pointer" key={index} onClick={() => changFilter(card.name)}>
          <div className="card-body justify-between p-3">
            <h5 className="text-[12px]">{card.name}</h5>
            <span className="text-[28px] text-center font-bold">{card.count ?? "—"}</span>
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px]">{card.time}</span>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomeCount