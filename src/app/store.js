import { configureStore } from '@reduxjs/toolkit'
import tabViewsReducer from '../features/tabViews/tabViews'
import trainScheduleReducer from '../features/trainSchedule/trainSchedule'
import platformInfoReducer from '../features/platformInfo/platformInfo'
import simulationControlReducer from '../features/simulationControl/simulationControl'

export default configureStore({
  reducer: {
    tabViews: tabViewsReducer,
    trainSchedule : trainScheduleReducer,
    platformInfo : platformInfoReducer,
    simulationControl : simulationControlReducer
  }
})