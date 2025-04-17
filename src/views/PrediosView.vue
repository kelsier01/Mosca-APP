<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Predios</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario" fill="clear" color="light">
            <ion-icon slot="start" :icon="addCircleOutline" color="light"></ion-icon>
            <span style="color: #ffffff;">Registrar Predio</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <!-- Indicador de carga -->
        <ion-row v-if="isLoading">
          <ion-col size="12" class="loading-indicator">
            <ion-spinner name="dots"></ion-spinner>
            <p class="loading-text">Cargando predios...</p>
          </ion-col>
        </ion-row>
        
        <!-- Lista de Predios Activos -->
        <ion-row v-else>
          <ion-col 
            size="12" 
            size-md="6" 
            size-lg="4" 
            v-for="predio in predios" 
            :key="predio.id"
          >
            <PrediosComponent 
              :rut="predio.duenio?.persona.rut"
              :nombre="predio.duenio?.persona.nombre" 
              :apellido="predio.duenio?.persona.apellido"
              :telefono="predio.duenio?.persona.telefono"
              :email="predio.duenio?.persona.usuario?.email"
              :direccion="predio?.direccion"
              :usuario_id="predio?.duenio?.persona?.usuario_id || ''"
              @deshabilitarPredio="() => deshabilitarPredio(predio.id)"
            />
          </ion-col>
        </ion-row>
        
        <!-- Sin datos -->
        <ion-row v-if="!isLoading && predios.length === 0">
          <ion-col size="12" class="no-data">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <h3>Sin predios</h3>
            <p>No se encontraron predios registrados.</p>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal para registro de nuevo predio -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarFormulario" class="details-modal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrar Predio</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarFormulario">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-card class="form-card">
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-icon :icon="businessOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Dirección del Predio</ion-label>
                  <ion-input 
                    type="text" 
                    v-model="form.direccion"
                    :class="{'ion-invalid': errores.direccion, 'ion-valid': form.direccion && !errores.direccion}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.direccion">{{ errores.direccion }}</div>
                </ion-item>
                
                <ion-item-divider class="ion-margin-top">
                  <ion-label>Información del dueño</ion-label>
                </ion-item-divider>
                
                <ion-item>
                  <ion-icon :icon="checkboxOutline" slot="start"></ion-icon>
                  <ion-label>Registrar nuevo dueño</ion-label>
                  <ion-toggle v-model="registrarNuevoDuenio"></ion-toggle>
                </ion-item>
                
                <ion-item v-if="!registrarNuevoDuenio">
                  <ion-icon :icon="personOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Seleccionar Dueño</ion-label>
                  <ion-select 
                    v-model="form.duenio_id" 
                    placeholder="Selecciona un dueño"
                    :class="{'ion-invalid': errores.duenio_id, 'ion-valid': form.duenio_id && !errores.duenio_id}"
                  >
                    <ion-select-option v-for="duenio in duenios" :value="duenio.id" :key="duenio.id">
                      {{ duenio.persona.nombre }} {{ duenio.persona.apellido }}
                    </ion-select-option>
                  </ion-select>
                  <div class="error-message" v-if="errores.duenio_id">{{ errores.duenio_id }}</div>
                </ion-item>
                
                <div v-if="registrarNuevoDuenio" class="nuevo-duenio-form">
                  <ion-item>
                    <ion-icon :icon="personOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Nombre</ion-label>
                    <ion-input 
                      type="text" 
                      v-model="nuevoDuenio.nombre"
                      :class="{'ion-invalid': errores.nuevoDuenio.nombre, 'ion-valid': nuevoDuenio.nombre && !errores.nuevoDuenio.nombre}"
                    ></ion-input>
                    <div class="error-message" v-if="errores.nuevoDuenio.nombre">{{ errores.nuevoDuenio.nombre }}</div>
                  </ion-item>
                  
                  <ion-item>
                    <ion-icon :icon="personOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Apellido</ion-label>
                    <ion-input 
                      type="text" 
                      v-model="nuevoDuenio.apellido"
                      :class="{'ion-invalid': errores.nuevoDuenio.apellido, 'ion-valid': nuevoDuenio.apellido && !errores.nuevoDuenio.apellido}"
                    ></ion-input>
                    <div class="error-message" v-if="errores.nuevoDuenio.apellido">{{ errores.nuevoDuenio.apellido }}</div>
                  </ion-item>
                  
                  <ion-item>
                    <ion-icon :icon="idCardOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">RUT</ion-label>
                    <ion-input 
                      type="text" 
                      v-model="nuevoDuenio.rut"
                      :class="{'ion-invalid': errores.nuevoDuenio.rut, 'ion-valid': nuevoDuenio.rut && !errores.nuevoDuenio.rut}"
                    ></ion-input>
                    <div class="error-message" v-if="errores.nuevoDuenio.rut">{{ errores.nuevoDuenio.rut }}</div>
                  </ion-item>
                  
                  <ion-item>
                    <ion-icon :icon="callOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Teléfono</ion-label>
                    <ion-input 
                      type="tel" 
                      v-model="nuevoDuenio.telefono"
                      :class="{'ion-invalid': errores.nuevoDuenio.telefono, 'ion-valid': nuevoDuenio.telefono && !errores.nuevoDuenio.telefono}"
                    ></ion-input>
                    <div class="error-message" v-if="errores.nuevoDuenio.telefono">{{ errores.nuevoDuenio.telefono }}</div>
                  </ion-item>
                  
                  <ion-item>
                    <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                    <ion-label position="stacked">Email</ion-label>
                    <ion-input 
                      type="email" 
                      v-model="nuevoDuenio.email"
                      :class="{'ion-invalid': errores.nuevoDuenio.email, 'ion-valid': nuevoDuenio.email && !errores.nuevoDuenio.email}"
                    ></ion-input>
                    <div class="error-message" v-if="errores.nuevoDuenio.email">{{ errores.nuevoDuenio.email }}</div>
                  </ion-item>
                </div>
              </ion-list>
              
              <div class="form-actions">
                <ion-button 
                  expand="block" 
                  @click="registrarPredio" 
                  class="submit-button"
                  :disabled="isSubmitting"
                >
                  <ion-spinner name="dots" v-if="isSubmitting"></ion-spinner>
                  <template v-else>
                    <ion-icon :icon="saveOutline" slot="start"></ion-icon>
                    Registrar Predio
                  </template>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
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
import { onBeforeMount, ref, computed } from 'vue';
import PrediosComponent from '@/components/PrediosComponente.vue';
import axios from 'axios';
import {
  addCircleOutline,
  closeOutline,
  businessOutline,
  personOutline,
  mailOutline,
  callOutline,
  idCardOutline,
  checkboxOutline,
  saveOutline,
  alertCircleOutline
} from 'ionicons/icons';

