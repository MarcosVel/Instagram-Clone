import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${ top }%`,
    left: `${ left }%`,
    transform: `translate(-${ top }%, -${ left }%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[ 5 ],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [ modalStyle ] = useState(getModalStyle);
  const [ openSignIn, setOpenSignIn ] = useState(false);

  const [ posts, setPosts ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // console.log(authUser);
        setUser(authUser);            //keeps log in
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [ user, username ]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  function refresh() {
    window.location.reload();
  }

  return (
    <div className="app">
      <Modal
        open={ open }
        onClose={ () => setOpen(false) }
      >
        <div style={ modalStyle } id='editModalResgistrar' className={ classes.paper }>
          <form className='app__signup'>
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder='username'
              type='text'
              value={ username }
              onChange={ (e) => setUsername(e.target.value) }
            />
            <Input
              placeholder='e-mail'
              type='email'
              value={ email }
              onChange={ (e) => setEmail(e.target.value) }
            />
            <Input
              placeholder='senha'
              type='password'
              value={ password }
              onChange={ (e) => setPassword(e.target.value) }
            />
            <Button type='submit' onClick={ signUp }>Registrar</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={ openSignIn }
        onClose={ () => setOpenSignIn(false) }
      >
        <div style={ modalStyle } id='editModalLogin' className={ classes.paper }>
          <form className='app__signup'>
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder='e-mail'
              type='email'
              value={ email }
              onChange={ (e) => setEmail(e.target.value) }
            />
            <Input
              placeholder='senha'
              type='password'
              value={ password }
              onChange={ (e) => setPassword(e.target.value) }
            />
            <Button type='submit' onClick={ signIn }>Entrar</Button>
          </form>
        </div>
      </Modal>

      <header>
        <div className='app__header'>
          <a href='##' onClick={ refresh }>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </a>
          { user ? (
            <Button onClick={ () => auth.signOut() }><MeetingRoomIcon />Sair</Button>
          ) : (
              <div className='app__loginContainer'>
                <Button onClick={ () => setOpenSignIn(true) }>Login</Button>
                <Button onClick={ () => setOpen(true) }>Registrar</Button>
              </div>
            ) }
        </div>
      </header>

      <div className='app__posts'>
        { user ? (
          <ImageUpload username={ user.displayName } />
        ) : (
            <div className='boxNeedLogin'>
              <h3>Registre-se e faça Login para poder postar</h3>
            </div>
          ) }
      </div>

      <div className='app__posts'>
        <div className='app__eachPosts'>
          {
            posts.map(({ id, post }) => (
              <Post
                key={ id }
                postId={ id }
                user={ user }
                username={ post.username }
                caption={ post.caption }
                imageUrl={ post.imageUrl }
              />
            ))
          }
        </div>
      </div>

      <footer className='infoFooter'>
        <p>© Desenvolvido por <a href='https://www.linkedin.com/in/marcosveloso99/' target='_blank' rel="noopener noreferrer">Marcos Veloso</a> - 2020 - versão 1.00</p>
      </footer>

    </div>
  );
}

export default App;
