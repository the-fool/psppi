import { Component, ViewEncapsulation, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { add, always, compose, find, groupBy, ifElse, keys, lensProp, map, prop, propEq, reduce, set, xprod } from 'ramda';
declare const d3: any;
const style = require('nvd3/build/nv.d3.css');

interface BarData {
  key: string;
  values: Datum[];
}

interface Datum {
  label: string;
  value: number;
}


@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  template: `
    <div>
    <nvd3 [options]="options" [data]="data"></nvd3>
    </div>
    `
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() questionData: IQuestionData;
  @Input() year: string;
  @Input() demogDict: { [code: string]: IDemography };
  private data: any;
  private options = null;
  private lineOptions = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin : {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      x: prop('x'),
      y: prop('y'),
      useInteractiveGuideline: true,
      xAxis: {
        axisLabel: 'Percentage'
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      },
    }
  };
  private barOptions = {
    chart: {
      type: 'multiBarChart',
      height: 500,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      //forceY: [0, 1],
      x: prop('label'),
      y: prop('value'),
      showValues: true,
      tooltip: {
        valueFormatter: d3.format(',.1%')
      },
      duration: 500,
      xAxis: {
        axisLabel: 'X Axis'
      },
      yAxis: {
        axisLabel: 'Y Axis',
        axisLabelDistance: -10
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    let values;
    if (changes['year'] || changes['questionData']) {
      if (this.year === 'all') {
        // set line chart scheme
        this.options = this.lineOptions;

        const demogDict = this._getDemogDict(this.questionData);
        const valueDict = this.questionData.values;
        const permutations = map(pair => ({demog: pair[0], value: pair[1]}), xprod(keys(demogDict), keys(valueDict)));

        // valuesByDemogByYear :: { [year: number]: {[demog: number]: IResponse[]}}
        const valuesByDemogByYear = reduce(
          (a, i) => set(lensProp(i), this._getValuesGroupedByDemog(this.questionData.responses[i].values), a),
          {},
          keys(this.questionData.responses)
        );
        this.data = map(
          demogValuePair => ({
            key: `${demogDict[demogValuePair.demog]}: ${valueDict[demogValuePair.value]}`,
            values: map(
              year => ({
                x: +year,
                y: this.computeLineDatum(demogValuePair.value, valuesByDemogByYear[year][demogValuePair.demog])
              }),
              keys(valuesByDemogByYear)
          )}),
        permutations);
      } else {
        this.options = this.barOptions;
        const valuesByDemog = this._getValuesGroupedByDemog(this.questionData.responses[this.year].values);
        const demogDict = this._getDemogDict(this.questionData);
        this.data = map(
          demog => ({
            key: demogDict[demog],
            values: this.translateLabels(
              this.questionData.values,
              this.computeBarData(valuesByDemog[demog])
            )
          }), keys(valuesByDemog));
      }
    }
  }

  _getValuesGroupedByDemog(responses: IResponse[]) {
    return groupBy<IResponse>(prop('demog'), responses);
  }

  _getDemogDict(questionData: IQuestionData): {[code: string]: string} {
    return questionData.demog === 'any' ? { 0: 'Any' } : this.demogDict[this.questionData.demog].values;
  }

  _getDenominator(data: IResponse[]) {
    return reduce<number, number>(add, 0, map<IResponse, number>(ifElse(prop('count'), prop('count'), always(0)), data));
  }

  computeLineDatum(value: string, data: IResponse[]) {
    if (!data) return 0;
    const denom = this._getDenominator(data);
    const datum = find(propEq('value', value), data);
    return datum ? datum.count / denom : 0;
  }
  computeBarData(data: IResponse[]): Datum[] {
    const denom = this._getDenominator(data);
    const datumToBar = (d: { count: number, demog: string, value: string }) => {
      const label = d.value;
      const value = d.count / denom;
      const demog = d.demog;
      return { label, value };
    };
    return map(datumToBar, data);
  }

  translateLabels(labelDict: { [key: number]: string }, data: Datum[]) {
    const setLabel = (d: Datum) => {
      const newLabel = labelDict[+d.label];
      return set(lensProp('label'), newLabel, d);
    };
    return map(setLabel, data);
  }

  ngOnInit() {
    this.options = this.barOptions;
  }
}
