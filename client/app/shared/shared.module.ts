import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
@NgModule({
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        ModalModule,
        TabsModule,
        ButtonsModule
    ]
})
export default class SharedModule {}
