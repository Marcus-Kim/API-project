import { useModal } from '../../../context/Modal';

import './DeleteSpotModal.css'
function DeleteSpotModal() {
  return (
    <div className="delete-spot-modal-container">
      <h1 className='delete-spot-modal-header'>Confirm Delete</h1>
      <div className="delete-spot-modal-header-message">Are you sure you want to remove this spot from the listings?</div>
      <button className='delete-spot-modal-buttons delete-yes'>Yes (Delete Spot)</button>
      <button className='delete-spot-modal-buttons delete-no'>No (Keep Spot)</button>
    </div>
  )
}

export default DeleteSpotModal;
