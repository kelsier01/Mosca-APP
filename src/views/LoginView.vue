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
            <!-- Mensaje de error -->
            <div v-if="errorMensaje" class="error-mensaje">
              {{ errorMensaje }}
            </div>
            
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
            <ion-button expand="block" @click="login" class="login-button" :disabled="isLoading">
              <ion-spinner v-if="isLoading" name="crescent" class="login-spinner"></ion-spinner>
              <span v-else>Iniciar Sesión</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
      
      <!-- Alerta de error -->
      <ion-alert
        :is-open="mostrarAlerta"
        header="Error de Acceso"
        :message="errorMensaje"
        :buttons="[{text: 'Aceptar', cssClass: 'alert-button-confirm'}]"
        @didDismiss="mostrarAlerta = false"
      ></ion-alert>
      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const URL_API:string = import.meta.env.VITE_URL_API;
const email = ref<string>('');
const password = ref<string>('');
const router = useRouter();
const isLoading = ref<boolean>(false);
const errorMensaje = ref<string>('');
const mostrarAlerta = ref<boolean>(false);

const login = async () => {
  // Limpiar mensaje de error previo
  errorMensaje.value = '';
  
  if (!email.value || !password.value) {
    errorMensaje.value = 'Por favor completa ambos campos';
    mostrarAlerta.value = true;
    return;
  }
  
  try {
    isLoading.value = true;
    
    const response = await axios.post(`${URL_API}/auth/login`, {
      email: email.value,
      password: password.value
    });
    
    if (response.status === 200 && response.data) {
      // Login exitoso
      router.push('/tabs/dashboard');
    } else {
      // Respuesta inesperada
      errorMensaje.value = 'Error al iniciar sesión. Inténtalo nuevamente.';
      mostrarAlerta.value = true;
    }
    
  } catch (error: any) {
    console.error('Error de login:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        errorMensaje.value = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.response.status === 404) {
        errorMensaje.value = 'Usuario no encontrado.';
      } else {
        errorMensaje.value = error.response.data?.message || 'Error al iniciar sesión. Inténtalo nuevamente.';
      }
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      errorMensaje.value = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Error al configurar la solicitud
      errorMensaje.value = 'Error al procesar la solicitud. Inténtalo más tarde.';
    }
    
    mostrarAlerta.value = true;
  } finally {
    isLoading.value = false;
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

.login-button:hover:not(.button-disabled) {
  background-color: #01261C;
}

/* Mensaje de error */
.error-mensaje {
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 16px;
  font-size: 0.9rem;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 8px;
  border-radius: 8px;
}

/* Spinner de carga */
.login-spinner {
  color: #F2F2F2;
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
