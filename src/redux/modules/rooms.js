const LOAD = 'rooms/LOAD';
const LOAD_SUCCESS = 'rooms/LOAD_SUCCESS';
const LOAD_FAIL = 'rooms/LOAD_FAIL';
const SAVE = 'rooms/SAVE';
const SAVE_SUCCESS = 'rooms/SAVE_SUCCESS';
const SAVE_FAIL = 'rooms/SAVE_FAIL';
const REMOVE = 'rooms/REMOVE';
const REMOVE_SUCCESS = 'rooms/REMOVE_SUCCESS';
const REMOVE_FAIL = 'rooms/REMOVE_FAIL';

const initialState = {
  loaded: false
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
    case SAVE_SUCCESS: {
      const data = [...state.data];
      const index = data.findIndex(chatRoom => chatRoom._id === action.result._id);

      if (index > -1) {
        data[index] = action.result;
      } else {
        data.push(action.result);
      }

      return { ...state, data: data };
    }
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
    case REMOVE:
      return state;
    case REMOVE_SUCCESS: {
      const data = [...state.data];
      const newData = data.filter(
        chatRoom => chatRoom._id !== action.result._id
      );

      return { ...state, data: newData };
    }
    case REMOVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        removeError: action.error
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.rooms && globalState.rooms.loaded;
}

export function loadOwn() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/room/loadOwn')
  };
}

export function save(title, description, members, id) {
  const url = id ? `/room/save/${id}` : '/room/save';

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post(url, {
      data: { title, description, members }
    })
  };
}

export function remove(id) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) => client.get(`/room/remove/${id}`)
  };
}

