<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Trampas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario" fill="clear" color="light">
            <ion-icon slot="start" :icon="addCircleOutline" color="light"></ion-icon>
            <span style="color: #ffffff;">Registrar Trampa</span>
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
            <p class="loading-text">Cargando trampas...</p>
          </ion-col>
        </ion-row>
        
        <!-- Lista de Trampas Activas -->
        <ion-row v-else>
          <ion-col 
            v-for="trampa in trampas" 
            size="12" 
            size-md="6" 
            size-lg="4" 
            :key="trampa.id"
          >
            <ion-card class="trampa-card">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="appsOutline" class="title-icon"></ion-icon>
                  {{ trampa.modelo }}
                </ion-card-title>
                <ion-card-subtitle>{{ trampa.predio.direccion }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p class="card-info">
                  <ion-icon :icon="personOutline"></ion-icon> 
                  <strong>Usuario:</strong> {{ trampa.usuario.email }}
                </p>
                <p class="card-info">
                  <ion-icon :icon="hardwareChipOutline"></ion-icon> 
                  <strong>MAC:</strong> {{ trampa.direccion_mac }}
                </p>
                <p class="card-info">
                  <ion-icon :icon="locationOutline"></ion-icon> 
                  <strong>Coordenadas:</strong> {{ trampa.coordenadas }}
                </p>
                <ion-button 
                  expand="block" 
                  color="danger" 
                  fill="outline" 
                  size="small"
                  class="disable-button" 
                  @click="disableTrampa(trampa.id)"
                  :disabled="disablingStatus[trampa.id]"
                >
                  <ion-spinner name="dots" v-if="disablingStatus[trampa.id]" color="danger" class="spinner-small"></ion-spinner>
                  <template v-else>
                    <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                    Deshabilitar
                  </template>
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        
        <!-- Sin datos -->
        <ion-row v-if="!isLoading && trampas.length === 0">
          <ion-col size="12" class="no-data">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <h3>Sin trampas</h3>
            <p>No se encontraron trampas registradas.</p>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal para registro de nueva trampa -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarFormulario" class="details-modal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrar Trampa</ion-title>
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
                  <ion-icon :icon="layersOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Modelo</ion-label>
                  <ion-input 
                    type="text" 
                    :value="modelo" 
                    @ionInput="(e: InputEvent) => {
                      const target = e.target as HTMLInputElement | null;
                      if (target) {
                        modelo = target.value;
                        validarCampo('modelo');
                      }
                    }"
                    :class="{'ion-invalid': errores.modelo, 'ion-valid': modelo && !errores.modelo}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.modelo">{{ errores.modelo }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="businessOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Predio</ion-label>
                  <ion-select 
                    :value="predio_id" 
                    @ionChange="(e: CustomEvent) => {
                      predio_id = e.detail.value;
                      validarCampo('predio_id');
                    }" 
                    placeholder="Selecciona un predio"
                    :class="{'ion-invalid': errores.predio_id, 'ion-valid': predio_id && !errores.predio_id}"
                  >
                    <ion-select-option v-for="predio in predios" :value="predio.id" :key="predio.id">{{ predio.direccion }}</ion-select-option>
                  </ion-select>
                  <div class="error-message" v-if="errores.predio_id">{{ errores.predio_id }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="hardwareChipOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Dirección MAC</ion-label>
                  <ion-input 
                    type="text" 
                    :value="direccion_mac" 
                    @ionInput="(e: InputEvent) => {
                      const target = e.target as HTMLInputElement | null;
                      if (target) {
                        direccion_mac = target.value;
                        validarCampo('direccion_mac');
                      }
                    }"
                    :class="{'ion-invalid': errores.direccion_mac, 'ion-valid': direccion_mac && !errores.direccion_mac}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.direccion_mac">{{ errores.direccion_mac }}</div>
                </ion-item>
          
                <ion-item>
                  <ion-icon :icon="locationOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Coordenadas</ion-label>
                  <ion-input 
                    type="text" 
                    :value="coordenadas" 
                    @ionInput="(e: InputEvent) => {
                      const target = e.target as HTMLInputElement | null;
                      if (target) {
                        coordenadas = target.value;
                        validarCampo('coordenadas');
                      }
                    }"
                    :class="{'ion-invalid': errores.coordenadas, 'ion-valid': coordenadas && !errores.coordenadas}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.coordenadas">{{ errores.coordenadas }}</div>
                </ion-item>
              </ion-list>
              
              <div class="form-actions">
                <ion-button 
                  expand="block" 
                  @click="registrarTrampa" 
                  class="submit-button"
                  :disabled="!formularioValido || isSubmitting"
                >
                  <ion-spinner name="dots" v-if="isSubmitting"></ion-spinner>
                  <template v-else>
                    <ion-icon :icon="saveOutline" slot="start"></ion-icon>
                    Registrar Trampa
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
import axios from 'axios';
import { Funcionario, Predio, Trampa } from '../interfaces/interfaces';
import {
  addCircleOutline,
  closeOutline,
  businessOutline,
  hardwareChipOutline,
  layersOutline,
  locationOutline,
  personOutline,
  trashOutline,
  saveOutline,
  alertCircleOutline,
  appsOutline
} from 'ionicons/icons';

const URL_API:string = import.meta.env.VITE_URL_API;
const trampas = ref<Trampa[]>([]);
const predios = ref<Predio[]>([]);
const funcionarios = ref<Funcionario[]>([]);

