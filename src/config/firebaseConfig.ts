import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';
import { config } from './envConfig';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: config.FIREBASE_PROJECT_ID + '.appspot.com'
});

const bucket = admin.storage().bucket();
export default bucket;
