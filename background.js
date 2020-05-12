
// chrome webapp itemid : llhpeemekijggcmaaipbbagehecglbjf
// chrome webapp public key : MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyQeWr/FWkixjIImLcm2/RuYGzqGdL4hf14MlIscaNVn490/1+3EDhoaE5ubBLfKcDTEXi1Kr0/DciC/LjEOTh6kcdog77UOBfeRtcZ7ixzcVh9E+7ty9r4iSSOU2gm/AuhegF62Mxj56MvndcxUbowOEL+1qZuARUisQtDs8Mp4iHwOhHidH/aI/e5qp3PHd+b6CjoqqXA9RGnVB+/7VSgZwXn5DWuguDuGustCeuPq2I/7QKX+rA8lMFc3HtJbiVnIPsgG0NEAqnEKHDF7cNiaseqX57kNaog6IDGFbJAUM2MaSpEe6iX3Cy/OyBpFgRw/ZhGl6WwtaMyP7J/GJXQIDAQAB
// oauth client id : 1057222832226-4ffgg9j582cq0p4agorcp9bgrfrn8n8m.apps.googleusercontent.com
// web api key : AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4
// database url : https://fyp-s3curest4sh.firebaseio.com
// storagebucket : fyp-s3curest4sh.appspot.com


// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
    apiKey: 'AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
    databaseURL: 'https://fyp-s3curest4sh.firebaseio.com',
    storageBucket: 'fyp-s3curest4sh.appspot.com'
  };
  firebase.initializeApp(config);
  
  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        tellAppInventor('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        tellAppInventor('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          tellAppInventor('Wrong password.');
        } else {
          tellAppInventor(errorMessage);
        }
        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
  }
  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      tellAppInventor('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      tellAppInventor('Please enter a password of 4 or more characters.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        tellAppInventor('The password is too weak.');
      } else {
        tellAppInventor(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]
  }
  /**
   * Sends an email verification to the user.
   */
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      tellAppInventor('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }
  function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      tellAppInventor('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        tellAppInventor(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        tellAppInventor(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
  
  /**
   * initApp handles setting up the Firebase context and registering
   * callbacks for the auth status.
   *
   * The core initialization is in firebase.App - this is the glue class
   * which stores configuration. We provide an app name here to allow
   * distinguishing multiple app instances.
   *
   * This method also registers a listener with firebase.auth().onAuthStateChanged.
   * This listener is called when the user is signed in or out, and that
   * is where we update the UI.
   *
   * When signed in, we also authenticate to the Firebase Realtime Database.
   */
  
  /*
  function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) { // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;

          if (emailVerified && !isAnonymous) {
                tellAppInventor( uid + ',' + email + ',' + displayName + ',' + photoURL );
            } else if (!emailVerified) {
                tellAppInventor( 'Please click the Send Email Verification button to confirm your account.' );
            }
          
          // [START_EXCLUDE]
//          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
//          document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
//          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
//          document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }
    window.onload = function() {
      initApp();
    }; */


function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
      console.log('User state change detected from the Background script of the Chrome Extension:', user);
    });
  }
  
  window.onload = function() {
    initApp();
  };