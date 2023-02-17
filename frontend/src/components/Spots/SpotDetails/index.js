import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { thunkSingleSpot } from "../../../store/spots";
import './SpotDetails.css'
import SpotDetailsReviews from "../../Reviews/SpotDetailsReviews";

function SpotDetails() {
  const {spotId} = useParams();

  const spot = useSelector(state => state.spots.singleSpot)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkSingleSpot(spotId))

  }, [dispatch, spotId])

  if (!spot) return null;
  if (!spotId) return null;

  const spotImages = spot.spotImages

  return (
    <>
      <div className="spot-details-container">
        <div className="details-wrapper">
          <div className="details-header-wrapper">
            <div className="spot-name">{spot.name}</div>
            <div className="city-state-country">{spot.city}, {spot.state}, {spot.country}</div>
          </div>
          <div className="details-images-wrapper">
            <div className="half-image">
              <img id="half-image" src={spotImages && spotImages[0].url} />
            </div>
            <div className="quarter-images">
              {/* OTHER 4 IMAGES GO HERE IN ANOTHER DIV */}
            </div>
          </div>
          <div className="description-price-wrapper">
            <div className="description-wrapper">
              <div className="description-title">DESCRIPTION TITLE</div>
              <div className="description-text">DESCRIPTION TEXT</div>
            </div>
            <div className="price-button-wrapper">
              <div className="price-reviews-text">
                <div className="price-text"><span className="price-text-price">{`$${spot.price}`}</span>night</div>
                <div className="reviews-text"><i className="fa-solid fa-star"></i> {spot.avgStarRating} - {spot.numReviews} reviews</div>
              </div>
              <div className="reserve-button">
                <button className="button">RESERVE</button>
              </div>
            </div>
          </div>
        </div>
        <div className="reviews-wrapper">
          <SpotDetailsReviews spotId={spotId} />
        </div>
      </div>
    </>
  )
}

export default SpotDetails;
