import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadSpots } from "../../store/spots";
import './LandingPage.css'
import { NavLink } from 'react-router-dom';

function LandingPage() {
  const dispatch = useDispatch();

  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(e => {
    dispatch(thunkLoadSpots());
  }, [dispatch])

  if (!spots) return null;


  return (
    <div className="landing-page-container">
      <div className="all-spots-wrapper">
        {spots.map(spot => {
          return (
            <NavLink className='spot-card-wrapper' key={spot.id} to={`/spots/${spot.id}`}>
              <div className="spot-card">
                <div className="spot-image-wrapper">
                  <img className="spot-image" src={spot.previewImage} />
                </div>
                <div className="spot-details-wrapper">
                  <div className="city-state-rating">
                    <span className="city-state">{spot.name}</span>
                    <span className="rating"><i className="fa-solid fa-star"></i> {spot.avgRating === 'No ratings yet' ? "New" : parseFloat(spot.avgRating).toFixed(1)}</span>
                  </div>
                  <div className="price">${Number.parseFloat(spot.price.toFixed(2))}night</div>
                </div>
              </div>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default LandingPage;
