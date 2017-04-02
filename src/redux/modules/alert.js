const SHOW = 'alert/SHOW';
const SET = 'alert/SET';

const initialState = {
  title: '',
  size: '',
  accept: () => {},
  showModal: false,
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        showModal: action.payload
      };
    case SET:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

function showAlert(isVisible) {
  return {
    type: SHOW,
    payload: isVisible
  };
}

function setAlert(alert) {
  return {
    type: SET,
    payload: alert
  };
}

export function show(alert) {
  return (dispatch) => {
    dispatch(setAlert(alert));
    dispatch(showAlert(true));
  };
}

export function close() {
  return (dispatch) => {
    dispatch(showAlert(false));
  };
}

