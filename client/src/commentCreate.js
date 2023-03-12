import React, { useState } from 'react';
import Axios from 'axios';
    
// eslint-disable-next-line
const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async event => {
    event.preventDefault();

    await Axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content
    });
    setContent('')
  };

  return (
  <div>
    <form onSubmit={onSubmit}>
        <div className='form-group'>
            <label> New Comment </label>
            <input 
             value={content}
             onChange={e => setContent(e.target.value)}
             className='form-control' 
            />  
        </div>
        <button className='btn btn-primary'> Submit </button>
    </form>
  </div>
  );
};

export default CommentCreate;