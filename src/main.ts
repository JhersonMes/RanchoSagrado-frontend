import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)// Inicializa la aplicación Angular utilizando la configuración global definida en appConfig.
  .catch((err) => console.error(err));
