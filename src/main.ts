import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import * as IonComponents from '@ionic/vue';
import { createPinia } from 'pinia';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue, { mode: 'ios' })
  .use(router)
  .use(createPinia());

Object.keys(IonComponents).forEach(key => {
  if (/^Ion[A-Z]\w+$/.test(key) && key in IonComponents) {
    // Type assertion to tell TypeScript this is a valid component
    app.component(key, (IonComponents as Record<string, any>)[key]);
  }
});

router.isReady().then(() => {
  app.mount('#app');
});
