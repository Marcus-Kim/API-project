import { csrfFetch } from "./csrf";

// ACTIONS
const LOAD_SPOT_REVIEWS = 'reviews/spot/load';
const LOAD_USER_REVIEWS = 'reviews/user/load';
const DELETE_SPOT_REVIEW = 'reviews/spot/delete';

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
    default: {
      return state
    }
  }
}

export default reviewsReducer;
