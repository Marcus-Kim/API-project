import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadCurrentSpots } from "../../../store/spots";
import { NavLink, Route, Switch, useHistory } from "react-router-dom";
import './ManageSpots.css'
import UpdateSpotForm from "../UpdateSpotForm";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();

  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots());
  }, [dispatch])

  if (!spots) return null;

  const updateSpotRedirect = () => {
    return history.push('') //TODO Create update spot page
  }

  const deleteSpotRedirect = () => {
    return history.push('') //TODO Create delete spot modal
  }

  /*
  TODO - Style Update & Delete buttons to red
  TODO Create spot update page
  TODO Create delete spot modal
  TODO - Make the Spot Name and Price NavLink to the Spot Detail
  */

  return (
    <div className="landing-page-container">
      <div className="manage-spots-title-wrapper">
        <h1 className="manage-spots-title">Manage Your Spots</h1>
        <button className="manage-spots-create-button">Create a New Spot</button>
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
                  <div className="city-state-rating">
                    <span className="city-state">{spot.city}, {spot.state}</span>
                    <span className="rating">{spot.avgRating}</span>
                  </div>
                  <div className="price-update-delete-wrapper">
                    <div>${spot.price}/night</div>
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
