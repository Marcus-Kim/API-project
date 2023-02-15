import './CreateSpotForm.css'
function CreateSpotForm() {

  return (
    <div className="create-spot-form-container">
      <form className="create-spot-form-wrapper">
        <div className="create-spot-form-title">Create a new Spot</div>
        <div className="create-spot-location-wrapper">
          <div className="location-fields-header">
            <div className="location-header">Where's your place located?</div>
            <div className="location-description">Guests will only get your exact address once they booked a reservation</div>
          </div>
          <div className="location-fields-wrapper">
            <div className="location-fields-country">
              <label>Country</label>
              <input className="location-field-full" type="text" placeholder="Country"/>
            </div>
            <div className="location-fields-street-address">
              <label>Street Address</label>
              <input className="location-field-full" type="text" placeholder="Street Address"/>
            </div>
            <div className="location-fields-city-state">
              <div className="location-city-field">
                <label>
                  City
                </label>
                <input type="text" placeholder="City"/>
              </div>
              <div className="location-state-field">
                <label>
                  State
                </label>
                <input className="location-field-full" type="text" placeholder="State"/>
              </div>
            </div>
            <div className="location-fields-latitude-longitude">
              <div className="location-latitude-field">
                <label>
                  Latitude
                </label>
                <input type="number" placeholder="Latitude"/>
              </div>
              <div className="location-longitude-field">
                <label>
                  Longitude
                </label>
                <input className="location-field-full" type="number" placeholder="Longitude"/>
              </div>
            </div>
          </div>
        </div>
        <div className="create-spot-description-wrapper">
          <div className="location-header">Describe your place to guests</div>
          <div className="location-description">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</div>
          <textarea className="create-spot-textarea" placeholder="Description" />
        </div>
      </form>
    </div>
  )
}

export default CreateSpotForm;
