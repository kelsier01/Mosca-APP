<template>
  <ion-card class="funcionario-card">
    <ion-card-header>
      <ion-card-title>
        <ion-icon :icon="personOutline" class="title-icon"></ion-icon>
        {{ `${nombre} ${apellido}` }}
      </ion-card-title>
      <ion-card-subtitle>{{ rol }}</ion-card-subtitle>
    </ion-card-header>
    
    <ion-card-content>
      <p class="card-info">
        <ion-icon :icon="mailOutline"></ion-icon> 
        <strong>Email:</strong> {{ email }}
      </p>
      <p class="card-info">
        <ion-icon :icon="callOutline"></ion-icon> 
        <strong>Teléfono:</strong> {{ telefono }}
      </p>
      
      <ion-button 
        expand="block" 
        fill="clear" 
        size="small"
        class="details-button" 
        @click="abrirModal"
      >
        <ion-icon :icon="eyeOutline" slot="start"></ion-icon>
        Ver detalles
      </ion-button>
    </ion-card-content>
    
    <!-- Modal para ver detalles del funcionario -->
    <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="cerrarModal" class="details-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Detalles del Funcionario</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal">
              <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card class="details-card">
          <ion-card-content>
            <ion-list lines="none">
              <ion-item>
                <ion-icon :icon="personOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Nombre completo</ion-label>
                <ion-note>{{ `${nombre} ${apellido}` }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-icon :icon="idCardOutline" slot="start"></ion-icon>
                <ion-label position="stacked">RUT</ion-label>
                <ion-note>{{ rut }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Email</ion-label>
                <ion-note>{{ email }}</ion-note>
              </ion-item>
              
              <ion-item>
                <ion-icon :icon="callOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Teléfono</ion-label>
                <ion-note>{{ telefono }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-icon :icon="briefcaseOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Rol</ion-label>
                <ion-note>{{ rol }}</ion-note>
              </ion-item>
            </ion-list>
            <!-- Botones de acción -->
            <div class="action-buttons">
              <ion-button 
                expand="block" 
                color="danger" 
                fill="outline" 
                @click="deshabilitarFuncionario"
                class="action-button"
              >
                <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                Deshabilitar funcionario
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
        
        <!-- Lista de trampas vinculadas -->
        <ion-card class="linked-traps-card" v-if="trampasFuncionario.length > 0">
          <ion-card-header>
            <ion-card-title class="linked-title">
              <ion-icon :icon="linkOutline"></ion-icon>
              Trampas Vinculadas
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="full">
              <ion-item v-for="trampa in trampasFuncionario" :key="trampa.id" class="linked-trap-item">
                <ion-icon :icon="hardwareChipOutline" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h3>{{ trampa.modelo }}</h3>
                  <p>MAC: {{ trampa.direccion_mac }}</p>
                  <p>Predio: {{ trampa.predio?.direccion || 'No especificado' }}</p>
                </ion-label>
                <ion-button 
                  fill="clear" 
                  color="danger" 
                  @click="desvincularTrampa(trampa.id)"
                  :disabled="desvincularLoading[trampa.id]"
                >
                  <ion-spinner v-if="desvincularLoading[trampa.id]" name="dots" color="danger"></ion-spinner>
                  <ion-icon v-else :icon="unlinkOutline"></ion-icon>
                </ion-button>
              </ion-item>
              
              <ion-item v-if="isLoadingVinculadas" class="loading-item">
                <ion-spinner name="dots" color="primary"></ion-spinner>
                <ion-label class="ion-padding-start">
                  Cargando trampas vinculadas...
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
        
        <!-- Tarjeta para vincular funcionario con trampa -->
        <ion-card class="link-card">
          <ion-card-header>
            <ion-card-title class="link-title">
              <ion-icon :icon="addCircleOutline"></ion-icon>
              Vincular Nueva Trampa
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-icon :icon="appsOutline" slot="start"></ion-icon>
                <ion-label position="stacked">Seleccionar Trampa</ion-label>
                <ion-select 
                  v-model="trampaSeleccionada"
                  placeholder="Seleccione una trampa"
                  interface="popover"
                  :disabled="isVinculando || !trampasFiltradas.length"
                >
                  <ion-select-option v-for="trampa in trampasFiltradas" :value="trampa.id" :key="trampa.id">
                    {{ trampa.modelo }} - {{ trampa.direccion_mac }}
                  </ion-select-option>
                </ion-select>
                <div v-if="!trampasFiltradas.length && !isLoadingTrampas" class="no-trampas-message">
                  No hay trampas disponibles para vincular
                </div>
                <div v-if="isLoadingTrampas" class="loading-message">
                  Cargando trampas...
                </div>
              </ion-item>
            </ion-list>
            
            <ion-button 
              expand="block"
              color="primary"
              class="vincular-button"
              :disabled="!trampaSeleccionada || isVinculando || !trampasFiltradas.length"
              @click="vincularFuncionario"
            >
              <ion-spinner name="dots" v-if="isVinculando" class="spinner-small"></ion-spinner>
              <template v-else>
                <ion-icon :icon="linkOutline" slot="start"></ion-icon>
                Vincular
              </template>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import {
  personOutline,
  mailOutline,
  callOutline,
  eyeOutline,
  closeOutline,
  idCardOutline,
  briefcaseOutline,
  trashOutline,
  linkOutline,
  unlinkOutline,
  appsOutline,
  addCircleOutline,
  hardwareChipOutline
} from 'ionicons/icons';

// Props
const props = withDefaults(defineProps<{
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  rut: string;
  telefono: string;
  email: string;
  rol_id: number;
}>(), {
  id: 0,
  nombre: '',
  apellido: '',
  rol: '',
  rut: '',
  telefono: '',
  email: '',
  rol_id: 0
});

// Definir los eventos que se emitirán al componente padre
const emit = defineEmits<{
  (e: 'deshabilitarFuncionario', id: number): void;
  (e: 'vincularTrampas', payload: { funcionarioId: number, trampaId: number, rol_id: number }): void;
  (e: 'desvincularTrampa', payload: { funcionario_has_trampaId: number }): void;
}>();

// Definir una interfaz para las trampas con información de vinculación
interface TrampaVinculada {
  id: number;
  modelo: string;
  direccion_mac: string;
  predio: any;
  vinculacion_id: number; // ID del registro funcionario_has_trampa
}

const isModalOpen = ref<boolean>(false);
const trampaSeleccionada = ref<number | null>(null);
const trampas = ref<any[]>([]);
const trampasFuncionario = ref<TrampaVinculada[]>([]); // Usamos la nueva interfaz
const isVinculando = ref<boolean>(false);
const isLoadingTrampas = ref<boolean>(false);
const isLoadingVinculadas = ref<boolean>(false);
const desvincularLoading = ref<{[key: number]: boolean}>({});
const URL_API:string = import.meta.env.VITE_URL_API;

// Filtro para mostrar solo las trampas no vinculadas
const trampasFiltradas = computed(() => {
  const trampaIds = trampasFuncionario.value.map(trampa => trampa.id);
  return trampas.value.filter(trampa => !trampaIds.includes(trampa.id));
});

const abrirModal = async (): Promise<void> => {
  isModalOpen.value = true;
  await Promise.all([
    cargarTrampas(),
    cargarTrampasFuncionario()
  ]);
};

const cerrarModal = (): void => {
  isModalOpen.value = false;
  trampaSeleccionada.value = null;
};

const deshabilitarFuncionario = (): void => {
  // Emitir el evento al componente padre con el ID del funcionario
  emit('deshabilitarFuncionario', props.id);
  cerrarModal();
};

const cargarTrampas = async (): Promise<void> => {
  try {
    isLoadingTrampas.value = true;
    const response = await axios.get(`${URL_API}/trampas`);
    // Filtrar sólo trampas activas
    trampas.value = response.data.filter((trampa: any) => trampa.estado == 1);
  } catch (error) {
    console.error('Error al cargar las trampas:', error);
  } finally {
    isLoadingTrampas.value = false;
  }
};

const cargarTrampasFuncionario = async (): Promise<void> => {
  try {
    isLoadingVinculadas.value = true;
    
    // Obtenemos las relaciones filtradas por el ID del funcionario
    const response = await axios.get(`${URL_API}/funcionarios_has_trampas`);
    console.log('Respuesta de trampas del funcionario:', response.data);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Filtrar las relaciones que corresponden a este funcionario
      const relacionesFuncionario = response.data.filter(relacion => 
        relacion.funcionario_id === props.id
      );
      
      if (relacionesFuncionario.length === 0) {
        trampasFuncionario.value = [];
        return;
      }
      
      console.log('Relaciones del funcionario:', relacionesFuncionario);
      
      // Obtener detalles de cada trampa y guardar el ID de vinculación
      const trampaDetalles = await Promise.all(
        relacionesFuncionario.map(async (relacion) => {
          try {
            const trampaResponse = await axios.get(`${URL_API}/trampas/${relacion.trampa_id}`);
            const trampa = trampaResponse.data;
            
            // Agregar el ID del registro de vinculación a los datos de la trampa
            return {
              ...trampa,
              vinculacion_id: relacion.id // Guardamos el ID del registro funcionario_has_trampa
            };
          } catch (error) {
            console.error(`Error al obtener detalles de trampa ${relacion.trampa_id}:`, error);
            return null;
          }
        })
      );
      
      // Filtrar nulls
      trampasFuncionario.value = trampaDetalles.filter(
        (trampa): trampa is TrampaVinculada => trampa !== null
      );
      
      console.log('Trampas con IDs de vinculación:', trampasFuncionario.value);
    } else {
      // No hay trampas vinculadas
      trampasFuncionario.value = [];
    }
  } catch (error) {
    console.error('Error al cargar las trampas del funcionario:', error);
    trampasFuncionario.value = [];
  } finally {
    isLoadingVinculadas.value = false;
  }
};

const vincularFuncionario = async (): Promise<void> => {
  if (!trampaSeleccionada.value) return;
  
  isVinculando.value = true;
  
  try {
    // Emitir evento al componente padre para vincular trampa con funcionario
    emit('vincularTrampas', {
      funcionarioId: props.id,
      trampaId: trampaSeleccionada.value,
      rol_id: props.rol_id
    });
    
    // Actualizar la lista de trampas vinculadas
    await cargarTrampasFuncionario();
    
    // Limpiar selección
    trampaSeleccionada.value = null;
    
  } catch (error) {
    console.error('Error al vincular funcionario con trampa:', error);
  } finally {
    isVinculando.value = false;
  }
};

const desvincularTrampa = async (trampaId: number): Promise<void> => {
  // Encontrar la trampa en nuestra lista para obtener el ID de vinculación
  const trampa = trampasFuncionario.value.find(t => t.id === trampaId);
  
  if (!trampa) {
    console.error('No se encontró la trampa en la lista de trampas vinculadas');
    return;
  }
  
  // Marcar como cargando usando el ID de la trampa
  desvincularLoading.value[trampaId] = true;
  
  try {
    // Emitir evento al componente padre con el ID de vinculación (funcionario_has_trampa.id)
    emit('desvincularTrampa', { 
      funcionario_has_trampaId: trampa.vinculacion_id
    });
    
    // Actualizar la lista después de un breve retardo
    setTimeout(async () => {
      await cargarTrampasFuncionario();
      desvincularLoading.value[trampaId] = false;
    }, 500);
    
  } catch (error) {
    console.error('Error al desvincular la trampa:', error);
    desvincularLoading.value[trampaId] = false;
  }
};

// Cuando cambia el estado del modal, actualizar los datos
watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    cargarTrampas();
    cargarTrampasFuncionario();
  }
});

