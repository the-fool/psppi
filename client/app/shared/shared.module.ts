import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SelectModule } from './select/ng2-select';
import { SqueezeBoxModule } from './squeezebox/squeezebox.module';
import { nvD3 } from 'ng2-nvd3';
import { ToPairsPipe } from './to-pairs.pipe';
@NgModule({
    declarations: [
        nvD3,
        ToPairsPipe
    ],
    exports: [
        SelectModule,
        FormsModule,
        HttpModule,
        CommonModule,
        ModalModule,
        TabsModule,
        ButtonsModule,
        SelectModule,
        nvD3,
        ToPairsPipe,
        SqueezeBoxModule
    ]
})
export default class SharedModule {}
