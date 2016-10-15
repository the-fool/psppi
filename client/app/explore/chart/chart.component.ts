import { Component, ViewEncapsulation, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import {
  add, always, assocPath, compose, find, filter, groupBy, ifElse, isNil, keys, lensProp, map,
  mapObjIndexed, max, merge, min, not, prop, propEq, reduce, set, toPairs, values, xprod
} from 'ramda';
declare const d3: any;
const nvd3 = require('nvd3/build/nv.d3.css');
const style = require('./chart.style');

interface BarData {
  key: string;
  values: Datum[];
}

interface Datum {
  label: string;
  y: number;
}

interface ResponseOpt {
  key: number;
  label: string;
}

const COLORS = [
  'rgb(96,143,61)',
  'rgb(219,20,0)',
  'rgb(253,116,0)',
  'rgb(42,188,153)',
  'rgb(0,67,88)',
  'rgb(251,223,62)',
  'rgb(151,233,213)'
];

const colorFunc = (d, i) => (d.data && d.data.color) || COLORS[i % COLORS.length];

@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  styles: [nvd3, style],

  template: `
    <div id="chart-wrapper" class="card">
    <nvd3 [options]="options" [data]="data"></nvd3>
    <div class="btn-grp">
      <label *ngFor="let r of responseOpts" class="btn btn-primary" [(ngModel)]="selectedSpecificResponse"
            btnRadio="{{r.key}}" (click)="_constructLineData(r.key)">
            {{r.label}}
    </label>
    </div>
    </div>
    `
})
export class ChartComponent implements OnChanges {
  @Input() questionData: IQuestionData;
  @Input() year: string;
  @Input() demogDict: { [code: string]: IDemography };
  private data: any;
  private options = null;
  private selectedSpecificResponse: number;
  private responseOpts = [];
  private lineOptions = {
    chart: {
      type: 'lineChart',
      height: 450,
      color: colorFunc,
      margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      legend: {
        maxKeyLength: 50,
        width: 700
      },
      x: prop('x'),
      y: prop('y'),
      useInteractiveGuideline: true,
      xAxis: {
        axisLabel: 'Year'
      },
      yAxis: {
        tickFormat: d3.format(',.0%'),
      },
    }
  };
  private barOptions = {
    chart: {
      type: 'multiBarChart',
      height: 600,
      color: colorFunc,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      legend: {
        maxKeyLength: 50,
      },
      legendPosition: 'bottom',
      forceY: [0, 1],
      x: prop('label'),
      y: prop('y'),
      showValues: true,
      tooltip: {
        valueFormatter: d3.format(',.1%')
      },
      duration: 500,
      yAxis: {
        tickFormat: d3.format(',.0%'),
      }
    }
  };

  private pieOptions = {
    chart: {
      type: 'pieChart',
      height: 500,
      donut: false,
      color: colorFunc,
      //donutRatio: 0.2,
      x: prop('key'),
      y: prop('y'),
      showLabels: true,
      duration: 500,
      tooltip: {
        valueFormatter: d3.format(',.1%')
      },
      legend: {
        maxKeyLength: 50,
        margin: {
          top: 5,
          right: 140,
          bottom: 5,
          left: 0
        }
      }
    }
  };

  _constructLineData(specificResponse?: number) {
    const demogDict = this._getDemogDict(this.questionData);
    const valueDict = this.questionData.values;

    // Group data series by response values, or response demography
    // if there is a specific response to filter by, then we group data by demog
    // else, we show all response values
    const seriesDict = isNil(specificResponse) ? valueDict : demogDict;
    const valuesByYearByGrouping = this._getValuesByYearByGrouping(this.questionData, specificResponse);
    // Is the denominator a function of all response values, or a response values by a particular demog?
    const yValueDenomDomainComputer = isNil(specificResponse) ?
      (year) => values(valuesByYearByGrouping[year]) :
      (year, demogKey) => filter(propEq('demog', +demogKey))(this.questionData.responses[year].values);

    this.data = map(
      k => ({
        key: `${seriesDict[k]}`, // get nice label
        values: map(
          year => ({
            x: +year,
            y: this.computeLineDatum(valuesByYearByGrouping[year][k], yValueDenomDomainComputer(year, k)),
          }),
          keys(valuesByYearByGrouping)
        )
      }),
      keys(seriesDict));

      const maximum = this._getMaxY(this.data);
      this.options = this._setForceYRange(maximum, this.lineOptions);
  }

