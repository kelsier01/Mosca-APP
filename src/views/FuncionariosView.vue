<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Funcionarios</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario">Registrar Funcionario</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="4" v-for="funcionario in funcionarios" :key="funcionario.id">
            <Funcionario 
              :nombre="funcionario.persona.nombre" 
              :apellido="funcionario.persona.apellido" 
              :rol="funcionario.rol.nombre" 
              :rut="funcionario.persona.rut"
              :telefono="funcionario.persona.telefono"
              :email="funcionario.persona.usuario.email"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

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
              <ion-label position="floating">Nombre</ion-label>
              <ion-input type="email" v-model="form.email"></ion-input>
            </ion-item>
          
            <ion-item>
              <ion-label position="floating">Apellido</ion-label>
              <ion-input type="text" v-model="form.password"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input type="email" v-model="form.email"></ion-input>
            </ion-item>
          
            <ion-item>
              <ion-label position="floating">Telefono</ion-label>
              <ion-input type="email" v-model="form.email"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label>Rol</ion-label>
              <ion-select v-model="form.predio" placeholder="Selecciona un predio">
                <ion-select-option value="Predio 1">Predio 1</ion-select-option>
                <ion-select-option value="Predio 2">Predio 2</ion-select-option>
                <ion-select-option value="Predio 3">Predio 3</ion-select-option>
              </ion-select>
            </ion-item>

          </ion-list>
          <ion-button expand="full" @click="registrarTrampa">Registrar</ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { IonModal, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonButtons } from '@ionic/vue';
import Funcionario from '@/components/Funcionario.vue';
import axios from 'axios';

const URL_API = import.meta.env.VITE_URL_API;
const funcionarios = ref([]);

const getFuncionarios = () =>{
  axios.get(`${URL_API}/funcionarios`)
    .then((response)=>{
      if(response){
        funcionarios.value = response.data.filter((funcionario)=>funcionario.estado == 1);
        console.log(funcionarios.value)
      }
    })
    .catch((e)=>{
      console.log(e);
    });
}

const form = ref({
  email: '',
  password: '',
  predio: '',
  macAddress: '',
  modelo: '',
  coordenadas: '',
});

const isModalOpen = ref(false);
const abrirFormulario = () => {
  isModalOpen.value = true;
};
const cerrarFormulario = () => {
  isModalOpen.value = false;
};
const registrarTrampa = () => {
  console.log('Datos de la trampa:', form.value);
  cerrarFormulario();
};

onBeforeMount(()=>{
  getFuncionarios();
})
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