//Variables
const URL_API = import.meta.env.VITE_URL_API;
const predios = ref<Predio[]>([]);
const duenios = ref<Duenio[]>([]);
const isModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const isToastOpen = ref<boolean>(false);
const toastMessage = ref<string>('');
const registrarNuevoDuenio = ref<boolean>(false);

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

// Formularios y validación
const form = ref({
  duenio_id: null as number | null,
  direccion: ''
});

const nuevoDuenio = ref({
  nombre: '',
  apellido: '',
  rut: '',
  telefono: '',
  email: ''
});

interface Errores {
  direccion: string;
  duenio_id: string;
  nuevoDuenio: {
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    email: string;
  };
}

const errores = ref<Errores>({
  direccion: '',
  duenio_id: '',
  nuevoDuenio: {
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    email: ''
  }
});

// Validación del formulario
const formularioValido = computed(() => {
  if (!form.value.direccion) return false;
  
  if (registrarNuevoDuenio.value) {
    return nuevoDuenio.value.nombre && 
           nuevoDuenio.value.apellido && 
           nuevoDuenio.value.rut &&
           nuevoDuenio.value.telefono &&
           !errores.value.nuevoDuenio.nombre &&
           !errores.value.nuevoDuenio.apellido &&
           !errores.value.nuevoDuenio.rut &&
           !errores.value.nuevoDuenio.telefono;
  } else {
    return !!form.value.duenio_id;
  }
});

