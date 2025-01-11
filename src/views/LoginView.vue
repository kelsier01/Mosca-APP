<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Contenedor de login -->
      <div class="login-container">
        <div class="logo-container">
          <!-- Logo -->
          <img src="../../public/logo-santotomas.png" alt="Logo" class="logo" />
        </div>
        <ion-card class="login-card">
          <ion-card-header>
            <ion-card-title class="card-title">Iniciar Sesión</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item class="input-item">
              <ion-input
                v-model="email"
                type="email"
                placeholder="Correo Electrónico"
                class="custom-input"
              ></ion-input>
            </ion-item>
            <ion-item class="input-item">
              <ion-input
                v-model="password"
                type="password"
                placeholder="Contraseña"
                class="custom-input"
              ></ion-input>
            </ion-item>
            <ion-button expand="block" @click="login" class="login-button">
              Iniciar Sesión
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Manteniendo tu script intacto
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/vue';
import axios from 'axios';

const URL_API = import.meta.env.VITE_URL_API;
const email = ref('');
const password = ref('');
const router = useRouter();

const login = () => {
  if (email.value && password.value) {
    console.log(`Email: ${email.value}, Password: ${password.value}`);
    axios.post(`${URL_API}/auth/login`, 
    { email: email.value, 
      password: password.value 
    })
      .then((response) => {
        if (response.status === 200) {
          router.push('/tabs/dashboard');
        }
      });
  } else {
    alert('Por favor completa ambos campos');
  }
};
</script>

<style scoped>
/* Contenedor general */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

/* Logo */
.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 300px;
  height: auto;
}

/* Estilo de la tarjeta */
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #01261C;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Títulos */
.card-title {
  text-align: center;
  color: #F2F2F2;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Inputs */
.input-item {
  --background: transparent;
  --color: #F2F2F2;
  border-bottom: 1px solid #92A69E;
}

.custom-input {
  --color: #F2F2F2;
  font-size: 1rem;
}

/* Botón */
.login-button {
  background-color: #04402A;
  color: #F2F2F2;
  font-weight: bold;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #01261C;
}

/* Responsivo */
@media (max-width: 768px) {
  .login-card {
    padding: 15px;
  }

  .card-title {
    font-size: 1.25rem;
  }
}
</style>
