import request from 'superagent';

const LOAD = 'realUmls/auth/LOAD';
const LOAD_SUCCESS = 'realUmls/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'realUmls/auth/LOAD_FAIL';
const LOGIN = 'realUmls/auth/LOGIN';
const LOGIN_SUCCESS = 'realUmls/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'realUmls/auth/LOGIN_FAIL';
const RESET_LOGIN_ERROR = 'realUmls/auth/RESET_LOGOUT_ERROR';
const LOGOUT = 'realUmls/auth/LOGOUT';
const LOGOUT_SUCCESS = 'realUmls/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'realUmls/auth/LOGOUT_FAIL';
const REGISTER = 'realUmls/auth/REGISTER';
const REGISTER_SUCCESS = 'realUmls/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'realUmls/auth/REGISTER_FAIL';
const RESET_SIGNUP_ERROR = 'realUmls/auth/RESET_SIGNUP_ERROR';
const SAVE = 'user/SAVE';
const SAVE_SUCCESS = 'user/SAVE_SUCCESS';
const SAVE_FAIL = 'user/SAVE_FAIL';
const SAVE_AVATAR = 'user/avatar/SAVE';
const SAVE_AVATAR_SUCCESS = 'user/avatar/SAVE_SUCCESS';
const SAVE_AVATAR_FAIL = 'user/avatar/SAVE_FAIL';

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
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case RESET_LOGIN_ERROR:
      return {
        ...state,
        loginError: null
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registering: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        user: action.result
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registering: false,
        registerError: action.error
      };
    case RESET_SIGNUP_ERROR:
      return {
        ...state,
        registerError: null
      };
    case SAVE:
      return state;
    case SAVE_SUCCESS: {
      return {
        ...state,
        user: action.result,
        saveError: {message: ''}
      };
    }
    case SAVE_FAIL:
      return {
        ...state,
        saveError: action.error
      };
    case SAVE_AVATAR_SUCCESS: {
      return {
        ...state,
        user: action.result,
        saveError: {message: ''}
      };
    }
    case SAVE_AVATAR_FAIL:
      return {
        ...state,
        saveError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get( '/auth/loadAuth' )
  };
}

export function signup(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: (client) => client.post( '/auth/signup', {
      data
    } )
  };
}

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post( '/auth/login', {
      data: {
        email,
        password
      }
    } )
  };
}

export function isLoginError(globalState) {
  return globalState.auth && globalState.auth.loginError;
}

export function resetLoginError() {
  return {
    type: RESET_LOGIN_ERROR
  };
}

export function isSignupError(globalState) {
  return globalState.auth && globalState.auth.registerError;
}

export function resetSignupError() {
  return {
    type: RESET_SIGNUP_ERROR
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get( '/auth/logout' )
  };
}

export function save(data) {
  const url = `/user/save`;

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post(url, {data})
  };
}

export function saveAvatar(image) {
  return dispatch => {
      const req = request.post('/api/user/upload');

        req.attach(image.name, image);
        req.end((err, res) => {
          console.log('Done', err, res);

          if (err) {
            dispatch({
              type: SAVE_AVATAR_FAIL,
              error: err
            })
          } else {
            dispatch({
              type: SAVE_AVATAR_SUCCESS,
              result: res
            });
          }
        });
  };
}