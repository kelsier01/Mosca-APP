<template>
  <ion-page>

    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Trampas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario">Registrar Trampa</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Lista de Trampas Activas -->
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="4" v-for="trampa in trampas" :key="trampa.nombre">
            <Trampa 
              :nombre="trampa.nombre" 
              :modelo="trampa.modelo" 
              :email="trampa.usuario.email" 
              :predio="trampa.predio.direccion" 
              :macAddress="trampa.direccion_mac" 
              :coordenadas="trampa.coordenadas"
              @disableTrampa="disableTrampa(trampa.id)"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal para registro de nueva trampa -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarFormulario">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrar Trampa</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarFormulario">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <!-- Campos del formulario de registro -->
            <ion-item>
              <ion-label position="floating">Modelo</ion-label>
              <ion-input type="text" :value="modelo" @ionInput="e => modelo = e.target.value"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label>Predio</ion-label>
              <ion-select :value="predio_id" @ionChange="e => predio_id = e.detail.value" placeholder="Selecciona un predio">
                <ion-select-option v-for="predio in predios" :value="predio.id" :key="predio.id">{{ predio.direccion }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Dirección MAC</ion-label>
              <ion-input type="text" :value="direccion_mac" @ionInput="e => direccion_mac = e.target.value"></ion-input>
            </ion-item>
      
            <ion-item>
              <ion-label position="floating">Coordenadas</ion-label>
              <ion-input type="text" :value="coordenadas" @ionInput="e => coordenadas = e.target.value"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="full" @click="registrarTrampa">Registrar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Toast de notificación -->
      <ion-toast
        :is-open="isToastOpen"
        :message="toastMessage"
        duration="2000"
        position="top"
        @ionToastDidDismiss="isToastOpen = false">
      </ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { IonModal, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonButtons, IonToast } from '@ionic/vue';
import Trampa from '@/components/TrampaComponente.vue';
import axios from 'axios';

const URL_API = import.meta.env.VITE_URL_API;
const trampas = ref([]);
const predios = ref([]);// Ejemplo de modelos de trampas
const funcionarios = ref([]);

// Variables individuales para cada campo del formulario
const predio_id = ref('');
const direccion_mac = ref('');
const modelo = ref('');
const coordenadas = ref('');

// Estado del modal y del toast
const isModalOpen = ref(false);
const isToastOpen = ref(false);
const toastMessage = ref(''); // Mensaje dinámico para el toast


// Inicializar la estructura de asignaciones

const getFuncionarios = () => {
  axios.get(`${URL_API}/funcionarios`)
    .then((response) => {
      if (response) {
        funcionarios.value = response.data.filter((funcionario)=> funcionario.estado == 1);
        console.log(funcionarios.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getTrampas = () => {
  axios.get(`${URL_API}/trampas`)
    .then((response) => {
      if (response) {
        trampas.value = response.data.filter((trampa)=> trampa.estado == 1);
        console.log(trampas.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getPredios = () => {
  axios.get(`${URL_API}/predios`)
    .then((response) => {
      if (response) {
        predios.value = response.data;
        console.log(predios.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const postTrampa = async () => {
  try {
    const response = await axios.post(`${URL_API}/trampas`, {
      predio_id: predio_id.value,
      direccion_mac: direccion_mac.value,
      modelo: modelo.value,
      coordenadas: coordenadas.value,
    });
    console.log(response);
    getTrampas();
    toastMessage.value = "Trampa registrada exitosamente";
    isToastOpen.value = true;
  } catch (e) {
    console.log(e);
  }
};

const disableTrampa = async (trampaId: number) => {
  try {
    const response = await axios.put(`${URL_API}/trampas/${trampaId}`, {
      estado: 0
    });
    console.log(response);
    getTrampas();
    toastMessage.value = "Trampa deshabilitada";
    isToastOpen.value = true;
  } catch (error) {
    console.log("Error al deshabilitar la trampa:", error);
  }
};

const abrirFormulario = () => {
  isModalOpen.value = true;
};

const cerrarFormulario = () => {
  isModalOpen.value = false;
};

const registrarTrampa = async () => {
  await postTrampa();
  predio_id.value = '';
  direccion_mac.value = '';
  modelo.value = '';
  coordenadas.value = '';
  cerrarFormulario();
};

onBeforeMount(() => {
  getFuncionarios();
  getPredios();
  getTrampas();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 8px;
  text-align: center;
}


.content-card {
  max-width: 250px;
  margin: 0 auto;
  cursor: pointer;
}
</style>
