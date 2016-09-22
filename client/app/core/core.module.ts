import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { ApiService } from './api.service';

@NgModule({
    providers: [
        CookieService,
        ApiService
    ]
})
export default class CoreModule {}
