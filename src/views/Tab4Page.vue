<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Funcionarios</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario">Registrar Funcionario</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="4" v-for="trampa in trampas" :key="trampa.nombre">
            <Funcionario 
              :nombre="trampa.nombre" 
              :modelo="trampa.modelo" 
              :email="trampa.email" 
              :predio="trampa.predio" 
              :macAddress="trampa.macAddress" 
              :coordenadas="trampa.coordenadas" 
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
import { ref } from 'vue';
import { IonModal, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonButtons } from '@ionic/vue';
import Funcionario from '@/components/Funcionario.vue';

const trampas = [
  { nombre: "Trampa Inteligente 1", modelo: "Modelo A", email: "example1@gmail.com", predio: "Predio 1", macAddress: "00:11:22:33:44:55", coordenadas: "Lat:123, Long:456" },
  // Agrega más trampas si necesitas
];

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

</script>
