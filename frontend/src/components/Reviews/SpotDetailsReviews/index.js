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
  const userId = useSelector(state => state.session.user.id)

  useEffect(() => {
    if (spotId) {
      dispatch(thunkLoadSpotReviews(spotId))
    }
  }, [dispatch])

  if (!reviews) return null;
  if (!spot) return null;
  if (!spotId) return null;

  let rating = spot.avgStarRating;

  const sortedReviews = reviews.reverse()

  return (
    <div className="spot-details-reviews-container">
      <div className="spot-details-reviews-header-container">
        <div className="spot-details-reviews-rating-count"><i className="fa-solid fa-star"></i> {!spot.numReviews ? `New` : `${parseFloat(spot.avgStarRating).toFixed(1)} • ${spot.numReviews} ${(spot.numReviews === 1 ? "Review" : "Reviews")}`} </div>
        <div className="post-review-button-container">
          <OpenModalButton className="post-review-button" modalComponent={<PostReviewModal spotId={spot.id} />} buttonText="Post Your Review" />
        </div>
      </div>
      {reviews.length === 0 ? <div>Be the first to post a review!</div> : sortedReviews.map(review => (
        <div key={review.review} className="spot-details-reviews-list-wrapper">
          <div className="spot-details-reviews-firstName">{review.User && review.User.firstName}</div>
          <div className="spot-details-reviews-date">{review.updatedAt.slice(0, 10)}</div>
          <div className="spot-details-reviews-text">{review.review}</div>
          <div className="spot-details-reviews-delete-button">
            {userId == review.userId && <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId}/>} buttonText="Delete" />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SpotDetailsReviews;
