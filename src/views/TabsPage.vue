<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/dashboard">
          <ion-icon aria-hidden="true" :icon="notifications" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/detecciones">
          <ion-icon aria-hidden="true" :icon="eye" />
          <ion-label>Detecciones</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/trampas">
          <ion-icon aria-hidden="true" :icon="bug" />
          <ion-label>Trampas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/funcionarios">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Funcionarios</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/tabs/predios">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Predios</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { notifications, eye, bug, people, home} from 'ionicons/icons';
</script>
