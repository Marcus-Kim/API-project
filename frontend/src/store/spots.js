// IMPORTS
import { csrfFetch } from './csrf';

// ACTIONS
const LOAD_SPOTS = 'spots/loadSpots';
const CREATE_SPOT = 'spots/create';
const SINGLE_SPOT = 'spots/singleSpot';
const LOAD_CURRENT_SPOTS = 'spots/loadCurrentSpots';
const UPDATE_SPOT = 'spot/update'
const DELETE_SPOT = 'spot/delete';

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

const actionSingleSpot = (spot) => { //* READ ONE
  return {
    type: SINGLE_SPOT,
    spot
  }
}

const actionCurrentSpots = (spots) => { //* READ CURRENT USER SPOTS
  return {
    type: LOAD_CURRENT_SPOTS,
    spots
  }
}

const actionUpdateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot
  }
}

const actionDeleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
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
    dispatch(actionSingleSpot(data));

    return data;
  }
}

export const thunkCreateSpot = (spot, previewImageURL) => async dispatch => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  })

  if (response.ok) {
    const data = await response.json();
    const newSpotImage = {
      url: previewImageURL,
      preview: true
    }
    const response2 = await csrfFetch(`/api/spots/${data.id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newSpotImage)
    })
    if (response2.ok) {
      // const data2 = await response2.json();
      // data.previewImage = data2.url
      dispatch(actionCreateSpot(data))
      return data;
    }

  }
}

export const thunkUpdateSpot = (updatedSpot, spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(updatedSpot)
  })

  if (response.ok) {
    const data = await response.json();
    dispatch(actionUpdateSpot(data))
    return data;
  }
}

export const thunkLoadCurrentSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots/current');

  if (response.ok) {
    const data = await response.json()
    dispatch(actionCurrentSpots(data))
    return data;
  }
}

export const thunkDeleteSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(actionDeleteSpot(spotId));
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
    case CREATE_SPOT: {
      const newState = { ...state };
      newState.allSpots = { ...state.allSpots, [action.spot.id]: action.spot }
      return newState;
    }
    case LOAD_CURRENT_SPOTS: {
      const newState = { ...state };
      newState.allSpots = normalize(action.spots);
      return newState;
    }
    case UPDATE_SPOT: {
      const newState = { ...state };
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.spotId];
      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;
