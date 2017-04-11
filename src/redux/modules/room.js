const LOAD = 'room/LOAD';
const LOAD_SUCCESS = 'room/LOAD_SUCCESS';
const LOAD_FAIL = 'room/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return state;
    case LOAD_SUCCESS: {
      return {
        ...state,
        data: action.result.room,
        permission: action.result.permission,
        loaded: true
      };
    }
    case LOAD_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        loadError: action.error
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.room && globalState.room.loaded;
}

export function load(id, search) {
  const url = `/room/load/${id}${search}`;

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(url)
  };
}

