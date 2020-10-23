import React, { useEffect, useState } from 'react';
import './Post.css';
import { db } from './firebase';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
import { FiHeart } from 'react-icons/fi';
import { BsChat } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { FiBookmark } from 'react-icons/fi';

function Post({ postId, user, username, caption, imageUrl }) {
  const [ comments, setComments ] = useState([]);
  const [ comment, setComment ] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [ postId ]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  }

  function focusInput(e) {
    e.preventDefault();
    
    user && (
      document.getElementById('inputComment').focus()
    )
  }

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt='Marcos Vel'
          src='/static/images/avatar/1.jpg'
        />
        <h3>{ username }</h3>
      </div>

      <img className='post__image' src={ imageUrl } alt={ `${ username } imagem` } />

      <div className='div__icons'>
        <div>
          <button className='btnIcons'><FiHeart size={ 24 } /></button>
          <button className='btnIcons' onClick={focusInput}><BsChat size={ 24 } /></button>
          <button className='btnIcons'><FiSend size={ 24 } /></button>
        </div>
        <div>
          <FiBookmark size={ 25 } />
        </div>
      </div>

      <div className='divCaption'>
        <h3 className='post__text'>{ username }</h3>
        <h3 className='caption__text'>{ caption }</h3>
      </div>

      <div>
        { comments.map((comment) => (
          <div className='divCaption'>
            <h3 className='post__text'>{ comment.username }</h3>
            <h3 className='caption__text'>{ comment.text }</h3>
          </div>
        )) }
      </div>

      {user ? (
        <form className='post__commentBox'>
          <input
            id='inputComment'
            className='post__input'
            type='text'
            placeholder='Adicione um comentário...'
            value={ comment }
            onChange={ (e) => setComment(e.target.value) }
          />
          <button
            className='post__button'
            disabled={ !comment }
            type='submit'
            onClick={ postComment }
          >
            Publicar
          </button>
        </form>
      ) : (
          <div className='post__commentBox'>
            <input
              className='post__input'
              type='text'
              disabled="disabled"
              placeholder='Faça Login para comentar...'
            />
            <button
              className='post__buttonDisabled'
              type='submit'
            >
              Publicar
            </button>
          </div>
        ) }

    </div>
  )
}

export default Post;
