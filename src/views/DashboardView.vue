<template>
  <ion-page>
    <!-- Encabezado -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <!-- Encabezado colapsable en móviles -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="condense-title">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <!-- Fila para los contadores -->
        <ion-row class="dashboard-row">
          <!-- Carta de Recuento de Detecciones -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card detections-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Recuento de Detecciones</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{ deteccionesTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Funcionarios -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card employees-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Funcionarios</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{ funcionariosTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Trampas -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card traps-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Trampas Operativas</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{  trampasTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/vue';

import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
const URL_API = import.meta.env.VITE_URL_API;
const deteccionesTotales = ref(0);
const funcionariosTotales = ref(0);
const trampasTotales = ref(0);

// Llamada a la API para obtener los datos del Dashboard
const fetchData = async () => {
  await axios.get(`${URL_API}/detecciones`)
  .then((response) => {
    deteccionesTotales.value = response.data.detecciones.length;
    console.log(response.data.detecciones.length);
  })
  .catch((error) => {
    console.error('Error al obtener el recuento de detecciones:', error);
  });

  await axios.get(`${URL_API}/funcionarios`)
  .then((response) => {
    funcionariosTotales.value = response.data.length;
    console.log(response.data.length);
  })

  await axios.get(`${URL_API}/trampas`)
  .then((response) => {
    trampasTotales.value = response.data.filter((trampa:any) => trampa.estado == 1).length;
    console.log(trampasTotales.value);
  })
};  

onBeforeMount(() => {
  fetchData();
});
</script>

<style scoped>
/* Encabezado */
.header-toolbar {
  --background: #04402A;
  --color: #ffffff;
}

.header-title {
  font-size: 1.4rem;
  font-weight: bold;
}

/* Contenido del Dashboard */
.dashboard-content {
  --background: #f5f5f5;
  padding: 1rem;
}

/* Grid */
.dashboard-grid {
  gap: 1rem; /* Espaciado entre columnas */
}

/* Fila */
.dashboard-row {
  justify-content: center; /* Centrar las tarjetas */
  align-items: stretch; /* Alinear las tarjetas verticalmente */
}

/* Columna */
.dashboard-col {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

/* Tarjetas */
.dashboard-card {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.dashboard-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #04402A;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.card-content {
  padding: 1.5rem 1rem;
  text-align: center;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
  color: #04402A;
  margin: 0;
}

/* Colores personalizados por tipo de tarjeta */
.detections-card {
  border-left: 4px solid #92A69E;
}

.employees-card {
  border-left: 4px solid #e63946;
}

.traps-card {
  border-left: 4px solid #f4a261;
}

/* Responsividad */
@media (max-width: 768px) {
  .card-value {
    font-size: 1.5rem;
  }
}
</style>
