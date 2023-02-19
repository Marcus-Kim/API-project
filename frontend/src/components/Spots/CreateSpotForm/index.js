import './CreateSpotForm.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkCreateSpot } from '../../../store/spots';
import { useHistory } from 'react-router-dom';

function CreateSpotForm() {
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImageURL, setPreviewImageURL] = useState("");
  const [imageURL2, setImageURL2] = useState("");
  const [imageURL3, setImageURL3] = useState("");
  const [imageURL4, setImageURL4] = useState("");
  const [imageURL5, setImageURL5] = useState("");
  const [validationErrors, setvalidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const history = useHistory()
  const dispatch = useDispatch();

  // Create an onSubmit function
  const onSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true)

    if (validationErrors.length) return alert('Cannot Submit');

    const spot = {
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

    const newSpot = await dispatch(thunkCreateSpot(spot, previewImageURL))

    if (newSpot) {
      history.push(`/spots/${newSpot.id}`)
    }
  }

  // Create validation error handler
  useEffect(() => {

    const errors = [];

    if (country.length < 1) errors.push("Country is required")
    if (streetAddress.length < 1) errors.push("Address is required")
    if (city.length < 1) errors.push("City is required")
    if (state.length < 1) errors.push("State is required")
    if (latitude.length < 1) errors.push("Latitude is required")
    if (longitude.length < 1) errors.push("Longitude is required")
    if (description.length < 30) errors.push("Description needs a minimum of 30 characters")
    if (title.length < 1) errors.push("Title is required")
    if (price.length < 1) errors.push("Price is required")
    if (previewImageURL.length < 1) errors.push("Preview image is required")
    if (!(previewImageURL.endsWith('jpg') || previewImageURL.endsWith('png') || previewImageURL.endsWith('jpeg'))) errors.push("Image URL must end in .png, .jpg, or .jpeg")

    setvalidationErrors(errors)
  }, [country, streetAddress, city, state, latitude, longitude, description, title, price, previewImageURL])

  return (
    <div className="create-spot-form-container">
      <form className="create-spot-form-wrapper" onSubmit={onSubmit}>
        <div className="create-spot-form-title">Create a new Spot</div>
        {hasSubmitted && !!validationErrors.length && (
          <div>
            The following errors were found:
            <ul>
              {validationErrors.map((error) => (
                <li className='create-spot-form-validation-error' key={error}>-{error}</li>
              ))}
            </ul>
          </div>
        )}
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
        <div className="create-spot-photos-wrapper">
          <div className="create-spot-photos-header location-header">Liven up your spot with photos</div>
          <div className="location-description">Submit a link to at least one photo to publish your spot</div>
          <div className="create-spot-photos-links">
            <input
            className="location-field-full"
            type="text"
            placeholder="Preview Image URL (Only this one works right now)"
            value={previewImageURL}
            onChange={e => setPreviewImageURL(e.target.value)}
            />
            <input className="location-field-full" type="text" placeholder="Image URL"/>
            <input className="location-field-full" type="text" placeholder="Image URL"/>
            <input className="location-field-full" type="text" placeholder="Image URL"/>
            <input className="location-field-full" type="text" placeholder="Image URL"/>
          </div>
        </div>
        <button className="create-spot-submit-button">Create Spot</button>
      </form>
    </div>
  )
}

export default CreateSpotForm;
