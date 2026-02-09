
const firebaseConfig = {
    apiKey: "AIzaSyD_-Jwr62tUYWlvnZ8-ubG5mZ-U-uIDRao",
  authDomain: "presupuestos-4c1be.firebaseapp.com",
  projectId: "presupuestos-4c1be",
  storageBucket: "presupuestos-4c1be.firebasestorage.app",
  messagingSenderId: "959037710242",
  appId: "1:959037710242:web:c87314c51577934f3f5cfb",
  measurementId: "G-KK3SG3XFEQ"
};

// Inicializar Firebase
let db;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase inicializado correctamente");
} catch (error) {
    console.error("Error al inicializar Firebase. Asegúrese de haber configurado js/firebase-config.js", error);
}
