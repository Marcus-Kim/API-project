import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadSpots } from "../../store/spots";

function LandingPage() {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.allSpots);

  useEffect(e => {
    dispatch(thunkLoadSpots());
  }, [dispatch])

  return (
    <div>
      <h1>All Spots</h1>
      {spots.Spots.map(spot => <div className="spot-card">{spot.previewImage}</div>)}
    </div>
  )
}

export default LandingPage;
