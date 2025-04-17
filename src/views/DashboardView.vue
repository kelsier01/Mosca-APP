<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <!-- Sección de estadísticas -->
        <ion-row>
          <ion-col size="12" size-md="4">
            <ion-card color="light">
              <ion-card-header>
                <ion-card-title class="ion-text-center">
                  <ion-icon :icon="eyeOutline" size="large" />
                </ion-card-title>
              </ion-card-header>
              <ion-card-content class="ion-text-center">
                <h2>{{ deteccionesTotales }}</h2>
                <p>Detecciones</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card color="light">
              <ion-card-header>
                <ion-card-title class="ion-text-center">
                  <ion-icon :icon="peopleCircleOutline" size="large" />
                </ion-card-title>
              </ion-card-header>
              <ion-card-content class="ion-text-center">
                <h2>{{ funcionariosTotales }}</h2>
                <p>Funcionarios</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card color="light">
              <ion-card-header>
                <ion-card-title class="ion-text-center">
                  <ion-icon :icon="hardwareChipOutline" size="large" />
                </ion-card-title>
              </ion-card-header>
              <ion-card-content class="ion-text-center">
                <h2>{{ trampasTotales }}</h2>
                <p>Trampas Operativas</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Tablas de detalles -->
        <ion-row>
          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="eyeOutline" />
                  Detecciones
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item
                    lines="none" 
                    v-for="deteccion in detecciones" 
                    :key="deteccion.id"
                    >
                    <ion-label>
                      <h3>ID: {{ deteccion.id }}</h3>
                      <p>Trampa: <strong>MF1</strong></p>
                      <p>Fecha: {{ new Date(deteccion.fecha).toLocaleDateString() }}</p>
                    </ion-label>
                    <ion-chip :outline="true" :color="deteccion.estado_deteccion_id == 1 ? 'success' : 'danger'">
                      {{ deteccion.estado_deteccion_id == 1 ? "Detectado" : "Sin Detectar" }}
                    </ion-chip>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-card color="light">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="peopleCircle" /> 
                  Funcionarios
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item 
                    v-for="funcionario in funcionarios" 
                    :key="funcionario.id"
                    lines="none"
                    >
                    <ion-label>
                      <h3>{{ funcionario.persona?.nombre || 'Sin nombre' }} {{ funcionario.persona?.apellido || '' }}</h3>
                      <p>RUT: {{ funcionario.persona?.rut || 'No disponible' }}</p>
                    </ion-label>
                    <ion-chip color="primary">{{ funcionario.rol?.nombre || 'Sin rol' }}</ion-chip>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="hardwareChip"/> 
                  Lista de Trampas
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item 
                    v-for="trampa in trampas" 
                    :key="trampa.id"
                    lines="none"
                    >
                    <ion-label>
                      <h3>{{ trampa.modelo }}</h3>
                      <p>MAC: {{ trampa.direccion_mac }}</p>
                    </ion-label>
                    <ion-chip :color="trampa.estado === 1 ? 'success' : 'danger'">
                      {{ trampa.estado === 1 ? 'Operativa' : 'Inactiva' }}
                    </ion-chip>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Deteccion, Funcionario, Trampa } from '@/interfaces/interfaces';
import axios from 'axios';
import { 
  eyeOutline, 
  hardwareChip, 
  hardwareChipOutline, 
  peopleCircle, 
  peopleCircleOutline 
} from 'ionicons/icons';
import { onBeforeMount, ref } from 'vue';
const URL_API:string = import.meta.env.VITE_URL_API;

//Ref number
const deteccionesTotales = ref<number>(0);
const funcionariosTotales = ref<number>(0);
const trampasTotales = ref<number>(0);

// Ref arrays
const detecciones = ref<Deteccion[]>([]);
const funcionarios = ref<Funcionario[]>([]);
const trampas = ref<Trampa[]>([]);

// Lógica para colores de estado (ya no se usa getStatusClass, se usa color de badge)
const fetchData = async (): Promise<void> => {
  try {
    const deteccionesResponse = await axios.get(`${URL_API}/detecciones`);
    const deteccionesOrdenadas = deteccionesResponse.data.detecciones.sort((a: Deteccion, b: Deteccion) => b.id - a.id);
    deteccionesTotales.value = deteccionesOrdenadas.length;
    detecciones.value = deteccionesOrdenadas;

    const funcionariosResponse = await axios.get(`${URL_API}/funcionarios`);
    const funcionariosOrdenados = funcionariosResponse.data.sort(
      (a: Funcionario, b: Funcionario) => (a.persona?.nombre || '').localeCompare(b.persona?.nombre || '')
    );
    funcionariosTotales.value = funcionariosOrdenados.length;
    funcionarios.value = funcionariosOrdenados;

    const trampasResponse = await axios.get(`${URL_API}/trampas`);
    const trampasOrdenadas = trampasResponse.data.sort(
      (a: Trampa, b: Trampa) => a.modelo.localeCompare(b.modelo)
    );
    trampasTotales.value = trampasOrdenadas.filter((trampa: any) => trampa.estado === 1).length;
    trampas.value = trampasOrdenadas;
  } catch (error) {
    console.error('Error al obtener los datos del Dashboard:', error);
  }
};

onBeforeMount(() => {
  fetchData();
});
</script>

<style scoped>


/* Estilos de Cards */
ion-card {
  border-radius: 12px;
  margin-bottom: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  border: none;
}

ion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(29, 92, 65, 0.12);
}


/* Headers de las cards */
ion-card-header {
  padding: 16px 16px 8px;
  border-bottom: none;
}

ion-card-title {
  font-weight: 600;
  color: #1d5c41;
  display: flex;
  align-items: center;
}

/* Contenido de las cards */
ion-card-content {
  padding: 16px;
}

/* Iconos */
ion-icon {
  color: #1d5c41 !important;
  margin-right: 8px;
}

ion-icon[size="large"] {
  font-size: 48px;
  margin-bottom: 8px;
}

/* Tipografía */
h2 {
  color: #1d5c41;
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

h3 {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

p {
  color: #666666;
  font-size: 14px;
  margin-top: 4px;
}

/* Listas */
ion-list {
  padding: 0;
  background: transparent;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  margin-bottom: 8px;
  border-radius: 8px;
}

ion-item:last-child {
  margin-bottom: 0;
}

ion-item:hover {
  --background: rgba(29, 92, 65, 0.04);
}

/* Badges */
ion-badge {
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

.ion-float-right {
  margin-left: auto;
}

/* Responsive */
@media (max-width: 768px) {
  h2 {
    font-size: 24px;
  }
  
  ion-grid {
    padding: 12px;
  }
  
  ion-icon[size="large"] {
    font-size: 36px;
  }
}

ion-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Animaciones sutiles */
.ion-text-center h2, 
.ion-text-center p {
  transition: transform 0.2s ease;
}

.ion-text-center:hover h2 {
  transform: scale(1.05);
}
</style>
