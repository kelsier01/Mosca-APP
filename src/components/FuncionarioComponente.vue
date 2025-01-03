<template>
  <ion-card class="content-card" @click="abrirModal">
    <ion-card-header class="card-header">
      <ion-icon aria-hidden="true" :icon="person" class="person-icon" />
      <ion-card-title class="card-title">{{ `${nombre} ${apellido}` }}</ion-card-title>
      <ion-card-subtitle class="card-subtitle">{{ rol }}</ion-card-subtitle>
    </ion-card-header>
    
    <!-- Modal para ver detalles del funcionario -->
    <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal">
      <ion-header>
        <ion-toolbar class="modal-toolbar">
          <ion-title class="modal-title">Detalles del Funcionario</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal" class="close-button">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="modal-content">
        <ion-list class="details-list">
          <ion-item class="detail-item">
            <ion-label>Nombre</ion-label>
            <ion-text>{{ `${nombre} ${apellido}` }}</ion-text>
          </ion-item>

          <ion-item class="detail-item">
            <ion-label>Email</ion-label>
            <ion-text>{{ email }}</ion-text>
          </ion-item>
          
          <ion-item class="detail-item">
            <ion-label>Teléfono</ion-label>
            <ion-text>{{ telefono }}</ion-text>
          </ion-item>

          <ion-item class="detail-item">
            <ion-label>Rol</ion-label>
            <ion-text>{{ rol }}</ion-text>
          </ion-item>
        </ion-list>

        <!-- Botones de acción -->
        <ion-button expand="full" color="danger" @click="deshabilitarTrampa" class="action-button">
          Deshabilitar
        </ion-button>
        <ion-button expand="full" color="primary" @click="vincularFuncionario" class="action-button">
          Vincular con Funcionario
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonModal,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
} from '@ionic/vue';
import { person } from 'ionicons/icons';

// Interface
interface FuncionarioProps {
  nombre: string;
  apellido: string;
  rol: string;
  rut: string;
  telefono: string;
  email: string;
}


// Props
const props = withDefaults(defineProps<FuncionarioProps>(), {
  nombre: '',
  apellido: '',
  rol: '',
  rut: '',
  telefono: '',
  email: '',
});

const isModalOpen = ref<boolean>(false);

const abrirModal = (): void => {
  isModalOpen.value = true;
};

const cerrarModal = (): void => {
  isModalOpen.value = false;
};

const deshabilitarTrampa = (): void => {
  console.log('Deshabilitando trampa:', { nombre: props.nombre });
  cerrarModal();
};

const vincularFuncionario = (): void => {
  console.log('Vinculando trampa con funcionario:', { nombre: props.nombre });
};
</script>

<style scoped>
/* Tarjeta principal */
.content-card {
  max-width: 320px;
  margin: 1rem auto;
  cursor: pointer;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.content-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* Encabezado de la tarjeta */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.person-icon {
  font-size: 4rem;
  color: #04402A;
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

/* Modal */
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
}

.detail-item {
  --inner-padding-start: 10px;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0f0f0;
}

/* Botones de acción */
.action-button {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.action-button:first-of-type {
  --background: #e63946;
}

.action-button:first-of-type:hover {
  --background: #b92a3a;
}

.action-button:last-of-type {
  --background: #04402A;
}

.action-button:last-of-type:hover {
  --background: #01261C;
}

/* Responsividad */
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
