<template>
  <ion-page>
    <!-- Encabezado -->
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <!-- Encabezado colapsable en móviles -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="condense-title">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <!-- Fila para los contadores -->
        <ion-row class="dashboard-row">
          <!-- Carta de Recuento de Detecciones -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card detections-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Recuento de Detecciones</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{ deteccionesTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Funcionarios -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card employees-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Funcionarios</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{ funcionariosTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Trampas -->
          <ion-col size="12" size-sm="6" size-md="4" class="dashboard-col">
            <ion-card class="dashboard-card traps-card">
              <ion-card-header class="card-header">
                <ion-card-title class="card-title">Trampas Operativas</ion-card-title>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p class="card-value">{{ trampasTotales }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Tablas de detalles -->
        <ion-row>
          <!-- Tabla de Detecciones -->
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Lista de Detecciones</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <table class="classic-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Trampa</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="deteccion in detecciones" :key="deteccion.id">
                      <td>{{ deteccion.id }}</td>
                      <td>{{ deteccion.trampa_id }}</td>
                      <td>{{ new Date(deteccion.fecha).toLocaleDateString() }}</td>
                      <td>{{ deteccion.estado_deteccion_id }}</td>
                    </tr>
                  </tbody>
                </table>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Tabla de Funcionarios -->
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Lista de Funcionarios</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <table class="classic-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>RUT</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="funcionario in funcionarios" :key="funcionario.id">
                      <td>{{ funcionario.persona.nombre }} {{ funcionario.persona.apellido }}</td>
                      <td>{{ funcionario.persona.rut }}</td>
                      <td>{{ funcionario.rol.nombre }}</td>
                    </tr>
                  </tbody>
                </table>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Tabla de Trampas -->
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Lista de Trampas</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <table class="classic-table">
                  <thead>
                    <tr>
                      <th>Modelo</th>
                      <th>MAC</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="trampa in trampas" :key="trampa.id">
                      <td>{{ trampa.modelo }}</td>
                      <td>{{ trampa.direccion_mac }}</td>
                      <td>{{ trampa.estado === 1 ? 'Operativa' : 'Inactiva' }}</td>
                    </tr>
                  </tbody>
                </table>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
const URL_API = import.meta.env.VITE_URL_API as string;

//Ref number
const deteccionesTotales = ref<number>(0);
const funcionariosTotales = ref<number>(0);
const trampasTotales = ref<number>(0);

//Interfaces
interface Deteccion {
  id: number;
  predio_id: number;
  trampa_id: number;
  estado_deteccion_id: number;
  fecha: string;
  imagen: string;
}

interface Funcionario {
  id: number;
  rol_id: number;
  estado: number;
  persona_id: number;
  persona:{
    id: number;
    usuario_id: number;
    rut: string;
    nombre: string;
    apellido: string;
    usuario:{
      id: number;
      email: string;
      password: string;
      estado: number;
    }
  };
  rol:{
    id: number;
    nombre: string;
  };
}

interface Trampa {
  id: number;
  predio_id: number;
  usuario_id: number;
  modelo: string;
  direccion_mac: string;
  estado: number;
  coordenadas: string;
  predio:{
    id: number;
    duenio_id: number;
    direccion: string;
    estado: number;
  };
  usuario:{
    id: number;
    email: string;
    password: string;
    estado: number;
  };
}
//Response interfaces
interface DeteccionesResponse {
  detecciones: Deteccion[];
}
interface FuncionariosResponse {
  funcionarios: Funcionario[];
}
interface TrampasResponse {
  trampas: Trampa[];
}

// Ref arrays
const detecciones = ref<Deteccion>([]);
const funcionarios = ref<Funcionario>([]);
const trampas = ref<Trampa>([]);

// Llamada a la API para obtener los datos del Dashboard
const fetchData = async (): Promise<void> => {
  try {
    const deteccionesResponse = await axios.get<DeteccionesResponse>(`${URL_API}/detecciones`);
    deteccionesTotales.value = deteccionesResponse.data.detecciones.length;
    detecciones.value = deteccionesResponse.data.detecciones;
    //Console.log para ver si se obtienen los datos
    console.log("Detecciones", deteccionesResponse.data.detecciones);

    const funcionariosResponse = await axios.get<FuncionariosResponse>(`${URL_API}/funcionarios`);
    funcionariosTotales.value = funcionariosResponse.data.length;
    funcionarios.value = funcionariosResponse.data;
    //Console.log para ver si se obtienen los datos
    console.log("Funcionarios", funcionariosResponse.data);

    const trampasResponse = await axios.get<TrampasResponse>(`${URL_API}/trampas`);
    trampasTotales.value = trampasResponse.data.filter((trampa) => trampa.estado === 1).length;
    trampas.value = trampasResponse.data;
    //Console.log para ver si se obtienen los datos
    console.log("Trampas", trampasResponse.data);
  } catch (error) {
    console.error('Error al obtener los datos del Dashboard:', error);
  }
};

onBeforeMount(() => {
  fetchData();
});
</script>

<style scoped>

/* Estilos personalizados para las tablas clásicas */
.classic-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.classic-table th,
.classic-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.classic-table th {
  background-color: #04402A;
  color: white;
  font-weight: bold;
}

.classic-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.classic-table tr:hover {
  background-color: #ddd;
}

/* Encabezado */
.header-toolbar {
  --background: #04402A;
  --color: #ffffff;
}

.header-title {
  font-size: 1.4rem;
  font-weight: bold;
}

/* Contenido del Dashboard */
.dashboard-content {
  --background: #f5f5f5;
  padding: 1rem;
}

/* Grid */
.dashboard-grid {
  gap: 1rem; /* Espaciado entre columnas */
}

/* Fila */
.dashboard-row {
  justify-content: center; /* Centrar las tarjetas */
  align-items: stretch; /* Alinear las tarjetas verticalmente */
}

/* Columna */
.dashboard-col {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

/* Tarjetas */
.dashboard-card {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.dashboard-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #04402A;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.card-content {
  padding: 1.5rem 1rem;
  text-align: center;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
  color: #04402A;
  margin: 0;
}

/* Colores personalizados por tipo de tarjeta */
.detections-card {
  border-left: 4px solid #92A69E;
}

.employees-card {
  border-left: 4px solid #e63946;
}

.traps-card {
  border-left: 4px solid #f4a261;
}

/* Responsividad */
@media (max-width: 768px) {
  .card-value {
    font-size: 1.5rem;
  }
}
</style>
