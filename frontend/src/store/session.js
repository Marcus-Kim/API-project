import { csrfFetch } from './csrf';

// ACTIONS
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
// ACTION CREATORS
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// THUNK ACTION CREATORS

//* LOGIN
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};
// REDUCER
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);// <-- Object.assign() same as {...state}?
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null; // * Only 1 user, so we can set entire slice to null
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;