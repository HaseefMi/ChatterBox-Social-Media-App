import { useState, useEffect, useContext } from 'react';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase-utils';
import { UserContext } from '../../contexts/user-context';
import './comment.css';

function Comment({ postId }) {
  const { userName } = useContext(UserContext);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, 'Comments'), where('postId', '==', postId));
      const querySnapshot = await getDocs(q);
      const commentsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.createdAt instanceof Timestamp) {
          data.createdAt = data.createdAt.toDate().toLocaleString();
        }
        return {
          id: doc.id,
          ...data
        };
      });
      setComments(commentsList);
    };

    fetchComments();
  }, [postId]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const createdAt = new Date();

    try {
      await addDoc(collection(db, 'Comments'), {
        postId,
        userName,
        commentText,
        createdAt,
      });

      setCommentText('');
      const newComment = { postId, userName, commentText, createdAt: createdAt.toLocaleString() };
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Error adding comment: ', error);
      alert('Error adding comment');
    }
  };

  return (
    <div className="comment-container">
      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={handleCommentChange}
          required
        ></textarea>
        <button type="submit">Comment</button>
      </form>
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <p><strong>{comment.userName}</strong>: {comment.commentText}</p>
            <p className="timestamp">{comment.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;