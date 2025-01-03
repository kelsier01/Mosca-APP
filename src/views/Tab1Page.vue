<template>
  <!-- Pagina completa -->
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Alertas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <!-- Contenido -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-title size="large">Tab 1</ion-title>
      </ion-header>
      
      <ion-grid>
        <ion-row v-for="deteccion in detecciones" v-bind:key="deteccion.id">
          <ion-col size="12" size-md="4">
            <ion-card>
              <img alt="Silhouette of mountains" :src="`data:image/jpeg;base64,${deteccion.imagen}`"/>
              <ion-card-header>
                <ion-card-title>{{ deteccion.id }}</ion-card-title>
                <ion-card-subtitle>{{ deteccion.fecha }}</ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                Here's a small text description
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle  } from '@ionic/vue';
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';

const URL_API = import.meta.env.VITE_URL_API;
//Router
const router = useRouter();
const logout = () => {
  // Aquí puedes limpiar el estado de la sesión o token
  localStorage.removeItem('token'); // O cualquier otro método que estés usando
  alert('Has cerrado sesión'); // Mensaje opcional
  router.push('/'); // Redirigir al inicio de sesión
};
const detecciones = ref([]);
const fetchDetecciones = () => {
  axios.get(`${URL_API}/detecciones`)
    .then((response) => {
      detecciones.value = response.data.detecciones;
    })
    .catch((error) => {
      console.error('Error al obtener las detecciones:', error);
    });
};

onMounted(() => {
  fetchDetecciones(); // Llamada inicial
  const intervalId = setInterval(fetchDetecciones, 5000); // Llamada cada 5 segundos

  onUnmounted(() => {
    clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  });
});
</script>
