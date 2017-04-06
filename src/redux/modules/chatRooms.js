const LOAD = 'chatRooms/LOAD';
const LOAD_SUCCESS = 'chatRooms/LOAD_SUCCESS';
const LOAD_FAIL = 'chatRooms/LOAD_FAIL';
const SAVE = 'chatRooms/SAVE';
const SAVE_SUCCESS = 'chatRooms/SAVE_SUCCESS';
const SAVE_FAIL = 'chatRooms/SAVE_FAIL';
const REMOVE = 'chatRooms/REMOVE';
const REMOVE_SUCCESS = 'chatRooms/REMOVE_SUCCESS';
const REMOVE_FAIL = 'chatRooms/REMOVE_FAIL';
const EDIT_START = 'chatRooms/EDIT_START';
const EDIT_STOP = 'chatRooms/EDIT_STOP';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
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
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
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

export function save(title, description, members, id) {
  const url = id
    ? `/chatRoom/save/${id}` : '/chatRoom/save';

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
    promise: (client) => client.get(`/chatRoom/remove/${id}`)
  };
}

// TODO: use for members form
export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
