import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadCurrentSpots } from "../../../store/spots";
import { NavLink } from "react-router-dom";
import './ManageSpots.css'
import OpenModalButton from "../../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

function ManageSpots() {
  const dispatch = useDispatch();

  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots());
  }, [dispatch])

  if (!spots) return null;

  /*
  TODO - Style Update & Delete buttons to red
  TODO Create spot update page
  TODO Create delete spot modal
  TODO - Make the Spot Name and Price NavLink to the Spot Detail
  */

  return (
    <div className="landing-page-container current-user-landing-page-conatiner">
      <div className="manage-spots-title-wrapper">
        <h1 className="manage-spots-title">Manage Your Spots</h1>
        <NavLink to={'/spots/new'}><button className="manage-spots-create-button">Create a New Spot</button></NavLink>
      </div>
      <div className="all-spots-wrapper">
        {spots.map(spot => {
          return (
            <div className='spot-card-wrapper' key={spot.id}>
              <div className="spot-card">
                <NavLink className="spot-image-wrapper" to={`/spots/${spot.id}`}>
                  <img className="spot-image" src={spot.previewImage} />
                </NavLink>
                <div className="spot-details-wrapper">
                  <NavLink className={"city-state-links"} to={`/spots/${spot.id}`}>

                    <div className="city-state-rating">
                      <span className="city-state">{spot.city}, {spot.state}</span>
                      <span className="rating">{spot.avgRating}</span>
                    </div>
                  </NavLink>
                  <div className="price-update-delete-wrapper">
                    <NavLink className={'price-value'} to={`/spots/${spot.id}`}><div>${Number(parseFloat(spot.price)).toFixed(2)}/night</div></NavLink>
                    <div className="update-delete-wrapper">
                      <NavLink to={`/spots/${spot.id}/edit`}><button>Update</button></NavLink>
                      <OpenModalButton className="manage-spots-delete-button" modalComponent={<DeleteSpotModal spot={spot} />} buttonText="Delete"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ManageSpots;
