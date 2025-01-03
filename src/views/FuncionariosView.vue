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
            <ion-title>Registrar Funcionario</ion-title>
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
              <ion-select v-model="form.predio" placeholder="Selecciona un rol">
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
import Funcionario from '@/components/FuncionarioComponente.vue';
import axios from 'axios';

//Variables
const URL_API = import.meta.env.VITE_URL_API;
const isModalOpen = ref<boolean>(false);
const form = ref({
  email: '',
  password: '',
  predio: '',
  macAddress: '',
  modelo: '',
  coordenadas: '',
});
const funcionarios = ref<FuncionarioInterface[]>([]);

//Interface
interface FuncionarioInterface {
  id: number;
  persona_id: number;
  rol_id: number;
  estado: number;
  persona: Persona;
  rol: Rol;
}

interface Persona {
  id: number;
  usuario_id: number;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  usuario: Usuario;
}

interface Usuario {
  id: number;
  email: string;
  password: string;
  estado: number;
}

interface Rol {
  id: number;
  nombre: string;
  estado: number;
}

const getFuncionarios = ():void =>{
  axios.get(`${URL_API}/funcionarios`)
    .then((response)=>{
      if(response){
        console.log("Funcionarios", response.data);
        funcionarios.value = response.data.filter((funcionario:FuncionarioInterface)=>funcionario.estado == 1);
        console.log(funcionarios.value)
      }
    })
    .catch((e)=>{
      console.log(e);
    });
}

const abrirFormulario = ():void => {
  isModalOpen.value = true;
};
const cerrarFormulario = ():void => {
  isModalOpen.value = false;
};
const registrarTrampa = ():void => {
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
