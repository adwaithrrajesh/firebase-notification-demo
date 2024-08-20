import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

export const requestForToken = async () => {
  try {
    console.log('Registering service worker...');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service worker registered:', registration);

    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted. Requesting FCM token...');
      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });

      if (token) {

        // use THIS API After getting token 
        // PATCH :  https://simplus-backend.onrender.com/api/notification/updateFCMToken
        // {FCMToken : token}
        console.log('FCM Token:', token);
      } else {
        console.log('No FCM token found.');
      }
    } else {
      console.error('Notification permission not granted.');
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      displayNotification(payload);
    });
  });

const displayNotification = (payload) => {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };
      registration.showNotification(notificationTitle, notificationOptions);
    }
  });
};
