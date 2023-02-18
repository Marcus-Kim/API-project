import { csrfFetch } from "./csrf";
import { thunkSingleSpot } from "./spots";

// ACTIONS
const LOAD_SPOT_REVIEWS = 'reviews/spot/load';
const LOAD_USER_REVIEWS = 'reviews/user/load';
const DELETE_SPOT_REVIEW = 'reviews/spot/delete';
const CREATE_SPOT_REVIEW = 'reviews/spot/create';
// ACTION CREATORS
const actionLoadSpotReviews = (reviews) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    reviews
  }
}

const actionDeleteSpotReview = (reviewId) => {
  return {
    type: DELETE_SPOT_REVIEW,
    reviewId
  }
}

const actionCreateSpotReview = (review) => {
  return {
    type: CREATE_SPOT_REVIEW,
    review
  }
}

// THUNK ACTION CREATORS //* GETTING ALL SPOT REVIEWS
export const thunkLoadSpotReviews = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadSpotReviews(data));
    return data;
  }
}

export const thunkDeleteSpotReview = (reviewId) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(actionDeleteSpotReview(reviewId));
    return data;
  }
}

export const thunkCreateSpotReview = (review, spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data)
    dispatch(actionCreateSpotReview(data))
    dispatch(thunkSingleSpot(spotId))
  }
}

// NORMALIZE FUNCTION
const normalize = (reviews) => {
  const normalized = {};

  if (reviews.Reviews) {
    reviews.Reviews.forEach(review => normalized[review.id] = review);
    return normalized;
  }
}

// INITIAL STATE
const initialState = { spot: {}, user: {} }

// REDUCER
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const newState = { ...state };

      newState.spot = normalize(action.reviews);
      return newState;
    }
    case DELETE_SPOT_REVIEW: {
      const newState = { ...state };
      delete newState.spot[action.reviewId];
      return newState;
    }
    case CREATE_SPOT_REVIEW: {
      const newState = { ...state };
      newState.spot[action.review.id] = action.review
    }
    default: {
      return state
    }
  }
}

export default reviewsReducer;
