import { combineReducers } from "redux";
import Reducers from '../reducers/Reducer'


const appReducer = combineReducers({
  user: Reducers,
});

export default appReducer;
