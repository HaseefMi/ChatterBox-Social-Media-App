import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/user-context'; 
import { db } from '../../utils/firebase-utils' 
import { collection, addDoc } from 'firebase/firestore';
import './post.css'

function CreatePost() {
  const { userName } = useContext(UserContext);
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdAt = new Date()

    try {
      await addDoc(collection(db, 'Posts'), {
        userName,
        postText,
        imageUrl,
        createdAt
      });

      setPostText('');
      setImageUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error Creating Post: ', error);
      alert('Error Creating Post | Sorry -_-');
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit}>
        <div className="create-post-header">Create a Post</div>
        <div className='create-post-text'><label htmlFor="postText">Input Post Text</label></div>
        <textarea
          className="create-post-textarea"
          placeholder="What's on Your Mind?"
          onChange={handleTextChange}
          value={postText}
          name="postText"
          required
          rows="5"
          cols="50"
        ></textarea>
        <br />
        <div className="create-post-file-input">
          <label htmlFor="file" className="add-image">Add Image (Optional)</label>
          <br />
          <input onChange={handleFileChange} type="file" name="file" />
        </div>
        {imageUrl && <img src={imageUrl} alt="Preview" className="create-post-image-preview" />}
        <button type='submit' className="create-post-submit-button">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
