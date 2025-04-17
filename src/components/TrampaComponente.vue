<template>
  <ion-card class="content-card" @click="abrirModal">
    <ion-card-header class="card-header">
      <img src="/icono-trampa.png" alt="Icono de trampa" class="trap-icon" />
      <ion-card-title class="card-title">{{ modelo }}</ion-card-title>
      <ion-card-subtitle class="card-subtitle">{{ modelo }}</ion-card-subtitle>
    </ion-card-header>
    
    <!-- Modal para ver detalles de la trampa -->
    <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal">
      <ion-header>
        <ion-toolbar class="modal-toolbar">
          <ion-title class="modal-title">Detalles de la Trampa</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal" class="close-button">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="modal-content">
        <ion-list class="details-list">
          <ion-item class="detail-item">
            <ion-label>Email</ion-label>
            <ion-text>{{ email }}</ion-text>
          </ion-item>
          <ion-item class="detail-item">
            <ion-label>Predio</ion-label>
            <ion-text>{{ predio }}</ion-text>
          </ion-item>
          <ion-item class="detail-item">
            <ion-label>Dirección MAC</ion-label>
            <ion-text>{{ macAddress }}</ion-text>
          </ion-item>
          <ion-item class="detail-item">
            <ion-label>Modelo</ion-label>
            <ion-text>{{ modelo }}</ion-text>
          </ion-item>
          <ion-item class="detail-item">
            <ion-label>Coordenadas</ion-label>
            <ion-text>{{ coordenadas }}</ion-text>
          </ion-item>
        </ion-list>

        <!-- Botones de acción -->
        <ion-button expand="full" color="danger" @click="deshabilitarTrampa" class="action-button">
          Deshabilitar
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const props = withDefaults(defineProps<{
  modelo: string;
  email: string;
  predio: string;
  macAddress: string;
  coordenadas: string;
}>(),{
  modelo: '',
  email: '',
  predio: '',
  macAddress: '',
  coordenadas: '',
});

const emits = defineEmits(['disableTrampa']);
const isModalOpen = ref<boolean>(false);

const abrirModal = ():void => {
  isModalOpen.value = true;
};

const cerrarModal = ():void => {
  isModalOpen.value = false;
};

const deshabilitarTrampa = ():void => {
  console.log('Deshabilitando trampa:', props.modelo);
  emits('disableTrampa');
  cerrarModal();
};
</script>

<style scoped>
/* Estilos de la tarjeta */
.content-card {
  max-width: 300px;
  margin: 1rem auto;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.content-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Encabezado de la tarjeta */
.card-header {
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.trap-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
  
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #04402A;
  margin: 0.5rem 0;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #92A69E;
}

/* Estilos del modal */
.modal-toolbar {
  --background: #04402A;
  --color: #ffffff;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
}

.close-button {
  --color: #ffffff;
}

.modal-content {
  padding: 1rem;
  background-color: #f9f9f9;
}

.details-list {
  margin: 0;
  padding: 0;
  background: none;
}

.detail-item {
  --inner-padding-start: 10px;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0f0f0;
}

/* Botón de acción */
.action-button {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
  --background: #e63946;
  --color: #ffffff;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  --background: #b92a3a;
}

/* Efectos de transición */
ion-modal {
  --border-radius: 12px;
}

@media (min-width: 768px) {
  .content-card {
    max-width: 400px;
  }

  .modal-title {
    font-size: 1.6rem;
  }

  .detail-item {
    font-size: 1rem;
  }

  .action-button {
    font-size: 1.1rem;
  }
}
</style>
