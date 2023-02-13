// IMPORTS

// ACTIONS
const LOAD_SPOTS = 'spots/loadSpots';
const CREATE_SPOT = 'spots/create';
const SINGLE_SPOT = 'spots/singleSpot';

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

const actionSingleSpot = (spot) => {
  return {
    type: SINGLE_SPOT,
    spot
  }
}

// THUNK ACTION CREATORS
export const thunkLoadSpots = () => async dispatch => { //? Since this is not a Create, Update, or Delete, do I need csrfFetch?
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadSpots(data))
  }
}

export const thunkSingleSpot = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}`)

  if (response.ok) {
    const data = await response.json();
    console.log(data)
    dispatch(actionSingleSpot(data));
    return data;
  }
}

// NORMALIZE FUNCTION
const normalize = (spots) => {
  const normalized = {};

  if (spots.Spots) {
    spots.Spots.forEach(spot => normalized[spot.id] = spot);
    return normalized;
  }
}

// REDUCER
const initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state }
      newState.allSpots = normalize(action.spots);
      return newState;
    }
    case SINGLE_SPOT: {
      const newState = { ...state };
      newState.singleSpot = { ...action.spot };
      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;
