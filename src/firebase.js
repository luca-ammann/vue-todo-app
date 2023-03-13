import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtEE5wT9TGUTyNnJ6HiERQR8PF65dL6aw",
    authDomain: "vue-todo-app-d0d85.firebaseapp.com",
    databaseURL: "https://vue-todo-app-d0d85.firebaseio.com",
    projectId: "vue-todo-app-d0d85",
    storageBucket: "vue-todo-app-d0d85.appspot.com",
    messagingSenderId: "693594669296",
    appId: "1:693594669296:web:1eb7a58cb6598430464235",
    measurementId: "G-JD8WDL4FEW"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore = firebaseApp.firestore();

export default firestore
