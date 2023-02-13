import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { thunkSingleSpot } from "../../../store/spots";


function SpotDetails() {
  const {spotId} = useParams();
  console.log(spotId)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkSingleSpot(spotId))
  }, [dispatch])

  return (
    <>
        <h1>Hello from Spot Details</h1>
    </>
  )
}

export default SpotDetails;
