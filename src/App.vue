<template>
  <ion-app>
    <!-- Alerta de nueva detección -->
    <ion-alert
      :is-open="mostrarAlerta"
      header="Nueva Detección"
      message="Se ha registrado una nueva detección"
      :buttons="[
        {
          text: 'Ver ahora',
          cssClass: 'alert-button-confirm',
          handler: verDetecciones
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: cerrarAlerta
        }
      ]"
      @didDismiss="cerrarAlerta"
    />
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonAlert } from '@ionic/vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDeteccionesStore } from './composables/deteccionesStore';

const router = useRouter();
const mostrarAlerta = ref(false);
const deteccionesStore = useDeteccionesStore();

// Iniciar el listener cuando se monta el componente
onMounted(() => {
  deteccionesStore.iniciarListenerFirestore();
});

// Detener el listener cuando se desmonta el componente
onUnmounted(() => {
  deteccionesStore.detenerListener();
});

// Vigilar cambios en la variable nuevaDeteccion del store
watch(() => deteccionesStore.nuevaDeteccion, (valor) => {
  if (valor) {
    mostrarAlerta.value = true;
  }
});

// Función para ver las detecciones
const verDetecciones = () => {
  deteccionesStore.resetNuevaDeteccion();
  mostrarAlerta.value = false;
  
  // Si ya estamos en la ruta de detecciones, marcamos que la lista debe actualizarse
  if (router.currentRoute.value.path === '/tabs/detecciones') {
    deteccionesStore.marcarListaParaActualizar();
  } else {
    // Si no estamos en la vista de detecciones, navegamos a ella
    router.push('/tabs/detecciones');
  }
};

// Cerrar la alerta sin navegar
const cerrarAlerta = () => {
  deteccionesStore.resetNuevaDeteccion();
  mostrarAlerta.value = false;
};
</script>
