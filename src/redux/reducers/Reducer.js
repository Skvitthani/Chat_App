import {SEND_MESSAGE} from '../actiontype/Actiontype';

const INITIAL_STATE = {
  userData: [],
};

const Reducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        userData: [...state?.userData, action?.payload],
      };
    default:
      return state;
  }
};

export default Reducers;
