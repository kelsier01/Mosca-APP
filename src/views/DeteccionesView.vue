<template>
  <!-- Página completa -->
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Detecciones</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Contenido -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Detecciones</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <!-- Mostrar indicador de carga mientras se obtienen las detecciones -->
        <ion-row v-if="isLoading">
          <ion-col size="12" class="loading-indicator">
            <ion-spinner name="dots"></ion-spinner>
          </ion-col>
        </ion-row>

        <!-- Mostrar detecciones si están disponibles -->
        <ion-row v-else>
          <ion-col size="12" size-md="6" size-lg="4" v-for="deteccion in detecciones" :key="deteccion.id">
            <ion-card class="deteccion-card" @click="abrirModal(deteccion)">
              <img
                alt="Imagen de detección"
                :src="`data:image/jpeg;base64,${deteccion.imagen}`"
                class="deteccion-image"
              />
              <ion-card-header>
                <ion-card-title>ID: {{ deteccion.id }}</ion-card-title>
                <ion-card-subtitle>{{ formatFecha(deteccion.fecha) }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p><strong>Estado:</strong> {{ deteccion.estado_deteccion_id ? "Activo" : "Deshabilitado"  }}</p>
                <p><strong>Trampa:</strong> {{ deteccion.trampa_id }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Mostrar mensaje si no hay detecciones -->
        <ion-row v-if="!isLoading && detecciones.length === 0">
          <ion-col size="12" class="no-data">
            <p>No se encontraron detecciones registradas.</p>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal para detalles de detección -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Detalles de la Detección</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div v-if="detallesDeteccion">
            <img
              :src="`data:image/jpeg;base64,${detallesDeteccion.imagen}`"
              alt="Imagen completa"
              class="modal-image"
            />
            <ion-list>
              <ion-item>
                <ion-label><strong>ID:</strong></ion-label>
                <ion-note>{{ detallesDeteccion.id }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label><strong>Fecha:</strong></ion-label>
                <ion-note>{{ formatFecha(detallesDeteccion.fecha) }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label><strong>Estado:</strong></ion-label>
                <ion-note>{{ detallesDeteccion.estado_deteccion_id ? "Activo" : "Deshabilitado" }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label><strong>Trampa:</strong></ion-label>
                <ion-note>{{ detallesDeteccion.trampa_id }}</ion-note>
              </ion-item>
            </ion-list>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow, IonModal, IonList, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/vue';
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';

const URL_API = import.meta.env.VITE_URL_API; // API base URL

//Inteface
interface Deteccion {
  id: number;
  predio_id: number;
  trampa_id: number;
  estado_deteccion_id: number;
  imagen: string;
  fecha: string;
}

// Manejo de estado
const detecciones = ref<Deteccion[]>([]);
const isLoading = ref<boolean>(true); // Indicador de carga
const isModalOpen = ref<boolean>(false); // Estado del modal
const detallesDeteccion = ref<Deteccion | undefined>() ; // Datos de la detección seleccionada

// Router para logout
const router = useRouter();

const logout = ():void => {
  localStorage.removeItem('token');
  alert('Has cerrado sesión');
  router.push('/');
};

// Formatear la fecha para mejor legibilidad
const formatFecha = (fecha:string):string => {
  const date = new Date(fecha);
  return date.toLocaleString();
};

// Llamada a la API para obtener las detecciones
const fetchDetecciones = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${URL_API}/detecciones`);
    detecciones.value = response.data.detecciones || [];
    console.log('Detecciones:', response.data.detecciones);
  } catch (error) {
    console.error('Error al obtener las detecciones:', error);
    alert('Hubo un problema al cargar las detecciones. Inténtalo nuevamente.');
  } finally {
    isLoading.value = false;
  }
};

// Abrir modal con detalles de detección
const abrirModal = (deteccion:Deteccion):void => {
  detallesDeteccion.value = deteccion;
  isModalOpen.value = true;
};

// Cerrar modal
const cerrarModal = ():void => {
  isModalOpen.value = false;
  detallesDeteccion.value = undefined;
};

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  fetchDetecciones(); // Llamada inicial
  intervalId = setInterval(fetchDetecciones, 5000); // Actualizar cada 5 segundos
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }
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

/* Indicador de carga */
.loading-indicator {
  text-align: center;
  padding: 2rem 0;
}

/* No hay datos */
.no-data {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin: 2rem 0;
}

/* Card de detección */
.deteccion-card {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.deteccion-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.deteccion-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

/* Imagen completa en el modal */
.modal-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 1rem;
}
</style>
