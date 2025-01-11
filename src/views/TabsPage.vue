<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="tab1" href="/tabs/dashboard">
          <ion-icon aria-hidden="true" :icon="notifications" class="custom-icon" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/detecciones">
          <ion-icon aria-hidden="true" :icon="eye" class="custom-icon" />
          <ion-label>Detecciones</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/trampas">
          <ion-icon aria-hidden="true" :icon="bug" class="custom-icon" />
          <ion-label>Trampas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/funcionarios">
          <ion-icon aria-hidden="true" :icon="people" class="custom-icon" />
          <ion-label>Funcionarios</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/tabs/predios">
          <ion-icon aria-hidden="true" :icon="home" class="custom-icon" />
          <ion-label>Predios</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import { notifications, eye, bug, people, home } from 'ionicons/icons';
</script>

<style scoped>
/* Tab Bar personalizado */
.custom-tab-bar {
  display: flex;
  justify-content: space-around; /* Espacio uniforme entre tabs */
  align-items: center;
  background-color: #04402A; /* Fondo del tab bar */
  border-top: 2px solid #01261C; /* Línea superior */
  --color-selected: #92A69E; /* Color para el tab activo */
  --color: #F2F2F2; /* Color para tabs inactivos */
  height: 60px; /* Altura predeterminada */
  padding: 0 5px; /* Espaciado interno para evitar cortes */
}

/* Responsivo para pantallas grandes */
@media (min-width: 768px) {
  .custom-tab-bar {
    height: 70px; /* Aumentar altura en tablets/desktops */
    padding: 0 20px; /* Espaciado interno */
  }
}

/* Iconos del Tab */
.custom-icon {
  font-size: 1.4rem; /* Tamaño predeterminado */
  color: var(--color);
}

/* Cambiar tamaño de iconos en pantallas grandes */
@media (min-width: 768px) {
  .custom-icon {
    font-size: 1.6rem;
  }
}

/* Etiquetas de texto */
ion-label {
  font-size: 0.75rem; /* Reducir tamaño de texto */
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color);
  margin-top: 4px; /* Espaciado entre el icono y el texto */
  white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
}

/* Cambiar tamaño de texto en pantallas grandes */
@media (min-width: 768px) {
  ion-label {
    font-size: 0.85rem;
  }
}

/* Botones del Tab */
ion-tab-button {
  flex: 1; /* Todos los botones ocupan el mismo ancho */
  text-align: center;
  background-color: #04402A;
  min-width: 60px; /* Ancho mínimo para cada botón */
  max-width: 100px; /* Ancho máximo para cada botón */
}

ion-tab-button:hover {
  background-color: #01261C; /* Fondo al pasar el cursor */
}

/* Botón activo */
ion-tab-button[aria-selected='true'] {
  background-color: #01261C; /* Fondo del tab activo */
  color: var(--color-selected); /* Cambiar color del texto y el icono del activo */
}

/* Ajustar altura para tabs */
ion-tab-button {
  height: 100%; /* Llenar la altura del tab-bar */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Espaciado para dispositivos pequeños */
@media (max-width: 480px) {
  .custom-tab-bar {
    height: 50px; /* Reducir altura en pantallas pequeñas */
    padding: 0 2px; /* Reducir espaciado interno */
  }

  .custom-icon {
    font-size: 1.2rem; /* Reducir tamaño de iconos */
  }

  ion-label {
    font-size: 0.65rem; /* Reducir tamaño de texto */
  }
}
</style>