import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        FormsModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class SharedModule {}