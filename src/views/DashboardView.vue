<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <!-- Fila para los contadores -->
        <ion-row>
          <!-- Carta de Recuento de Detecciones -->
          <ion-col size="6" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Recuento de Detecciones</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>Total: 123</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Funcionarios -->
          <ion-col size="6" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Funcionarios</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>Total Funcionarios: 5</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Carta de Trampas -->
          <ion-col size="6" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Trampas</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>Total Trampas: 10</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

</script>

<style scoped>

</style>
