import { Component, Input, ContentChildren, QueryList, forwardRef, ViewEncapsulation } from '@angular/core';
import { SBItem } from './sb-item';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'squeezebox',
    styleUrls: ['./styles.scss'],
    template: `
        <div class="squeezebox">
            <ng-content></ng-content>
        </div>
    `
})
export class SqueezeBox {
    @Input() multiple = true;
    @ContentChildren(forwardRef(() => SBItem)) items: QueryList<SBItem>;

    didItemToggled(item: SBItem) {
        // on not multiple, it will collpase the rest of items
        if (!this.multiple) {
            this.items.toArray().forEach(i => {
                if (i !== item) i.applyToggle(true);
            });
        }
    }
}
