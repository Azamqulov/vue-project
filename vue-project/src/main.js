import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Store from "./Store";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Firebase konfiguratsiyasini import qiling

onAuthStateChanged(auth, (user) => {
  if (!user && !localStorage.getItem('reloadOnce')) {
    localStorage.setItem('reloadOnce', 'true');
    window.location.reload();
  } else {
    localStorage.removeItem('reloadOnce'); // Keyingi kirishlar uchun flagni tozalaymiz
  }
});


// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./assets/styles/tailwind.css";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(Store);
app.use(vuetify);
app.use(router);

app.mount("#app");