onMounted(() => {
  // Al montar el componente, no cargamos trampas inmediatamente
  // sino sólo cuando se abre el modal
});
</script>

<style scoped>
/* Tarjeta del funcionario */
.funcionario-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
}

.funcionario-card:hover {
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
  color: #666666;
  font-size: 14px;
  margin-top: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  margin: 8px 0;
  color: #666666;
}

.card-info ion-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #1d5c41;
}

.details-button {
  margin-top: 12px;
  --color: #1d5c41;
}

/* Modal de detalles */
.details-modal {
  --border-radius: 16px 16px 0 0;
}

ion-modal ion-toolbar {
  --background: #1d5c41;
  --color: #ffffff;
}

.details-card {
  margin: 0;
  border-radius: 12px;
}

ion-item ion-icon {
  color: #1d5c41;
}

ion-item ion-label {
  color: #333333;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

ion-item ion-note {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}

.action-buttons {
  margin-top: 24px;
}

.action-button {
  --border-color: #d14836;
  --color: #d14836;
}

/* Lista de trampas vinculadas */
.linked-traps-card {
  margin: 16px 0;
  border-radius: 10px;
  border-left: 4px solid #3880ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.linked-title {
  color: #3880ff;
  font-size: 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.linked-title ion-icon {
  margin-right: 8px;
}

.linked-trap-item h3 {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.linked-trap-item p {
  font-size: 13px;
  color: #666;
  margin: 2px 0;
}

.loading-item {
  --min-height: 48px;
}

.no-trampas-message, .loading-message {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  font-style: italic;
}

/* Nueva tarjeta de vinculación */
.link-card {
  margin: 16px 0;
  border-radius: 10px;
  border-left: 4px solid #1d5c41;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.link-title {
  color: #1d5c41;
  font-size: 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.link-title ion-icon {
  margin-right: 8px;
}

.vincular-button {
  margin-top: 16px;
  --background: #1d5c41;
  --background-activated: #164732;
  --background-hover: #164732;
}

.spinner-small {
  width: 16px;
  height: 16px;
}
</style>
