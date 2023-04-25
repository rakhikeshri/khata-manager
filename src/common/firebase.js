import * as firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { getConfig } from "./../common/AppConfig";

const secrets = getConfig("firebase");

firebase.initializeApp({
  apiKey: secrets.apiKey,
  authDomain: secrets.authDomain,
  projectId: secrets.projectId,
  storageBucket: secrets.storageBucket,
  messagingSenderId: secrets.senderId,
});

export default firebase;