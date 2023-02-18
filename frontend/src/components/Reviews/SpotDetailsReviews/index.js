import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { thunkLoadSpotReviews } from "../../../store/reviews";
import './SpotDetailsReviews.css'
import OpenModalButton from "../../OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal";
import PostReviewModal from "../PostReviewModal";

function SpotDetailsReviews({ spotId }) {
  const dispatch = useDispatch();

  const reviews = useSelector(state => Object.values(state.reviews.spot))
  const spot = useSelector(state => state.spots.singleSpot)
  const session = useSelector(state => console.log(state.session.user.id))

  useEffect(() => {
    if (spotId) {
      dispatch(thunkLoadSpotReviews(spotId))
    }
  }, [dispatch])

  if (!reviews) return null;
  if (!spot) return null;

  let rating = spot.avgStarRating;

  return (
    <div className="spot-details-reviews-container">
      <div className="spot-details-reviews-header-container">
        <div className="spot-details-reviews-rating-count"><i className="fa-solid fa-star"></i> {spot.avgStarRating} - {spot.numReviews} Reviews</div>
        <div className="post-review-button-container">
          <OpenModalButton className="post-review-button" modalComponent={<PostReviewModal spotId={spot.id} />} buttonText="Post Your Review" />
        </div>
      </div>
      {reviews.length === 0 ? <div>Be the first to post a review!</div> : reviews.map(review => (
        <div key={review.review} className="spot-details-reviews-list-wrapper">
          <div className="spot-details-reviews-firstName">{review.User.firstName}</div>
          <div className="spot-details-reviews-date">{review.updatedAt.slice(0, 10)}</div>
          <div className="spot-details-reviews-text">{review.review}</div>
          <div className="spot-details-reviews-delete-button">
            <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} />} buttonText="Delete" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SpotDetailsReviews;
