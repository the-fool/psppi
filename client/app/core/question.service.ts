import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { setQuestionData } from './reducers';
import { URLSearchParams } from '@angular/http';
@Injectable()
export class QuestionService {
    constructor(
        private store: Store<AppState>,
        private api: ApiService
    ) {}

    fetchQuestionData(id: number, demography?: string) {
        let params = null;
        if (demography && (demography !== 'any')) {
            params = new URLSearchParams();
            params.set('demog', demography);
        }
        return this.api.request('get', `questions/${id}`, {search: params}).then(res => {
            this.store.dispatch(setQuestionData(res));
            return res;
        });
    }
}
