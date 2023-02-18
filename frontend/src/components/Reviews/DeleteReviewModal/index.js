import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteSpotReview, thunkLoadSpotReviews } from "../../../store/reviews";
import { thunkSingleSpot } from "../../../store/spots";

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  if (!reviewId) return null;

  const handleDelete = async () => {
    await dispatch(thunkDeleteSpotReview(reviewId))
    await dispatch(thunkLoadSpotReviews(spotId))
    await dispatch(thunkSingleSpot(spotId))
      .then(closeModal())
  }

  return (
    <div className="delete-spot-modal-container">
      <h1 className='delete-spot-modal-header'>Confirm Delete</h1>
      <div className="delete-spot-modal-header-message">Are you sure you want to remove this review from the listings?</div>
      <button className='delete-spot-modal-buttons delete-yes' onClick={handleDelete}>Yes (Delete Review)</button>
      <button className='delete-spot-modal-buttons delete-no' onClick={closeModal}>No (Keep Review)</button>
    </div>
  )
}

export default DeleteReviewModal;
