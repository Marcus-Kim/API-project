import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadSpots } from "../../store/spots";
import './LandingPage.css'

function LandingPage() {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.allSpots.Spots);

  useEffect(e => {
    dispatch(thunkLoadSpots());
  }, [dispatch])

  if (!spots) return null;


  return (
    <div>
      <h1>All Spots</h1>
      <div className="all-spots-wrapper">
        {spots.map(spot => {
          return (
            <div key={spot.name} className="spot-card">
              <div className="spot-image-wrapper">{spot.previewImage}</div>
              <div className="spot-details-wrapper">
                <div className="city-state-rating">
                  <span className="city-state">{spot.city}, {spot.state}</span>
                  <span className="rating">{spot.avgRating}</span>
                </div>
                <div className="price">{spot.price}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LandingPage;
