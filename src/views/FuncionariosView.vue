<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Funcionarios</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirFormulario" fill="clear" color="light">
            <ion-icon slot="start" :icon="addCircleOutline" color="light"/>
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
            <p class="loading-text">Cargando funcionarios...</p>
          </ion-col>
        </ion-row>
        
        <!-- Lista de Funcionarios Activos -->
        <ion-row v-else>
          <ion-col 
            v-for="funcionario in funcionarios"
            size="12" 
            size-md="6" 
            size-lg="4"  
            :key="funcionario.id"
          >
            <FuncionarioModal
              :id="funcionario.id" 
              :nombre="funcionario.persona?.nombre || ''" 
              :apellido="funcionario.persona?.apellido || ''" 
              :rol="funcionario.rol?.nombre || ''"
              :rol_id="funcionario.rol_id"
              :rut="funcionario.persona?.rut || ''"
              :telefono="funcionario.persona?.telefono || ''"
              :email="funcionario.persona?.usuario?.email || ''"
              @deshabilitarFuncionario="deshabilitarFuncionario"
              @vincularTrampas="vincularFuncionarioTrampa"
              @desvincularTrampa="desvincularFuncionarioTrampa"
            />
          </ion-col>
        </ion-row>

        <!-- Sin datos -->
        <ion-row v-if="!isLoading && funcionarios.length === 0">
          <ion-col size="12" class="no-data">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <h3>Sin funcionarios</h3>
            <p>No se encontraron funcionarios registrados.</p>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modal para registro de nuevo funcionario -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarFormulario" class="details-modal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrar Funcionario</ion-title>
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
                  <ion-icon :icon="personOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Nombre</ion-label>
                  <ion-input 
                    type="text" 
                    v-model="form.nombre"
                    :class="{'ion-invalid': errores.nombre, 'ion-valid': form.nombre && !errores.nombre}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.nombre">{{ errores.nombre }}</div>
                </ion-item>
            
                <ion-item>
                  <ion-icon :icon="personOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Apellido</ion-label>
                  <ion-input 
                    type="text" 
                    v-model="form.apellido"
                    :class="{'ion-invalid': errores.apellido, 'ion-valid': form.apellido && !errores.apellido}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.apellido">{{ errores.apellido }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Email</ion-label>
                  <ion-input 
                    type="email" 
                    v-model="form.email"
                    :class="{'ion-invalid': errores.email, 'ion-valid': form.email && !errores.email}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.email">{{ errores.email }}</div>
                </ion-item>
            
                <ion-item>
                  <ion-icon :icon="callOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Teléfono</ion-label>
                  <ion-input 
                    type="tel" 
                    v-model="form.telefono"
                    :class="{'ion-invalid': errores.telefono, 'ion-valid': form.telefono && !errores.telefono}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.telefono">{{ errores.telefono }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="idCardOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">RUT</ion-label>
                  <ion-input 
                    type="text" 
                    v-model="form.rut"
                    :class="{'ion-invalid': errores.rut, 'ion-valid': form.rut && !errores.rut}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.rut">{{ errores.rut }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="briefcaseOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Rol</ion-label>
                  <ion-select 
                    v-model="form.rol_id" 
                    placeholder="Selecciona un rol"
                    :class="{'ion-invalid': errores.rol_id, 'ion-valid': form.rol_id && !errores.rol_id}"
                  >
                    <ion-select-option v-for="rol in roles" :value="rol.id" :key="rol.id">{{ rol.nombre }}</ion-select-option>
                  </ion-select>
                  <div class="error-message" v-if="errores.rol_id">{{ errores.rol_id }}</div>
                </ion-item>

                <ion-item>
                  <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                  <ion-label position="stacked">Contraseña</ion-label>
                  <ion-input 
                    type="password" 
                    v-model="form.password"
                    :class="{'ion-invalid': errores.password, 'ion-valid': form.password && !errores.password}"
                  ></ion-input>
                  <div class="error-message" v-if="errores.password">{{ errores.password }}</div>
                </ion-item>
              </ion-list>

              <div class="form-actions">
                <ion-button 
                  expand="block" 
                  @click="registrarFuncionario" 
                  class="submit-button"
                  :disabled="!formularioValido || isSubmitting"
                >
                  <ion-spinner name="dots" v-if="isSubmitting"></ion-spinner>
                  <template v-else>
                    <ion-icon :icon="saveOutline" slot="start"></ion-icon>
                    Registrar Funcionario
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
import FuncionarioModal from '@/components/FuncionarioComponente.vue';
import axios from 'axios';
import { Funcionario } from '@/interfaces/interfaces';
import {
  addCircleOutline,
  closeOutline,
  personOutline,
  mailOutline,
  callOutline,
  idCardOutline,
  briefcaseOutline,
  lockClosedOutline,
  saveOutline,
  alertCircleOutline
} from 'ionicons/icons';

//Variables
const URL_API:string = import.meta.env.VITE_URL_API;
const isModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const isToastOpen = ref<boolean>(false);
const toastMessage = ref<string>('');

// Estado para el seguimiento de los funcionarios que se están deshabilitando
const disablingStatus = ref<{[key: number]: boolean}>({});

const deshabilitarFuncionario = async(id: number): Promise<void> => {
  if (!id) {
    toastMessage.value = "Error: ID de funcionario no válido";
    isToastOpen.value = true;
    return;
  }
  
  // Marcar el funcionario como "en proceso de deshabilitación"
  disablingStatus.value[id] = true;
  
  try {
    const response = await axios.put(`${URL_API}/funcionarios/${id}`, {
      estado: 0
    });
    
    console.log('Respuesta al deshabilitar:', response);
    
    if (response.status === 200 || response.status === 204) {
      toastMessage.value = "Funcionario deshabilitado exitosamente";
      isToastOpen.value = true;
      // Recargar la lista de funcionarios
      await getFuncionarios();
    } else {
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al deshabilitar funcionario:', error);
    toastMessage.value = "Error al deshabilitar el funcionario";
    isToastOpen.value = true;
  } finally {
    // Eliminar el estado de este funcionario
    delete disablingStatus.value[id];
  }
};

const vincularFuncionarioTrampa = async (payload: { funcionarioId: number, trampaId: number, rol_id: number }): Promise<void> => {
  try {
    const response = await axios.post(`${URL_API}/funcionarios_has_trampas`, {
      funcionario_id: payload.funcionarioId,
      trampa_id: payload.trampaId,
      rol_id: payload.rol_id
    });
    
    if (response.status === 200 || response.status === 201) {
      toastMessage.value = "Funcionario vinculado a la trampa exitosamente";
      isToastOpen.value = true;
    } else {
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al vincular funcionario con trampa:', error);
    toastMessage.value = "Error al vincular funcionario con trampa";
    isToastOpen.value = true;
  }
};

const desvincularFuncionarioTrampa = async (payload: { funcionario_has_trampaId: number}): Promise<void> => {
  try {
    const response = await axios.delete(`${URL_API}/funcionarios_has_trampas/${payload.funcionario_has_trampaId}`);
    
    if (response.status === 200 || response.status === 204) {
      toastMessage.value = "Trampa desvinculada exitosamente";
      isToastOpen.value = true;
    } else {
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al desvincular trampa:', error);
    toastMessage.value = "Error al desvincular la trampa";
    isToastOpen.value = true;
  }
};

const funcionarios = ref<Funcionario[]>([]);
const roles = ref<{id: number, nombre: string}[]>([
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Técnico' },
  { id: 3, nombre: 'Operador' }
]);

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rut: '',
  rol_id: '',
  password: ''
});

// Validación de formulario
interface Errores {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rut: string;
  rol_id: string;
  password: string;
}

const errores = ref<Errores>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rut: '',
  rol_id: '',
  password: ''
});

// Función para comprobar si el formulario es válido
const formularioValido = computed(() => {
  return form.value.nombre && 
         form.value.apellido && 
         form.value.email &&
         form.value.telefono &&
         form.value.rut &&
         form.value.rol_id &&
         form.value.password && 
         !errores.value.nombre && 
         !errores.value.apellido && 
         !errores.value.email &&
         !errores.value.telefono &&
         !errores.value.rut &&
         !errores.value.rol_id &&
         !errores.value.password;
});

// Validación de campos individuales
const validarCampo = (campo: string) => {
  switch(campo) {
    case 'nombre':
      if (!form.value.nombre) {
        errores.value.nombre = 'El nombre es requerido';
      } else if (form.value.nombre.length < 2) {
        errores.value.nombre = 'El nombre debe tener al menos 2 caracteres';
      } else {
        errores.value.nombre = '';
      }
      break;
    case 'apellido':
      if (!form.value.apellido) {
        errores.value.apellido = 'El apellido es requerido';
      } else if (form.value.apellido.length < 2) {
        errores.value.apellido = 'El apellido debe tener al menos 2 caracteres';
      } else {
        errores.value.apellido = '';
      }
      break;
    case 'email':
      if (!form.value.email) {
        errores.value.email = 'El email es requerido';
      } else {
        errores.value.email = '';
      }
      break;
    case 'telefono':
      if (!form.value.telefono) {
        errores.value.telefono = 'El teléfono es requerido';
      } else {
        errores.value.telefono = '';
      }
      break;
    case 'rut':
      if (!form.value.rut) {
        errores.value.rut = 'El RUT es requerido';
      } else {
        errores.value.rut = '';
      }
      break;
    case 'rol_id':
      if (!form.value.rol_id) {
        errores.value.rol_id = 'Debe seleccionar un rol';
      } else {
        errores.value.rol_id = '';
      }
      break;
    case 'password':
      if (!form.value.password) {
        errores.value.password = 'La contraseña es requerida';
      } else if (form.value.password.length < 1) {
        errores.value.password = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        errores.value.password = '';
      }
      break;
  }
};

// Validar todo el formulario
const validarFormulario = () => {
  validarCampo('nombre');
  validarCampo('apellido');
  validarCampo('email');
  validarCampo('telefono');
  validarCampo('rut');
  validarCampo('rol_id');
  validarCampo('password');
  
  return formularioValido.value;
};

const getFuncionarios = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL_API}/funcionarios`);
    
    if (response && response.data) {
      console.log("Datos de funcionarios recibidos:", response.data);
      console.log("Total de funcionarios recibidos:", response.data.length);
      
      // Filtrar solo funcionarios activos
      funcionarios.value = response.data.filter((funcionario: Funcionario) => 
        funcionario.estado === 1
      );
      
      console.log("Funcionarios activos:", funcionarios.value);
    }
  } catch (error) {
    console.error('Error al obtener funcionarios:', error);
    toastMessage.value = "Error al cargar los funcionarios";
    isToastOpen.value = true;
  } finally {
    isLoading.value = false;
  }
};

const registrarFuncionario = async ():Promise<void> => {
  if (!validarFormulario()) {
    toastMessage.value = "Por favor, corrija los errores del formulario";
    isToastOpen.value = true;
    return;
  }

  try {
    isSubmitting.value = true;
    
    const responseFuncionario = await axios.post(`${URL_API}/funcionarios`, {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      telefono: form.value.telefono,
      rut: form.value.rut,
      rol: form.value.rol_id,
      password: form.value.password
    });

    console.log('Funcionario registrado:', responseFuncionario);
    if (responseFuncionario.status !== 200) {
      throw new Error('Error al registrar el funcionario');
    }
    // Simulamos respuesta exitosa
    setTimeout(() => {
      getFuncionarios();
      toastMessage.value = "Funcionario registrado exitosamente";
      isToastOpen.value = true;
      
      // Limpiar el formulario
      form.value = {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        rol_id: '',
        password: ''
      };
      
      cerrarFormulario();
      isSubmitting.value = false;
    }, 1000);
    
  } catch (e) {
    console.log(e);
    toastMessage.value = "Error al registrar el funcionario";
    isToastOpen.value = true;
    isSubmitting.value = false;
  }
};

const abrirFormulario = ():void => {
  isModalOpen.value = true;
};

const cerrarFormulario = ():void => {
  isModalOpen.value = false;
  
  // Limpiar errores al cerrar
  errores.value = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    rol_id: '',
    password: ''
  };
};

onBeforeMount(() => {
  getFuncionarios();
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
