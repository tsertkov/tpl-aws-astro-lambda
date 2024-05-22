/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly VERSION: string | undefined
  readonly ENV: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
