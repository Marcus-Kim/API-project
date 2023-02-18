import './PostReviewModal.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkCreateSpotReview } from '../../../store/reviews';
import { useModal } from '../../../context/Modal';

function PostReviewModal({ spotId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const { closeModal } = useModal();

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();

    const reviewPost = {
      review: reviewText,
      stars: rating
    }

    if (spotId) {
      await dispatch(thunkCreateSpotReview(reviewPost, spotId))
        .then(closeModal)
    }

  }


  return (
    <div className="post-review-modal-container">
      <h2 className="post-review-header">How was your stay?</h2>
      <form className="post-review-form-wrapper">
        <textarea
        className="post-review-text-area"
        placeholder="Leave your review here..."
        value={reviewText}
        onChange={e => setReviewText(e.target.value)}
        />
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                id="star-rating-button"
                key={index}
                className={index <= (hover || rating) ? "on" : "off"}
                onClick={(e) => {
                  e.preventDefault()
                  setRating(index)
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
          Stars
        </div>
        <button
        className='post-review-submit-button'
        disabled={reviewText.length > 9 && rating > 0 ? false : true }
        onClick={onSubmit}
        >
        Submit Your Review</button>
      </form>
    </div>
  )
}

export default PostReviewModal;
