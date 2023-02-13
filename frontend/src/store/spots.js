// IMPORTS

// ACTIONS
const LOAD_SPOTS = 'spots/loadSpots';
const CREATE_SPOT = 'spots/create';

// ACTION CREATORS
const actionLoadSpots = (spots) => { //* READ
  return {
    type: LOAD_SPOTS,
    spots
  }
}

const actionCreateSpot = (spot) => { //* CREATE
  return {
    type: CREATE_SPOT,
    spot
  }
}

// THUNK ACTION CREATORS
export const thunkLoadSpots = () => async dispatch => { //? Since this is not a Create, Update, or Delete, do I need csrfFetch?
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    console.log('hello')
    dispatch(actionLoadSpots(data))
  }
}

// REDUCER
const initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS: {
      newState = { ...state, allSpots: { ...action.spots } }
      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;
