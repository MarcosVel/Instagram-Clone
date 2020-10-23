import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';

import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

function ImageUpload({ username }) {
  const [ image, setImage ] = useState(null);
  const [ progress, setProgress ] = useState(0);
  const [ caption, setCaption ] = useState('');

  const handleChange = (e) => {
    if (e.target.files[ 0 ]) {
      setImage(e.target.files[ 0 ]);
    }
    alert('Sua imagem já pode ser publicada, não se esqueça de inserir uma legenda! 😉');
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${ image.name }`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className='imageupload__Box'>
      <div className='imageupload'>
        <div className='imageupload__firstRow'>
          <input
            className='inputCaption'
            type='text'
            placeholder='Adicione uma legenda...'
            onChange={ event => setCaption(event.target.value) }
            value={ caption } />
          {/* <input type='file' onChange={ handleChange } /> */ }
          <input className='textoApagar' id="icon-button-file" type="file" onChange={ handleChange } />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Button onClick={ handleUpload }>
            Postar
          </Button>

        </div>
        <div className='imageupload__secondRow'>
          <progress className='imageupload__progress' value={ progress } max='100' />
        </div>
      </div>
    </div>
  )
}

export default ImageUpload;
