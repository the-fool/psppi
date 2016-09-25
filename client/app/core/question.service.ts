import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { setQuestionData } from './reducers';
@Injectable()
export class QuestionService {
    constructor(
        private store: Store<AppState>,
        private api: ApiService
    ) {}

    fetchQuestionData(id: number, demography?: string) {
        const params = demography ? { demog: demography } : null;
        return this.api.request('get', `questions/${id}`, params).then(res => {
            console.log('API REQUEST');
            this.store.dispatch(setQuestionData(res));
            return res;
        });
    }
}
