import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import appReducer from "../../action/store";
// import appReducer from "../../action/store";
// import appReducer from ".";
import appReducer from "./index";


export const myStore = createStore(appReducer, {}, applyMiddleware(thunk));

// export const myStore = createStore(Reducers)