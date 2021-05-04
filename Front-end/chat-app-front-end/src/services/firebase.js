 import firebase from 'firebase'
 const firebaseConfig = {
     apiKey: "AIzaSyCgw-bComT965QWuSivrP9JKSfXGG1OqXQ",
     authDomain: "chat-app-realtime-nodejs-mysql.firebaseapp.com",
     projectId: "chat-app-realtime-nodejs-mysql",
     storageBucket: "chat-app-realtime-nodejs-mysql.appspot.com",
     messagingSenderId: "956909425606",
     appId: "1:956909425606:web:89ed84d8066a032c5898c7"
 };
 firebase.initializeApp(firebaseConfig);

 export default firebase;