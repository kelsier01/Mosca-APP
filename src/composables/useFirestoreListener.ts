import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { ref, onUnmounted } from 'vue';

// Configuración de Firebase (ajusta según tus credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyC8mo4O6dzElkVvclpoct0G2DoQpkI-LDI",
    authDomain: "websocket-1d864.firebaseapp.com",
    projectId: "websocket-1d864",
    storageBucket: "websocket-1d864.firebasestorage.app",
    messagingSenderId: "307445021703",
    appId: "1:307445021703:web:ead6008a0403d5d1e5bea2"
};

export function useFirestoreListener() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const nuevaDeteccion = ref(false);
  const ultimaDeteccion = ref(null);
  const error = ref<string | null>(null);
  
  // Variable para controlar si es la primera carga
  let primeraEjecucion = true;
  let ultimoValorDetectado: any = null;
  
  // Referencia al documento específico que vamos a monitorear
  const docRef = doc(db, 'updates', 'lista');
  
  // Iniciar el listener
  const unsubscribe = onSnapshot(docRef, 
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
      error.value = err.message;
      console.error('Error en Firestore listener:', err);
    }
  );
  
  // Función para resetear el estado de nueva detección
  const resetNuevaDeteccion = () => {
    nuevaDeteccion.value = false;
  };

  // Limpieza al desmontar componente
  onUnmounted(() => {
    unsubscribe();
  });
  
  return {
    nuevaDeteccion,
    ultimaDeteccion,
    error,
    resetNuevaDeteccion
  };
}