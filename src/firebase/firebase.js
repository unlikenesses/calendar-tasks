import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from './config'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebase.database()

export { db }

export default {
    firebaseApp
}