  computeLineDatum(datum: any, data: IResponse[]) {
    if (!data || !datum) return 0;
    const denom = this._getDenominator(data);
    return datum.count / denom;
  }


  _getValuesByYearByGrouping(data: IQuestionData, specificResponseValue?: number): {[year: number]: {[key: string]: IResponse}} {
    const _responses = data.responses;
    let filterPredicate; // how to filter response data
    let seriesKey;
    if (isNil(specificResponseValue)) {
      filterPredicate = always(true); // 'any' demog requires no filtering
      seriesKey = 'value';
    } else {
      filterPredicate = propEq('value', specificResponseValue.toString());
      seriesKey = 'demog';
    }
    return mapObjIndexed(
      (year, key, responses) => {
        const allValues = responses[key].values;
        const possibleValues = filter<IResponse>(filterPredicate, allValues);
        return <{[key: string]: IResponse}>reduce((acc, v) => set(lensProp(prop<string>(seriesKey, v)), v, acc), {}, possibleValues);
      },
      _responses
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['year'] || changes['questionData']) {
      if (this.year === 'all' && keys(this.questionData.responses).length > 1) {
        // line chart if there are at least 2 years' worth of responses
        // are we grouping by demog?
        if (this.questionData.demog === 'any') {
          // clear out responseOpt buttons
          this.responseOpts = [];
          this._constructLineData();
        } else {
          // set response opt buttons
          this.responseOpts = map(e => ({ key: e[0], label: e[1] }), toPairs(this.questionData.values));
          // Pick first response value, as default
          this.selectedSpecificResponse = this.responseOpts[0].key;
          this._constructLineData(this.selectedSpecificResponse);
        }

      } else if (this.questionData.demog !== 'any') {
        // Bar chart
        // Individual year, individual demog
        this.responseOpts = [];

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
           const maximum = this._getMaxY(this.data);
           this.options = this._setForceYRange(maximum, this.barOptions);

      } else {
        // Individual year, no demog

        // If we are here b/c of the edge case where year is 'all' but there is only one year's worth of responses,
        // then set year manually to be that single response's year
        this.year = this.year === 'all' ? keys(this.questionData.responses)[0] : this.year;

        // Remove response options from the DOM
        this.responseOpts = [];
        this.options = this.pieOptions;
        const yearData = this.questionData.responses[this.year];
        const normalizer = reduce<number, number>(add, 0, map<IResponse, number>(prop('count'), yearData.values));
        this.data = map(
          value => ({
            key: this.questionData.values[value.value],
            y: value.count / normalizer
          }),
          yearData.values
        );
      }
    }
  }

  _getMaxY(data: {values: {y: number}[]}[]) {
    return reduce((maximum1, series: {values: {y: number}[]}) => max(
            maximum1,
            reduce((maximum2, value) => max(maximum2, value.y), 0, series.values)), 0, data);
  }

  _setForceYRange(maximum: number, options: any) {
      const forceYRange = [0, min(1, Math.round((maximum + .1) * 10 ) / 10)];
      return assocPath(['chart', 'forceY'], forceYRange, options);
  }

  _getValuesGroupedByDemog(responses: IResponse[]) {
    return groupBy<IResponse>(prop('demog'), responses);
  }

  _getDemogDict(questionData: IQuestionData): { [code: string]: string } {
    return questionData.demog === 'any' ? { 0: 'Any' } : this.demogDict[this.questionData.demog].values;
  }

  _getDenominator(data: IResponse[]) {
    return reduce<number, number>(add, 0, map<IResponse, number>(ifElse(prop('count'), prop('count'), always(0)), data));
  }

  computeBarData(data: IResponse[]): Datum[] {
    const denom = this._getDenominator(data);
    const datumToBar = (d: { count: number, demog: string, value: string }) => {
      const label = d.value;
      const y = d.count / denom;
      const demog = d.demog;
      return { label, y };
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
}
