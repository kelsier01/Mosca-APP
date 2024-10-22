<template>
  <ion-card>
    <img alt="Silhouette of mountains" />
    <ion-card-header>
      <ion-card-title>Card Title</ion-card-title>
      <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      Here's a small text description
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
  import { defineComponent, defineProps, watch, ref} from 'vue';
  
  export default defineComponent({
    components: { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle },
  });



  
  
</script>
