/// <reference types="@solidjs/start/env" />
// src/global.d.ts

import "solid-js";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any;
        }
    }
}

