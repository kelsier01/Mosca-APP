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
        <ion-row>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
        </ion-row>
        <ion-row>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
          <ion-col  size="12" size-md="4"><ExploreContainer /></ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

//Router
const router = useRouter();
const logout = () => {
  // Aquí puedes limpiar el estado de la sesión o token
  // Por ejemplo, eliminando el token del almacenamiento local:
  localStorage.removeItem('token'); // O cualquier otro método que estés usando
  alert('Has cerrado sesión'); // Mensaje opcional
  router.push('/'); // Redirigir al inicio de sesión
};
</script>