// Variables individuales para cada campo del formulario
const predio_id = ref<string>('');
const direccion_mac = ref<string>('');
const modelo = ref<string>('');
const coordenadas = ref<string>('');

// Estado del modal, toast y carga
const isModalOpen = ref<boolean>(false);
const isToastOpen = ref<boolean>(false);
const toastMessage = ref<string>('');
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const disablingStatus = ref<{[key: number]: boolean}>({});  // Objeto para manejar el estado de deshabilitación

// Validación de formulario
interface Errores {
  modelo: string;
  predio_id: string;
  direccion_mac: string;
  coordenadas: string;
}

const errores = ref<Errores>({
  modelo: '',
  predio_id: '',
  direccion_mac: '',
  coordenadas: ''
});

// Función para comprobar si el formulario es válido
const formularioValido = computed(() => {
  return modelo.value && 
         predio_id.value && 
         direccion_mac.value && 
         coordenadas.value && 
         !errores.value.modelo && 
         !errores.value.predio_id && 
         !errores.value.direccion_mac && 
         !errores.value.coordenadas;
});

// Validación de campos individuales
const validarCampo = (campo: string) => {
  switch(campo) {
    case 'modelo':
      if (!modelo.value) {
        errores.value.modelo = 'El modelo es requerido';
      } else if (modelo.value.length < 2) {
        errores.value.modelo = 'El modelo debe tener al menos 2 caracteres';
      } else {
        errores.value.modelo = '';
      }
      break;
    case 'predio_id':
      if (!predio_id.value) {
        errores.value.predio_id = 'Debe seleccionar un predio';
      } else {
        errores.value.predio_id = '';
      }
      break;
    case 'direccion_mac':
      // Validación simple - solo verifica que no esté vacío
      if (!direccion_mac.value) {
        errores.value.direccion_mac = 'La dirección MAC es requerida';
      } else {
        errores.value.direccion_mac = '';
      }
      break;
    case 'coordenadas':
      // Validación simple - solo verifica que no esté vacío
      if (!coordenadas.value) {
        errores.value.coordenadas = 'Las coordenadas son requeridas';
      } else {
        errores.value.coordenadas = '';
      }
      break;
  }
};

// Validar todo el formulario
const validarFormulario = () => {
  validarCampo('modelo');
  validarCampo('predio_id');
  validarCampo('direccion_mac');
  validarCampo('coordenadas');
  
  return formularioValido.value;
};

const getFuncionarios = () => {
  axios.get(`${URL_API}/funcionarios`)
    .then((response) => {
      if (response) {
        console.log("Funcionarios", response.data);
        funcionarios.value = response.data.filter((funcionario:Funcionario)=> funcionario.estado == 1);
        console.log(funcionarios.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getTrampas = () => {
  isLoading.value = true;
  axios.get(`${URL_API}/trampas`)
    .then((response) => {
      if (response) {
        console.log("Trampas", response.data);
        // Ya no necesitamos mapear y agregar isDisabling
        trampas.value = response.data.filter((trampa:Trampa) => trampa.estado == 1);
        console.log(trampas.value);
      }
    })
    .catch((e) => {
      console.log(e);
      toastMessage.value = "Error al cargar las trampas";
      isToastOpen.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getPredios = () => {
  axios.get(`${URL_API}/predios`)
    .then((response) => {
      if (response) {
        console.log("Predios", response.data);
        predios.value = response.data;
        console.log(predios.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const postTrampa = async () => {
  if (!validarFormulario()) {
    toastMessage.value = "Por favor, corrija los errores del formulario";
    isToastOpen.value = true;
    return;
  }

  try {
    isSubmitting.value = true;
    
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
    
    // Limpiar el formulario
    predio_id.value = '';
    direccion_mac.value = '';
    modelo.value = '';
    coordenadas.value = '';
    
    cerrarFormulario();
  } catch (e) {
    console.log(e);
    toastMessage.value = "Error al registrar la trampa";
    isToastOpen.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const disableTrampa = async (trampaId: number) => {
  // Usamos el objeto disablingStatus para marcar la trampa como "deshabilitando"
  disablingStatus.value[trampaId] = true;
  
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
    toastMessage.value = "Error al deshabilitar la trampa";
    isToastOpen.value = true;
  } finally {
    // Eliminamos el estado de esta trampa, ya que ya no debería estar en la lista después de getTrampas()
    delete disablingStatus.value[trampaId];
  }
};

const abrirFormulario = ():void => {
  isModalOpen.value = true;
};

const cerrarFormulario = ():void => {
  isModalOpen.value = false;
};

const registrarTrampa = async () => {
  await postTrampa();
};

onBeforeMount(() => {
  getFuncionarios();
  getPredios();
  getTrampas();
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

/* Tarjeta de trampa */
.trampa-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
}

.trampa-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(29, 92, 65, 0.15);
}

ion-card-header {
  padding: 16px 16px 8px;
}

.title-icon {
  font-size: 16px;
  margin-right: 6px;
}

ion-card-title {
  font-weight: 600;
  color: #1d5c41;
  font-size: 16px;
  display: flex;
  align-items: center;
}

ion-card-subtitle {
  color: var(--text-medium);
  font-size: 14px;
  margin-top: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  margin: 8px 0;
  color: var(--text-medium);
}

.card-info ion-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #1d5c41;
}

.disable-button {
  margin-top: 12px;
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
