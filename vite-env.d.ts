/// <reference types="vite/client" />
/// <reference types="vite/client" />
/// <reference types="react" />

interface ImportMetaEnv {
  [key: string]: string | undefined;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
