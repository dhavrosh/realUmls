const LOAD = 'chatRooms/LOAD';
const LOAD_SUCCESS = 'chatRooms/LOAD_SUCCESS';
const LOAD_FAIL = 'chatRooms/LOAD_FAIL';
const SAVE = 'chatRooms/SAVE';
const SAVE_SUCCESS = 'chatRooms/SAVE_SUCCESS';
const SAVE_FAIL = 'chatRooms/SAVE_FAIL';

const initialState = {
  loaded: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case SAVE:
      return state;
    case SAVE_SUCCESS:
      const data = [...state.data];

      data.push(action.result);

      return {
        ...state,
        data: data
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.chatRooms && globalState.chatRooms.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/chatRoom/load')
  };
}

export function save(title, description) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/chatRoom/save', {
      data: { title, description }
    })
  };
}
