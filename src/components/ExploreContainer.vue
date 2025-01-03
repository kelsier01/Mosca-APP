<template>
  <ion-card>
    <img alt="Silhouette of mountains" />
    <ion-card-header>
      <ion-card-title>{{ props.title }}</ion-card-title>
      <ion-card-subtitle>{{ props.subtitle }}</ion-card-subtitle>
    </ion-card-header>
    
    <ion-card-content>
      {{ props.content }}
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/vue'

interface CardProps {
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
}

// Define props with default values
const props = withDefaults(defineProps<CardProps>(), {
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  content: "Here's a small text description",
  imageUrl: ''
})
</script>

<style scoped>
.container {
  width: 100%;
}
</style>
