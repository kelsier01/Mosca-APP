<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Predios</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario">Registrar Predio</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="4" v-for="predio in predios" :key="predio.id">
            <Predios 
              :rut="predio.duenio?.persona.rut"
              :nombre="predio.duenio?.persona.nombre" 
              :apellido="predio.duenio?.persona.apellido"
              :telefono="predio.duenio?.persona.telefono"
              :email="predio.duenio.persona.usuario?.email"
              :direccion="predio?.direccion"
              :usuario_id="predio?.duenio?.persona?.usuario_id"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarFormulario">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrar Predio</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarFormulario">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item>
              <ion-label>Dueño</ion-label>
              <ion-select v-model="form.duenio_id" :disabled="registrarNuevoDuenio" placeholder="Selecciona un dueño">
                <ion-select-option v-for="duenio in duenios" :value="duenio.id" :key="duenio.id">
                  {{ duenio.persona.nombre }} {{ duenio.persona.apellido }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Dirección</ion-label>
              <ion-input type="text" v-model="form.direccion"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label>Registrar nuevo dueño</ion-label>
              <ion-toggle v-model="registrarNuevoDuenio"></ion-toggle>
            </ion-item>

            <div v-if="registrarNuevoDuenio">
              <ion-item>
                <ion-label position="floating">Nombre</ion-label>
                <ion-input type="text" v-model="nuevoDuenio.nombre"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Apellido</ion-label>
                <ion-input type="text" v-model="nuevoDuenio.apellido"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">RUT</ion-label>
                <ion-input type="text" v-model="nuevoDuenio.rut"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Teléfono</ion-label>
                <ion-input type="text" v-model="nuevoDuenio.telefono"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input type="email" v-model="nuevoDuenio.email"></ion-input>
              </ion-item>
            </div>
          </ion-list>
          <ion-button expand="full" @click="registrarPredio">Registrar</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { IonModal, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonButtons, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonToggle } from '@ionic/vue';
import Predios from '@/components/PrediosComponente.vue';
import axios from 'axios';

//Variables
const URL_API = import.meta.env.VITE_URL_API;
const predios = ref<Predio[]>([]);
const duenios = ref<Duenio[]>([]);
const isModalOpen = ref<boolean>(false);
const registrarNuevoDuenio = ref<boolean>(false);
const form = ref({
  duenio_id: null,
  direccion: ''
});
const nuevoDuenio = ref({
  nombre: '',
  apellido: '',
  rut: '',
  telefono: '',
  email: ''
});

//Interfaces
interface Predio {
  id: number;
  duenio_id: number;
  direccion: string;
  estado: number;
  duenio: Duenio;
}

interface Duenio {
  id: number;
  persona_id: number;
  estado: number;
  persona: Persona;
}

interface Persona {
  id: number;
  usuario_id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  estado: number;
  usuario: Usuario;
}

interface Usuario {
  id: number;
  email: string;
  password: string;
  estado: number;
}

//Metodos
const getPredios = () => {
  axios.get(`${URL_API}/predios`)
    .then((response) => {
      if (response) {
        console.log("Predios", response.data);
        predios.value = response.data.filter((predio:Predio) => predio.estado === 1);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getDuenios = () => {
  axios.get(`${URL_API}/duenios`)
    .then((response) => {
      if (response) {
        console.log("Duenios", response.data);
        duenios.value = response.data.filter((duenio:Duenio) => duenio.estado === 1);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const registrarPredio = async () => {
  try {
    if (registrarNuevoDuenio.value) {
      const duenioResponse = await axios.post(`${URL_API}/duenios`, {
        nombre: nuevoDuenio.value.nombre,
        apellido: nuevoDuenio.value.apellido,
        rut: nuevoDuenio.value.rut,
        telefono: nuevoDuenio.value.telefono,
        email: nuevoDuenio.value.email
      });
      form.value.duenio_id = duenioResponse.data.id;
    }

    await axios.post(`${URL_API}/predios`, {
      duenio_id: form.value.duenio_id,
      direccion: form.value.direccion
    });
    getPredios();
    cerrarFormulario();
  } catch (error) {
    console.log(error);
  }
};

const abrirFormulario = ():void => {
  isModalOpen.value = true;
};

const cerrarFormulario = ():void => {
  isModalOpen.value = false;
  form.value = { duenio_id: null, direccion: '' };
  nuevoDuenio.value = { nombre: '', apellido: '', rut: '', telefono: '', email: '' };
  registrarNuevoDuenio.value = false;
};

onBeforeMount(() => {
  getPredios();
  getDuenios();
});
</script>

<style scoped> 
.header-toolbar {
  --background: #04402A;
  --color: #ffffff;
}

.header-title {
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
