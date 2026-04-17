import admin from 'firebase-admin';

let initializedApp = null;

const getServiceAccountConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
};

const initializeFirebaseAdmin = () => {
  if (initializedApp) {
    return initializedApp;
  }

  const serviceAccount = getServiceAccountConfig();
  if (!serviceAccount) {
    throw new Error(
      'Firebase Admin is not fully configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  initializedApp = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

  return initializedApp;
};

export const getFirebaseAdminAuth = () => {
  const app = initializeFirebaseAdmin();
  return admin.auth(app);
};
