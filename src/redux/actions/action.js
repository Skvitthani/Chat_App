import {SEND_MESSAGE} from '../Actiontype';

export const MessageData = request => async dispatch => {
  dispatch({type: SEND_MESSAGE, payload: request});
};
