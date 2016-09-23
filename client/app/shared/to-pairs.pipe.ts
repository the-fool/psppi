import { Pipe, PipeTransform } from '@angular/core';
import { toPairs } from 'ramda';

@Pipe({name: 'toPairs'})
export class ToPairsPipe implements PipeTransform {
    transform(value: {}): [{}, {}][] {
        return toPairs(value);
    }
}