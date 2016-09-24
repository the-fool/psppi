interface AppState {
    data: IQuestionData[],
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
            demographies: string[]
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

interface IDemographySelectItem {
    disabled: boolean,
    active: boolean,
    text: string,
    code: string,
}