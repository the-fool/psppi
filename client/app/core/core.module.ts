import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { ApiService } from './api.service';
import { QuestionService } from './question.service';
import { provideStore, combineReducers } from '@ngrx/store';
import { questions, demography, data } from './reducers';

@NgModule({
    providers: [
        CookieService,
        ApiService,
        QuestionService,
        provideStore(combineReducers({
            questions,
            demography,
            data
        }))
    ]
})
export default class CoreModule { }
