import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideEnvironmentNgxMask } from 'ngx-mask/lib/ngx-mask.providers';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
