import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { nvD3 } from 'ng2-nvd3';
@NgModule({
    declarations: [
        nvD3
    ],
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        ModalModule,
        TabsModule,
        ButtonsModule,
        nvD3
    ]
})
export default class SharedModule {}
