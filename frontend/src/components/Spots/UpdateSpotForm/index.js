import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkSingleSpot, thunkUpdateSpot } from "../../../store/spots";

function UpdateSpotForm() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory()

  const spot = useSelector(state => state.spots.singleSpot) //* SPOT

  useEffect(() => {
    dispatch(thunkSingleSpot(spotId))

  }, [dispatch])

  // const spot = useSelector(state => state.spots.allSpots[spotId])

  const [country, setCountry] = useState(spot.country); //? <-- How to get this data to persist?
  const [streetAddress, setStreetAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [latitude, setLatitude] = useState(spot.lat);
  const [longitude, setLongitude] = useState(spot.lng);
  const [description, setDescription] = useState(spot.description);
  const [title, setTitle] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);

  if (!spot) return null;

  const onSubmit = async (e) => {
    e.preventDefault();

    const updatedSpot = {
      address: streetAddress,
      city,
      state,
      country,
      lat: latitude,
      lng: longitude,
      name: title,
      description,
      price
    }

    const didUpdate = await dispatch(thunkUpdateSpot(updatedSpot, spotId));

    if (didUpdate) {
      return history.push(`/spots/${spot.id}`)
    }
  }


  // Set the values of all the inputs to the values of the spot's details
  return (
    <div className="create-spot-form-container">
      <form className="create-spot-form-wrapper" onSubmit={onSubmit}>
        <div className="create-spot-form-title">Update a Spot</div>
        <div className="create-spot-location-wrapper">
          <div className="location-fields-header">
            <div className="location-header">Where's your place located?</div>
            <div className="location-description">Guests will only get your exact address once they booked a reservation</div>
          </div>
          <div className="location-fields-wrapper">
            <div className="location-fields-country">
              <label>Country</label>
              <input
                className="location-field-full"
                type="text"
                placeholder="Country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                />
            </div>
            <div className="location-fields-street-address">
              <label>Street Address</label>
              <input
                className="location-field-full"
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                />
            </div>
            <div className="location-fields-city-state">
              <div className="location-city-field">
                <label>
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  />
              </div>
              <div className="location-state-field">
                <label>
                  State
                </label>
                <input
                  className="location-field-full"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  />
              </div>
            </div>
            <div className="location-fields-latitude-longitude">
              <div className="location-latitude-field">
                <label>
                  Latitude
                </label>
                <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                />
              </div>
              <div className="location-longitude-field">
                <label>
                  Longitude
                </label>
                <input
                className="location-field-full"
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="create-spot-description-wrapper">
          <div className="location-header">Describe your place to guests</div>
          <div className="location-description">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</div>
          <textarea
          className="create-spot-textarea"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="create-spot-title-wrapper">
          <div className="title-header location-header">Create a title for your spot</div>
          <div className="title-description location-description">Catch guests' attention with a spot title that highlights what makes your place special</div>
            <input
            className="location-field-full"
            type="text"
            placeholder="Name of your spot"
            value={title}
            onChange={e => setTitle(e.target.value)}
            />
        </div>
        <div className="create-spot-price-wrapper">
          <div className="create-spot-price-header location-header">Set a base price for your spot</div>
          <div className="location-description">Competitive pricing can help your listing stand out and rank higher in search results</div>
          <div className="price-label-input">
            <label className="price-symbol">$</label>
            <input
            className="price-input"
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button className="create-spot-submit-button">Create Spot</button>
      </form>
    </div>
  )
}

export default UpdateSpotForm;
