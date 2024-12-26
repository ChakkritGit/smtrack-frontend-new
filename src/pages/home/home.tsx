import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/reducers/rootReducer"
import { useEffect } from "react"
import { setSearch } from "../../redux/actions/utilsActions"

const Home = () => {
  const dispatch = useDispatch()
  const { globalSearch } = useSelector((state: RootState) => state.utils)

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  return (
    <div className="p-3">
      Home {globalSearch}
    </div>
  )
}

export default Home