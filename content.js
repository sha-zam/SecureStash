console.log("Chrome extension go");

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(msg, sender, sendResponse)
{
    console.log(msg.txt);
}

var firebaseConfig = {
    apiKey: "AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4",
    authDomain: "fyp-s3curest4sh.firebaseapp.com",
    databaseURL: "https://fyp-s3curest4sh.firebaseio.com",
    projectId: "fyp-s3curest4sh",
    storageBucket: "fyp-s3curest4sh.appspot.com",
    messagingSenderId: "1057222832226",
  };