// Validación de campos individuales - mejorada
const validarCampo = (campo: string) => {
  switch(campo) {
    case 'direccion':
      if (!form.value.direccion.trim()) {
        errores.value.direccion = 'La dirección es requerida';
      } else if (form.value.direccion.trim().length < 5) {
        errores.value.direccion = 'La dirección debe tener al menos 5 caracteres';
      } else {
        errores.value.direccion = '';
      }
      break;
    case 'duenio_id':
      if (!registrarNuevoDuenio.value && !form.value.duenio_id) {
        errores.value.duenio_id = 'Debe seleccionar un dueño';
      } else {
        errores.value.duenio_id = '';
      }
      break;
    case 'nuevoDuenio.nombre':
      if (!nuevoDuenio.value.nombre.trim()) {
        errores.value.nuevoDuenio.nombre = 'El nombre es requerido';
      } else if (nuevoDuenio.value.nombre.trim().length < 2) {
        errores.value.nuevoDuenio.nombre = 'El nombre debe tener al menos 2 caracteres';
      } else {
        errores.value.nuevoDuenio.nombre = '';
      }
      break;
    case 'nuevoDuenio.apellido':
      if (!nuevoDuenio.value.apellido.trim()) {
        errores.value.nuevoDuenio.apellido = 'El apellido es requerido';
      } else if (nuevoDuenio.value.apellido.trim().length < 2) {
        errores.value.nuevoDuenio.apellido = 'El apellido debe tener al menos 2 caracteres';
      } else {
        errores.value.nuevoDuenio.apellido = '';
      }
      break;
    case 'nuevoDuenio.rut':
      if (!nuevoDuenio.value.rut.trim()) {
        errores.value.nuevoDuenio.rut = 'El RUT es requerido';
      } else if (!validarFormatoRut(nuevoDuenio.value.rut.trim())) {
        errores.value.nuevoDuenio.rut = 'Formato de RUT inválido (ej: 12345678-9)';
      } else {
        errores.value.nuevoDuenio.rut = '';
      }
      break;
    case 'nuevoDuenio.telefono':
      if (!nuevoDuenio.value.telefono.trim()) {
        errores.value.nuevoDuenio.telefono = 'El teléfono es requerido';
      } else if (nuevoDuenio.value.telefono.trim().length < 8) {
        errores.value.nuevoDuenio.telefono = 'El teléfono debe tener al menos 8 dígitos';
      } else {
        errores.value.nuevoDuenio.telefono = '';
      }
      break;
    case 'nuevoDuenio.email':
      // El email es opcional, pero si se proporciona, debe tener formato válido
      if (nuevoDuenio.value.email.trim() && !validarFormatoEmail(nuevoDuenio.value.email.trim())) {
        errores.value.nuevoDuenio.email = 'Formato de email inválido';
      } else {
        errores.value.nuevoDuenio.email = '';
      }
      break;
  }
};

// Funciones auxiliares de validación
const validarFormatoRut = (rut: string): boolean => {
  // Validación simple: al menos debe tener un guión y números
  return /^[0-9]{7,8}-[0-9kK]$/.test(rut);
};

