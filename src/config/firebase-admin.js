import admin from 'firebase-admin';
import { readFileSync } from 'fs';

let serviceAccount;

// 로컬에서 파일, 배포에서 환경 변수 사용 가능
if (process.env.NODE_ENV === 'production') {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} else {
  serviceAccount = JSON.parse(readFileSync('firebase-service-account.json', 'utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://nb02-how-do-i-look-storage.firebasestorage.app',
});

const bucket = admin.storage().bucket();
const [exists] = await bucket.exists();
console.log(`버킷 존재함?:`, exists);
export default bucket;
