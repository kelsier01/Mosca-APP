import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8mo4O6dzElkVvclpoct0G2DoQpkI-LDI",
    authDomain: "websocket-1d864.firebaseapp.com",
    projectId: "websocket-1d864",
    storageBucket: "websocket-1d864.firebasestorage.app",
    messagingSenderId: "307445021703",
    appId: "1:307445021703:web:ead6008a0403d5d1e5bea2"
};

export const useDeteccionesStore = defineStore('detecciones', () => {
  // Estado
  const nuevaDeteccion = ref(false);
  const ultimaDeteccion = ref(null);
  const debeActualizarLista = ref(false);
  let unsubscribe: () => void;
  
  // Variables de control para el listener
  let primeraEjecucion = true;
  let ultimoValorDetectado: any = null;
  
  // Acciones
  function iniciarListenerFirestore() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, 'updates', 'lista');
    
    unsubscribe = onSnapshot(docRef, 
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          // Verificar cambios en el campo ultima_deteccion
          if (data.ultima_deteccion) {
            // Si es la primera ejecución, solo almacenamos el valor
            if (primeraEjecucion) {
              ultimoValorDetectado = data.ultima_deteccion;
              ultimaDeteccion.value = data.ultima_deteccion;
              primeraEjecucion = false;
            } 
            // Si no es la primera ejecución y el valor ha cambiado, activamos la alerta
            else if (JSON.stringify(ultimoValorDetectado) !== JSON.stringify(data.ultima_deteccion)) {
              ultimoValorDetectado = data.ultima_deteccion;
              ultimaDeteccion.value = data.ultima_deteccion;
              nuevaDeteccion.value = true;
              console.log('Se detectó un nuevo cambio en ultima_deteccion');
            }
          }
        }
      },
      (err) => {
        console.error('Error en Firestore listener:', err);
      }
    );
  }
  
  function detenerListener() {
    if (unsubscribe) {
      unsubscribe();
    }
  }

  function resetNuevaDeteccion() {
    nuevaDeteccion.value = false;
  }
  
  function marcarListaParaActualizar() {
    debeActualizarLista.value = true;
  }
  
  function resetActualizacionLista() {
    debeActualizarLista.value = false;
  }

  return {
    nuevaDeteccion,
    ultimaDeteccion,
    debeActualizarLista,
    iniciarListenerFirestore,
    detenerListener,
    resetNuevaDeteccion,
    marcarListaParaActualizar,
    resetActualizacionLista
  };
});