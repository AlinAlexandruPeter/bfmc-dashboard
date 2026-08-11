import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      /* Configuration */
      theme: {
        preset: Aura,
      },
      license: 'eyJpZCI6ImMyYTkyMTc1LTM4NzgtNDAyMS1hOTk5LTJkNDUwYmZiNTFjOCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODY0MDUxODcsImV4cCI6MTgxNzk0MTE4N30.y9V-_LJS4Gnht8iz4uIn2bBzGNWTzHJZrTpvgP-oCbaFkUl--_qqphZPkeajh-bzw9_xMOke8TgR-dgO9BgeCQ'
    })
]
};
