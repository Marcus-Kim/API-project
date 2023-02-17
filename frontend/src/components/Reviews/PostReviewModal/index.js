import './PostReviewModal.css'
function PostReviewModal() {
  return (
    <div className="post-review-modal-container">
      <h2 className="post-review-header">How was your stay?</h2>
      <form className="post-review-form-wrapper">
        <textarea className="post-review-text-area" placeholder="Leave your review here...">

        </textarea>
      </form>
    </div>
  )
}

export default PostReviewModal;
