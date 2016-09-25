interface AppState {
    data: IQuestionData,
    questions: {[group: string]: IQuestion[]},
    demography: IDemography[]
}

interface IQuestion {
    id: number,
    group: string,
    code: string,
    text: string,
    values: {[value: string]: string},
}

interface IQuestionData extends IQuestion {
    demog: string,    
    responses: {
        [year: string]: {
            values: IResponse[]
            demographies: string[] // all possible demographic variables for a question by year
        }
    }
}


interface IResponse {
    count: number,
    value: string,
    demog: string
}

interface IDemography {
    code: string,
    text: string,
    nice: string,
    values: {[key: string]: string}
}

interface SelectChildrenItem {
    text: string;
    children: {id: number|string, text: string}[]
}

interface ISelectOptionMixin {
    disabled: boolean,
    active: boolean,
}

interface IDemographySelectOption extends IDemography, ISelectOptionMixin {}

interface IYearSelectOption extends ISelectOptionMixin {
    value: string
}