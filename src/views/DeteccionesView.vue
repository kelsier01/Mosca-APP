<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Detecciones</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="light" @click="logout">
            <ion-icon slot="start" :icon="logOutOutline" color="light"/>
            <span style="color: #ffffff;">Cerrar Sesión</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Contenido -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Alerta de nueva detección -->
      <ion-alert
        :is-open="mostrarAlerta"
        header="Nueva Detección"
        :message="mensajeAlerta"
        :buttons="[{text: 'OK', cssClass: 'alert-button-confirm'}]"
        @didDismiss="mostrarAlerta = false"
      />

      <ion-grid>

        <!-- Indicador de carga -->
        <ion-row v-if="isLoading">
          <ion-col size="12" class="loading-indicator">
            <ion-spinner name="dots"></ion-spinner>
            <p class="loading-text">Cargando detecciones...</p>
          </ion-col>
        </ion-row>

        <!-- Lista de detecciones -->
        <ion-row v-else>
          <ion-col
            v-for="deteccion in detecciones" 
            :key="deteccion.id" 
            size="12" 
            size-md="6" 
            size-lg="4">
            <ion-card 
              class="deteccion-card" 
              @click="abrirModal(deteccion)">
              <div class="card-image-container">
                <img
                  alt="Imagen de detección"
                  :src="`data:image/jpeg;base64,${deteccion.imagen}`"
                  class="deteccion-image"
                />
                <div class="status-badge" :class="deteccion.estado_deteccion_id ? 'status-active' : 'status-inactive'">
                  {{ deteccion.estado_deteccion_id ? "Activo" : "Inactivo" }}
                </div>
              </div>
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="eyeOutline" class="title-icon"></ion-icon>
                  Detección #{{ deteccion.id }}
                </ion-card-title>
                <ion-card-subtitle>{{ formatFecha(deteccion.fecha) }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p class="card-info"><ion-icon :icon="appsOutline"></ion-icon> <strong>Trampa:</strong> {{ deteccion.trampa_id }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Sin datos -->
        <ion-row v-if="!isLoading && detecciones.length === 0">
          <ion-col size="12" class="no-data">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <h3>Sin detecciones</h3>
            <p>No se encontraron detecciones registradas.</p>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal de detalles -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal" class="details-modal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Detección #{{ detallesDeteccion?.id }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarModal">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="detallesDeteccion" class="modal-content">
            <!-- Imagen y badge de estado -->
            <div class="modal-image-container">
              <img
                :src="`data:image/jpeg;base64,${detallesDeteccion.imagen}`"
                alt="Imagen completa"
                class="modal-image"
              />
              <div class="modal-badge" :class="detallesDeteccion.estado_deteccion_id ? 'status-active' : 'status-inactive'">
                {{ detallesDeteccion.estado_deteccion_id ? "Activo" : "Inactivo" }}
              </div>
            </div>
            
            <!-- Información detallada -->
            <ion-card class="details-card">
              <ion-card-header>
                <ion-card-title>Información</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list lines="none">
                  <ion-item>
                    <ion-icon :icon="idCardOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">ID Registro</ion-label>
                    <ion-note>{{ detallesDeteccion.id }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-icon :icon="calendarOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Fecha Detección</ion-label>
                    <ion-note>{{ formatFecha(detallesDeteccion.fecha) }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-icon :icon="hardwareChipOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Trampa</ion-label>
                    <ion-note><strong>#</strong>{{ detallesDeteccion.trampa_id }}</ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useSocketIO } from '@/composables/useSocketIO';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Deteccion } from '@/interfaces/interfaces';
import { 
  eyeOutline,
  alertCircleOutline,
  closeOutline,
  calendarOutline,
  hardwareChipOutline,
  idCardOutline,
  logOutOutline,
  appsOutline
} from 'ionicons/icons';

const URL_API:string = import.meta.env.VITE_URL_API; // API base URL

// Manejo de estado
const detecciones = ref<Deteccion[]>([]);
const isLoading = ref<boolean>(true); // Indicador de carga
const isModalOpen = ref<boolean>(false); // Estado del modal
const detallesDeteccion = ref<Deteccion | undefined>() ; // Datos de la detección seleccionada
const mostrarAlerta = ref<boolean>(false); // Estado de la alerta
const mensajeAlerta = ref<string>(''); // Mensaje de la alerta

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
    // Ordenar detecciones por ID de manera descendente (asumiendo que mayor ID = más reciente)
    const deteccionesOrdenadas: Deteccion[] = response.data.detecciones?.sort((a: Deteccion, b: Deteccion) => b.id - a.id) || [];
    detecciones.value = deteccionesOrdenadas;
    console.log('Detecciones:', detecciones.value);
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


// Conectar al servidor Socket.IO
const serverAddress = 'wss://ceratitis.duckdns.org'; // URL del servidor Socket.IO
const { mensaje } = useSocketIO(serverAddress);


// Escuchar cambios en el mensaje recibido
watch(mensaje, async (nuevoMensaje) => {
  if (nuevoMensaje && nuevoMensaje.tipo === 'nuevaAlerta') {
    // Agregar la nueva detección al inicio de la lista
    detecciones.value.push(nuevoMensaje.data);
    console.log('Nueva detección:', detecciones.value);

    // Mostrar una alerta
    mensajeAlerta.value = `Nueva detección en la trampa ${nuevoMensaje.data.trampa_id}`;
    mostrarAlerta.value = true;

    // Mostrar notificación push
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Nueva Detección',
          body: `Se ha registrado una nueva detección en la trampa ${nuevoMensaje.data.trampa_id}`,
          id: new Date().getTime(),
        },
      ],
    });

  }
});

