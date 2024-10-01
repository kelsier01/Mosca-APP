<template>
    <ion-page>
      <ion-content :fullscreen="true" class="ion-padding">
        <!-- Contenedor de login -->
        <div class="login-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title style="text-align: center;">Iniciar Sesión</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item>
                <!-- <ion-label position="floating">Correo Electrónico</ion-label> -->
                <ion-input v-model="email" type="email" placeholder="Ingresa tu correo"></ion-input>
              </ion-item>
  
              <ion-item>
                <!-- <ion-label position="floating">Contraseña</ion-label> -->
                <ion-input v-model="password" type="password" placeholder="Ingresa tu contraseña"></ion-input>
              </ion-item>
  
              <ion-button expand="block" @click="login">Iniciar Sesión</ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/vue';
  
  // Variables reactivas para el correo y la contraseña
  const email = ref('');
  const password = ref('');

  // Route
  const router = useRouter();
  
  // Función de login (aquí puedes agregar la lógica para autenticar al usuario)
  const login = () => {
    if (email.value && password.value) {
      console.log(`Email: ${email.value}, Password: ${password.value}`);
      // Aquí iría la lógica de autenticación (por ejemplo, llamar a una API)
      router.push('/tabs/tab1');
    } else {
      alert('Por favor completa ambos campos');
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  ion-card {
    width: 100%;
    max-width: 400px;
  }
  </style>
  