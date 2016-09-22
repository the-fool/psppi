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
    responses: {[year: string]: IResponse[]}
}


interface IResponse {
    count: number,
    value: string,
    demog: string
}

interface IDemography {
    code: string,
    text: string,
    values: {[key: string]: string}
}