onMounted(() => {
  fetchDetecciones();
});

</script>

<style scoped>
/* Estilos base */
:root {
  --primary-color: #1d5c41;
  --primary-light: rgba(29, 92, 65, 0.1);
  --primary-medium: rgba(29, 92, 65, 0.5);
  --text-dark: #333333;
  --text-medium: #666666;
  --text-light: #999999;
}

/* Encabezado */
.header-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Indicador de carga */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-indicator ion-spinner {
  --color: #1d5c41;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.loading-text {
  color: var(--text-medium);
  font-size: 16px;
}

/* No hay datos */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-medium);
}

.no-data ion-icon {
  color: var(--text-light);
  font-size: 48px;
  margin-bottom: 1rem;
}

.no-data h3 {
  margin: 0.5rem 0;
  font-weight: 600;
  color: var(--text-dark);
}

.no-data p {
  margin: 0;
  font-size: 16px;
}

/* Search card */
.search-card {
  margin: 0 0 16px 0;
  border-radius: 12px;
}

/* Card de detección */
.deteccion-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.deteccion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(29, 92, 65, 0.15);
}

.card-image-container {
  position: relative;
  width: 100%;
}

.deteccion-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-active {
  background-color: #1d5c41;
}

.status-inactive {
  background-color: #d14836;
}

ion-card-header {
  padding: 16px 16px 8px;
}

.title-icon {
  font-size: 16px;
  margin-right: 6px;
}

ion-card-title {
  font-weight: 600;
  color: #1d5c41;
  font-size: 16px;
  display: flex;
  align-items: center;
}

ion-card-subtitle {
  color: var(--text-medium);
  font-size: 14px;
  margin-top: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  margin: 4px 0;
  color: var(--text-medium);
}

.card-info ion-icon {
  font-size: 16px;
  margin-right: 6px;
  color: #1d5c41;
}

/* Modal */
.details-modal {
  --border-radius: 16px 16px 0 0;
}

ion-modal ion-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-image-container {
  position: relative;
  width: 100%;
}

.modal-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.details-card {
  margin: 0;
  border-radius: 12px;
}

ion-item ion-icon {
  color: #1d5c41;
  margin-right: 16px;
}

ion-item ion-label {
  color: var(--text-dark);
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

ion-item ion-note {
  font-size: 16px;
  color: var(--text-dark);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  ion-grid {
    padding: 12px;
  }
  
  .deteccion-image {
    height: 160px;
  }
  
  .modal-image {
    border-radius: 8px;
  }
}
</style>
