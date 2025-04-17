<template>
  <ion-card class="predio-card">
    <ion-card-header>
      <ion-card-title>
        <ion-icon :icon="homeOutline" class="title-icon"></ion-icon>
        {{ direccion }}
      </ion-card-title>
      <ion-card-subtitle>{{ `${nombre} ${apellido}` }}</ion-card-subtitle>
    </ion-card-header>
    
    <ion-card-content>
      <p class="card-info">
        <ion-icon :icon="mailOutline"></ion-icon> 
        <strong>Email:</strong> {{ email || 'No disponible' }}
      </p>
      <p class="card-info">
        <ion-icon :icon="callOutline"></ion-icon> 
        <strong>Teléfono:</strong> {{ telefono }}
      </p>
      
      <ion-button 
        expand="block" 
        fill="clear" 
        size="small"
        class="details-button" 
        @click="abrirModal"
      >
        <ion-icon :icon="eyeOutline" slot="start"></ion-icon>
        Ver detalles
      </ion-button>
    </ion-card-content>
    
    <!-- Modal para ver detalles del predio -->
    <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal" class="details-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Detalles del Predio</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal">
              <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Información del predio -->
        <ion-card class="details-card">
          <ion-card-header>
            <ion-card-title class="section-title">
              <ion-icon :icon="homeOutline"></ion-icon>
              Información del Predio
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="none">
              <ion-item>
                <ion-icon :icon="locationOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Dirección</ion-label>
                <ion-note>{{ direccion }}</ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
        
        <!-- Información del propietario -->
        <ion-card class="details-card">
          <ion-card-header>
            <ion-card-title class="section-title">
              <ion-icon :icon="personOutline"></ion-icon>
              Información del Propietario
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="none">
              <ion-item>
                <ion-icon :icon="personOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Nombre completo</ion-label>
                <ion-note>{{ `${nombre} ${apellido}` }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-icon :icon="idCardOutline" slot="start"></ion-icon>
                <ion-label position="stacked">RUT</ion-label>
                <ion-note>{{ rut }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Email</ion-label>
                <ion-note>{{ email || 'No disponible' }}</ion-note>
              </ion-item>
              
              <ion-item>
                <ion-icon :icon="callOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Teléfono</ion-label>
                <ion-note>{{ telefono }}</ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <ion-button 
            expand="block" 
            color="danger" 
            fill="outline" 
            @click="deshabilitarPredio"
            class="action-button"
          >
            <ion-icon :icon="trashOutline" slot="start"></ion-icon>
            Deshabilitar predio
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  homeOutline,
  personOutline,
  mailOutline,
  callOutline,
  eyeOutline,
  closeOutline,
  idCardOutline,
  trashOutline,
  locationOutline,
} from 'ionicons/icons';

//Interface
interface PrediosProps {
  direccion: string;
  rut: string;
  usuario_id: string | number | null; // Modificado para aceptar string, number o null
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

//Props
withDefaults(defineProps<PrediosProps>(),{
  direccion: '',
  rut: '',
  usuario_id: '', // Valor por defecto como string vacío
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
});

const emit = defineEmits(['deshabilitarPredio']);
const isModalOpen = ref<boolean>(false);

const abrirModal = (): void => {
  isModalOpen.value = true;
};

const cerrarModal = (): void => {
  isModalOpen.value = false;
};

const deshabilitarPredio = (): void => {
  emit('deshabilitarPredio');
  cerrarModal();
};
</script>

<style scoped>
/* Tarjeta del predio */
.predio-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
}

.predio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(29, 92, 65, 0.15);
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
  color: #666666;
  font-size: 14px;
  margin-top: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  margin: 8px 0;
  color: #666666;
}

.card-info ion-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #1d5c41;
}

.details-button {
  margin-top: 12px;
  --color: #1d5c41;
}

/* Modal de detalles */
.details-modal {
  --border-radius: 16px 16px 0 0;
}

ion-modal ion-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.details-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.details-card:last-of-type {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #1d5c41;
}

.section-title ion-icon {
  margin-right: 8px;
}

ion-item ion-icon {
  color: #1d5c41;
}

ion-item ion-label {
  color: #333333;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

ion-item ion-note {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}

.action-buttons {
  margin-top: 24px;
}

.action-button {
  --border-color: #d14836;
  --color: #d14836;
}
</style>