const validarFormatoEmail = (email: string): boolean => {
  // Validación básica de formato de email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validar todo el formulario
const validarFormulario = () => {
  validarCampo('direccion');
  
  if (registrarNuevoDuenio.value) {
    validarCampo('nuevoDuenio.nombre');
    validarCampo('nuevoDuenio.apellido');
    validarCampo('nuevoDuenio.rut');
    validarCampo('nuevoDuenio.telefono');
    validarCampo('nuevoDuenio.email');
  } else {
    validarCampo('duenio_id');
  }
  
  return formularioValido.value;
};

//Metodos
const getPredios = () => {
  isLoading.value = true;
  axios.get(`${URL_API}/predios`)
    .then((response) => {
      if (response) {
        console.log("Predios", response.data);
        predios.value = response.data.filter((predio:Predio) => predio.estado === 1);
      }
    })
    .catch((e) => {
      console.log(e);
      toastMessage.value = "Error al cargar los predios";
      isToastOpen.value = true;
    })
    .finally(() => {
      isLoading.value = false;
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
      toastMessage.value = "Error al cargar los dueños";
      isToastOpen.value = true;
    });
};

const registrarPredio = async () => {
  // Validar el formulario antes de proceder
  if (!validarFormulario()) {
    toastMessage.value = "Por favor, corrija los errores del formulario";
    isToastOpen.value = true;
    return;
  }
  
  try {
    isSubmitting.value = true;
    let duenioId = form.value.duenio_id;
    
    console.log("Modo de registro:", registrarNuevoDuenio.value ? "Nuevo dueño" : "Dueño existente");
    console.log("ID del dueño inicial:", duenioId);
    
    // Si se está registrando un nuevo dueño
    if (registrarNuevoDuenio.value) {
      try {
        // 1. Crear Persona primero
        const personaResponse = await axios.post(`${URL_API}/personas`, {
          rut: nuevoDuenio.value.rut.trim(),
          nombre: nuevoDuenio.value.nombre.trim(),
          apellido: nuevoDuenio.value.apellido.trim(),
          telefono: nuevoDuenio.value.telefono.trim(),
          estado: 1
        });
        
        if (!personaResponse.data || !personaResponse.data.id) {
          throw new Error("Error al crear la persona. Respuesta inválida del servidor.");
        }
        
        const personaId = personaResponse.data.id;
        console.log("Persona creada con ID:", personaId);

        // 2. Crear Dueño
        const duenioResponse = await axios.post(`${URL_API}/duenios`, {
          persona_id: personaId,
          estado: 1
        });
        
        if (!duenioResponse.data || !duenioResponse.data.id) {
          throw new Error("Error al crear el dueño. Respuesta inválida del servidor.");
        }
        
        duenioId = duenioResponse.data.id;
        console.log("Dueño creado con ID:", duenioId);
      } catch (error) {
        console.error("Error en el proceso de crear dueño:", error);
        throw new Error("Falló la creación del dueño. Por favor, intente nuevamente.");
      }
    } else {
      // Verificar que duenioId sea válido cuando se usa un dueño existente
      if (!duenioId) {
        throw new Error("Debe seleccionar un dueño existente.");
      }
      
      console.log("Usando dueño existente con ID:", duenioId);
    }
  
    // Asegurarnos que tenemos un ID de dueño válido antes de continuar
    if (!duenioId) {
      throw new Error("No se pudo obtener un ID de dueño válido.");
    }
    
    console.log("ID del dueño final:", duenioId);
    console.log("Dirección del predio:", form.value.direccion.trim());
    
    // Crear el predio con el ID del dueño (ya sea nuevo o existente)
    const predioResponse = await axios.post(`${URL_API}/predios`, {
      duenio_id: duenioId,
      direccion: form.value.direccion.trim(),
      estado: 1
    });
    
    console.log("Respuesta de creación de predio:", predioResponse);
    
    if (predioResponse.status === 201 || predioResponse.status === 200) {
      toastMessage.value = "Predio registrado exitosamente";
      isToastOpen.value = true;
      await getPredios(); // Recargar la lista de predios
      cerrarFormulario();
    } else {
      throw new Error("Respuesta inesperada del servidor al crear el predio.");
    }
  } catch (error: any) {
    console.error("Error completo:", error);
    toastMessage.value = error.message || "Error al registrar el predio";
    isToastOpen.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const deshabilitarPredio = async (id: number) => {
  try {
    const response = await axios.put(`${URL_API}/predios/${id}`, {
      estado: 0
    });
    
    if (response.status === 200) {
      toastMessage.value = "Predio deshabilitado exitosamente";
      isToastOpen.value = true;
      getPredios(); // Actualizar lista
    }
  } catch (error) {
    console.log(error);
    toastMessage.value = "Error al deshabilitar el predio";
    isToastOpen.value = true;
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
  
  // Limpiar errores
  errores.value = {
    direccion: '',
    duenio_id: '',
    nuevoDuenio: {
      nombre: '',
      apellido: '',
      rut: '',
      telefono: '',
      email: ''
    }
  };
};

onBeforeMount(() => {
  getPredios();
  getDuenios();
});
</script>

<style scoped>
/* Estilos base */
:root {
  --primary-color: #1d5c41;
  --primary-light: rgba(29, 92, 65, 0.1);
  --primary-medium: rgba(29, 92, 65, 0.5);
  --text-dark: #333333;
  --text-medium: #666666;
  --text-light: #999999;
}

/* Encabezado */
.header-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Indicador de carga */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-indicator ion-spinner {
  --color: #1d5c41;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.loading-text {
  color: var(--text-medium);
  font-size: 16px;
}

/* No hay datos */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-medium);
}

.no-data ion-icon {
  color: var(--text-light);
  font-size: 48px;
  margin-bottom: 1rem;
}

.no-data h3 {
  margin: 0.5rem 0;
  font-weight: 600;
  color: var(--text-dark);
}

.no-data p {
  margin: 0;
  font-size: 16px;
}

/* Modal */
.details-modal {
  --border-radius: 16px 16px 0 0;
}

ion-modal ion-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.form-card {
  margin: 0;
  border-radius: 12px;
}

ion-item ion-icon {
  color: #1d5c41;
}

ion-item ion-label {
  color: var(--text-dark);
  font-weight: 500;
  margin-bottom: 4px;
}

.form-actions {
  margin-top: 16px;
}

.submit-button {
  --background: #1d5c41;
  --background-activated: #164732;
  --background-hover: #164732;
}

/* Validaciones de formulario */
.error-message {
  color: #d14836;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 16px;
}

ion-item.ion-invalid {
  --border-color: #d14836;
}

ion-item.ion-valid {
  --border-color: #1d5c41;
}

/* Formulario de nuevo dueño */
.nuevo-duenio-form {
  margin-top: 8px;
  padding-left: 8px;
  border-left: 2px solid #1d5c41;
}

/* Spinner pequeño para botones */
.spinner-small {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  ion-grid {
    padding: 12px;
  }
}
</style>
