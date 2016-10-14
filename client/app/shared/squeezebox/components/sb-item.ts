import { Component, ContentChild, Input, Inject, forwardRef, ViewEncapsulation, OnChanges } from '@angular/core';
import { SBItemBody } from './sb-item-body';
import { SqueezeBox } from './squeezebox';

@Component({
    exportAs: 'sbItem',
    encapsulation: ViewEncapsulation.None,
    selector: 'sb-item',
    template: `
        <div class="sb-item" [ngClass]="{'is-collapsed': collapsed}">
            <ng-content></ng-content>
        </div>
    `
})
export class SBItem   {
    @Input() public collapsed: boolean = true;
    @ContentChild(SBItemBody) body: SBItemBody;
    private squeezebox: SqueezeBox;

    constructor(@Inject(forwardRef(() => SqueezeBox)) squeezebox: SqueezeBox) {
        this.squeezebox = squeezebox;
    }

    ngAfterViewInit() {
        this.body.toggle(this.collapsed);
    }
    toggle(collapsed: boolean) {
        this.squeezebox.didItemToggled(this);
        this.applyToggle(collapsed);
    }

    applyToggle(collapsed: boolean) {
        this.collapsed = collapsed;
        this.body.toggle(collapsed);
    }

}
