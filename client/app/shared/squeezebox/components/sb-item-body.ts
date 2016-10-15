import { Component, ElementRef, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    exportAs: 'sbItemBody',
    encapsulation: ViewEncapsulation.None,
    selector: 'sb-item-body',
    template: `
        <div #body class="sb-item-body" [style.height]="height">
            <div class="inner"><ng-content></ng-content></div>
        </div>
    `
})
export class SBItemBody {
    @ViewChild('body') bodyEl: ElementRef;
    private height = '0';

    constructor(private renderer: Renderer) {}
    toggle(collapsed: boolean) {
        let height = '0';
        if (!collapsed) {
            this.renderer.setElementStyle(this.bodyEl.nativeElement, 'height', 'auto');
            height = this.bodyEl.nativeElement.offsetHeight + 'px';
            this.renderer.setElementStyle(this.bodyEl.nativeElement, 'height', '0');
        }
        setTimeout(() => this.height = height, 20);
    }
}