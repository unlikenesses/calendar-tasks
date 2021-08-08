import firebase from 'firebase/app'
import 'firebase/database'

export const db = firebase
    .initializeApp({ databaseURL: 'https://calendar-tasks-c99d3-default-rtdb.europe-west1.firebasedatabase.app/' })
    .database()



