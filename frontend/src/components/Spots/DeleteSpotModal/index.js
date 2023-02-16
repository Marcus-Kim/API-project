import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { thunkDeleteSpot } from '../../../store/spots';
import './DeleteSpotModal.css'

function DeleteSpotModal({ spot }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch()

  const handleDelete = async () => {

    await dispatch(thunkDeleteSpot(spot.id))
      .then(closeModal())

  }

  return (
    <div className="delete-spot-modal-container">
      <h1 className='delete-spot-modal-header'>Confirm Delete</h1>
      <div className="delete-spot-modal-header-message">Are you sure you want to remove this spot from the listings?</div>
      <button className='delete-spot-modal-buttons delete-yes' onClick={handleDelete}>Yes (Delete Spot)</button>
      <button className='delete-spot-modal-buttons delete-no' onClick={closeModal}>No (Keep Spot)</button>
    </div>
  )
}

export default DeleteSpotModal;
