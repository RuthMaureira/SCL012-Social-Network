// Este es el punto de entrada de tu aplicacion
import {
  signInNew,
  signIn,
  signOff,
  recoverPass,
} from './lib/index.js';

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

// Initialize Firestore
const db = firebase.firestore();
/*---------------------------------------------------------------------------------*/

function init() {
  const root = document.getElementById('root');
  const contact = document.getElementById('contact');

  /* Formulario login */
  function start() {
    window.location.hash = '/login';
    root.innerHTML = `
    <section class="login" id="login">
      <img src="img/logo2.png" alt="logo Finger Food" class="login__logo">
      <h1 class="login__title">Bienvenid@!</h1>
      <form class="login__form">
        <div class="login__container">
          <div class="login__inputMail">
            <i class="fas fa-envelope icon"></i>
            <input type="email" class="login__inputText" id="login__email" placeholder="Correo Electrónico">
          </div>
          <div class='login__inputPassword'>
            <i class='fas fa-key icon'></i>
            <input type="password" class="login__inputPass" id="login__pass" placeholder="Contraseña">
          </div>
          <p class="login__acceptService">Al continuar, aceptas nuestras condiciones del servicio.</p>
          <input type="checkbox" name="remember" id="login__remember" value="remember"> Recuérdame
          <input type="submit" value="Acceder" id="login__accept" class="login__button">
          <p class="login__forget">¿Olvidó su contraseña?<a class="login__linkRecover" id="login__recover" href="#">Recuperar</a></p>
          </div>
      </form>
      <div class="login__divider">
        <hr>
        <span>o</span>
        <hr>
      </div>
      <button type="button" name="btn__google" class="btn__rrss" id="login__googleBtn">
        <img src="img/googleColor.svg" alt="logo Google" class="btn__icon">
      </button>
      <button type="button" name="btn_facebook" class="btn__rrss" id="login__facebookBtn">
        <img src="img/facebook.svg" alt="logo Google" class="btn__icon">
      </button>
      <p class="login__acceptService">Al continuar, aceptas nuestras condiciones del servicio.</p>
      <p class="login__register">¿No tienes una cuenta?<a class="login__linkRegister" id="login__btnRegister" href="#">Regístrate</a></p>
    </section>`;
  }

  start();

  /* Restablecer contraseña */

  const recover = document.getElementById('login__recover');
  const loginEmail = document.getElementById('login__email');

  recover.addEventListener('click', () => {
    if (loginEmail.value === '') {
      alert('Ingrese su email');
    } else {
      recoverPass(loginEmail.value);
      loginEmail.value = '';
    }
  });

  /* Ingreso a home */
  function newPage(displayName, email) {
    window.location.hash = '/home';
    root.innerHTML = `
    <nav class="navi">
    <img src="img/logo2.png" alt="logo" class="logoNav">
    <div class="navigation">
      <ul class="navigation__list">
        <li class="navigation__item"><a href="#divSearch"><i class="fas fa-search icon"></i></a></li>
        <li class="navigation__item"><a href="#" id="plus"><i class="fas fa-plus icon"></i></a></li>
        <li class="navigation__item"><a href="#"><i class="fas fa-user-circle fa-2x icon"></i></a></li>
        <li class="navEmail"> ${email} </li>
        <li class="navigation__item icon"><a id="closeSession" href="#"><i class="far fa-times-circle fa-2x icon"></i></a></li>
      </ul>
    </div>
  </nav>

  <section class="main">

   <h1 class="welcome" id="welcome">Bienvenid@ <span> ${displayName} </span> </h1>
  </section>`;

    contact.innerHTML = `
     <p> Finger Food 2020. Todos los derechos reservados.</p>`;
    
  <footer id="contact" class="contact">
    <p> Finger Food 2020. Todos los derechos reservados.</p>
  </footer>`;
    // funcionalidad boton + (crear post)
    const createPost = document.querySelector('#createPost');
    createPost.addEventListener('click', () => {
      const viewPost = document.querySelector('#wrap');
      viewPost.innerHTML = `<section class="postPage" id="postPage">
      <div id="addPost">
        <input type="text" name="message" id="message" class="message" placeholder="Recomienda lugar"></input>
        <button name="upload" id="upload" class="upload">Carga imagen</button>
        <button name="submit" id="submit" class="submit">Publicar</button>
      </div>
      </section>
    `
    let submitPost = document.querySelector('#submit');
    submitPost.addEventListener('click', () => {
     // const emailIngreso = document.getElementById('login__email').value;
      let publicPost = document.querySelector('#wrap');
      const message = document.querySelector('#message').value;
      let database = firebase.firestore();
      database.collection("posts").add({
        author: displayName,
        message: message,
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        console.log(displayName);
        console.log(message);
        // document.getElementById('message') = '';
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
      let printAuthor = displayName;
      const printMessage = document.querySelector('#message').value;
      publicPost.innerHTML = `<div id="divPost" class="divPost">
      <a href="#" id="editPost" class="editPost"><i class="fas fa-pencil-alt"></i></a>
      <p>${printAuthor}</p>
      <input type="text" id="printMsg" class="printMsg" value="${printMessage}"></input>
      </div>
      `;
     });
     let database = firebase.firestore();
     database.collection("posts").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
      });
  });
    
    });
    
/* Cerrar sesión */
    const closeSession = document.getElementById('closeSession');
    closeSession.addEventListener('click', () => {
      /* cerrar sesión de usuario */
      signOff();
      /* Chequear rememberMe - recargar pagina */
      /* Pasar a página inicial */
      start();
      window.location.reload();
    });
     
  /* Ingreso usuario existente */
  const emailInput = document.getElementById('login__email');
  console.log(emailInput);
  const passInput = document.getElementById('login__pass');
  console.log(passInput);
  const loginBtn = document.getElementById('login__accept');
  console.log(loginBtn);

  /* Guardar usuario y contraseña si chequea login__remember y apreta botón */
  const rememberMe = document.getElementById('login__remember');

  if (localStorage.checkbox && localStorage.checkbox !== '') {
    rememberMe.setAttribute('checked', 'checked');
    emailInput.value = localStorage.username;
    passInput.value = localStorage.pass;
  } else {
    rememberMe.removeAttribute('checked');
    emailInput.value = '';
    passInput.value = '';
  }

  function remember() {
    if (rememberMe.checked && emailInput.value !== '') {
      localStorage.username = emailInput.value;
      localStorage.pass = passInput.value;
      localStorage.checkbox = rememberMe.value;
    } else {
      localStorage.username = '';
      localStorage.pass = '';
      localStorage.checkbox = '';
    }
  }

  loginBtn.addEventListener('click', () => {
    /* Guardar usuario y pass si chequeó recuérdame */
    remember();
    /* Verificar que existe usuario */
    signIn(emailInput.value, passInput.value);
    /* Pasar a página de post */
  });

  function observador() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Existe usuario activo');
        // User is signed in.
        let displayName = user.displayName;
        console.log(displayName);
        let email = user.email;
        console.log(email);
        let emailVerified = user.emailVerified;
        console.log(emailVerified);
        let photoURL = user.photoURL;
        console.log(photoURL);
        let isAnonymous = user.isAnonymous;
        console.log(isAnonymous);
        let uid = user.uid;
        console.log(uid);
        const providerData = user.providerData[0];
        console.log(providerData);
        if (emailVerified || providerData.providerId === 'facebook.com') {
          if (displayName === null) {
            displayName = '';
          }
          newPage(displayName, email);
        } else {
          signOff();
          start();
        }
      } else {
        // User is signed out;
        console.log('no existe usuario activo');
      }
    });
  }

  observador();

  /* Pasar de login a registro si presionan botón Registrar */
  const loginRegister = document.getElementById('login__btnRegister');
  loginRegister.addEventListener('click', () => {
    /* Formulario registro */
    window.location.hash = '/register';
    root.innerHTML = `
    <section class="register" id="register">
      <img src="img/logo2.png" alt="logo Finger Food" class="register__logo">
      <h1 class="register__title">Regístrate!</h1>
      <form class="register__form">
        <div class="register__container">
          <div class="register__inputName">
            <i class="fas fa-user icon"></i>
            <input type="text" class="register__inputText" id="register__name" placeholder="Nombre y apellido">
          </div>
          <div class="register__inputMail">
            <i class="fas fa-envelope icon"></i>
            <input type="email" class="register__inputText" id="register__email" placeholder="Correo Electrónico">
          </div>
          <div class="register__inputPassword">
            <i class="fas fa-key icon"></i>
            <input type="password" class="register__inputPass" id="register__pass" placeholder="Contraseña">
          </div>
          <p class="register__acceptService">Al continuar, aceptas nuestras condiciones del servicio.</p>
          <input type="submit" value="Registrar" class="register__button" id="register__btn">
        </div>
      </form>
    </section>
    `;

    /* Guardar nuevo usuario */
    /* const userName = document.getElementById('register__name').value; */
    const userName = document.getElementById('register__name');
    console.log(userName);
    const emailRegister = document.getElementById('register__email');
    console.log(emailRegister);
    const passRegister = document.getElementById('register__pass');
    console.log(passRegister);
    const registerBtn = document.getElementById('register__btn');
    console.log(registerBtn);

    registerBtn.addEventListener('click', () => {
      /* Verificar que no existe usuario */
      /* Guardar */

      signInNew(userName.value, emailRegister.value, passRegister.value);
      /* Guardar datos registro */

      /* function save(name, email) {
         db.collection('users').add({
             userName: name,
             userEmail: email,
           })
           .then(function (docRef) {
             console.log("Document written with ID: ", docRef.id);
           })
           .catch(function (error) {
               console.error("Error adding document: ", error);
           })
       };
       /* Guardar si se envia mail de verificación */
      /* save(userName.value, emailRegister.value);*/
      start();
    });
  });

  /* Login con Google */
  /* Instancia proveedor del servicio */
  const provider = new firebase.auth.GoogleAuthProvider();
  const btnGoogle = document.getElementById('login__googleBtn');

  btnGoogle.addEventListener('click', () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result.user);
        /* probar poniendo foto de logueado */
        /* pasar a sección post */
        root.innerHTML = `<img src= "${result.user.photoURL}" >`;
        /* guardar datos de usuario */
      });
  });

  /* Ingreso con Facebook */
  /* Instancia proveedor del servicio */
  const provider2 = new firebase.auth.FacebookAuthProvider();
  const btnFacebook = document.getElementById('login__facebookBtn');

  btnFacebook.addEventListener('click', () => {
    firebase.auth()
      .signInWithPopup(provider2)
      .then((result) => {
        console.log(result);
        console.log(result.user);
        /* probar poniendo foto de logueado */
        /* pasar a sección post */
        root.innerHTML = `<img src= "${result.user.photoURL}" >`;
        /* guardar datos de usuario */
      });
  });

  /* Creación routing
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#/login') {
    //function
  } else if (window.location.hash === '#/register') {
    //function
  } else if (window.location.hash === '#/home') {
    const userNow = firebase.auth().currentUser;
    //function(userNow)
  } else if (window.location.hash === '#/forgot') {
    //function
  }
});*/
}
window.onload = init();

/*---------------------------------------------------------------------------------*/