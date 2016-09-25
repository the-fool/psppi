import { Action, ActionReducer } from '@ngrx/store';

const SET_DEMOGRAPHY = 'demography/SET_DEMOGRAPHY';
export function setDemography(payload: IDemography): Action {
  return {
    type: SET_DEMOGRAPHY,
    payload
  };
}

const DEMOGRAPHY_INIT = {};
export const demography: ActionReducer<IDemography> =
(state = DEMOGRAPHY_INIT, {type, payload}: Action) => {
  switch (type) {
    case SET_DEMOGRAPHY:
      return payload;
    default:
      return state;
  }
};

const SET_QUESTIONS = 'questions/SET_QUESTIONS';
export function setQuestions(payload: IQuestion[]): Action {
  return {
    type: SET_QUESTIONS,
    payload
  };
}

const QUESTION_INIT = [];
export const questions: ActionReducer<IQuestion[]> =
(state = QUESTION_INIT, {type, payload}: Action) => {
  switch (type) {
    case SET_QUESTIONS:
      return payload;
    default:
      return state;
  }
};

const SET_QUESTION_DATA = 'questions/SET_QUESTION_DATA';
export function setQuestionData(payload: IQuestionData): Action {
  return {
    type: SET_QUESTION_DATA,
    payload
  };
}

const QUESTION_DATA_INIT = {};
export const data: ActionReducer<IQuestionData> =
(state = QUESTION_DATA_INIT, {type, payload}: Action) => {
  switch (type) {
    case SET_QUESTION_DATA:
      return payload;
    default:
      return state;
  }
};

