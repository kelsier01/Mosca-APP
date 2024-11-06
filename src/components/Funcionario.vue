<template>
    <ion-card class="content-card" @click="abrirModal">
      <ion-card-header class="card-header">
        <ion-icon aria-hidden="true" :icon="person" />
        <ion-card-title>{{ nombre }}</ion-card-title>
        <ion-card-subtitle>{{ modelo }}</ion-card-subtitle>
      </ion-card-header>
      
      <!-- Modal para ver detalles de la trampa -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Detalles del Funcionario</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
  
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-label>Nombre</ion-label>
              <ion-text>{{ predio }}</ion-text>
            </ion-item>

            <ion-item>
              <ion-label>Apellido</ion-label>
              <ion-text>{{ predio }}</ion-text>
            </ion-item>

            <ion-item>
              <ion-label>Email</ion-label>
              <ion-text>{{ email }}</ion-text>
            </ion-item>
            
            <ion-item>
              <ion-label>Telefono</ion-label>
              <ion-text>{{ predio }}</ion-text>
            </ion-item>

            <ion-item>
              <ion-label>Rol</ion-label>
              <ion-text>{{ predio }}</ion-text>
            </ion-item>
          </ion-list>
  
          <!-- Botones de acción -->
          <ion-button expand="full" color="danger" @click="deshabilitarTrampa">Deshabilitar</ion-button>
          <ion-button expand="full" color="primary" @click="vincularFuncionario">Vincular con Funcionario</ion-button>
        </ion-content>
      </ion-modal>
    </ion-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonModal, IonButton, IonButtons, IonToolbar, IonTitle, IonHeader, IonContent, IonList, IonItem, IonLabel, IonText, IonIcon} from '@ionic/vue';
  import { person } from 'ionicons/icons';
  const props = defineProps({
    nombre: String,
    modelo: String,
    email: String,
    predio: String,
    macAddress: String,
    coordenadas: String,
  });
  
  const isModalOpen = ref(false);
  
  const abrirModal = () => {
    isModalOpen.value = true;
  };
  
  const cerrarModal = () => {
    isModalOpen.value = false;
  };
  
  const deshabilitarTrampa = () => {
    console.log("Deshabilitando trampa:", { nombre: props.nombre });
    cerrarModal();
  };
  
  const vincularFuncionario = () => {
    console.log("Vinculando trampa con funcionario:", { nombre: props.nombre });
  };
  </script>
  
  <style scoped>
  .content-card {
    max-width: 250px; /* Ajusta el tamaño máximo según tus preferencias */
    margin: 0 auto; /* Centra la tarjeta en la página */
    cursor: pointer; /* Cambia el cursor a pointer */
  }
  
  .card-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .trap-icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 0.5rem;
  }
  </style>
  