import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { nvD3 } from 'ng2-nvd3';
import { ToPairsPipe } from './to-pairs.pipe';
@NgModule({
    declarations: [
        nvD3,
        ToPairsPipe
    ],
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        ModalModule,
        TabsModule,
        ButtonsModule,
        nvD3,
        ToPairsPipe
    ]
})
export default class SharedModule {}
