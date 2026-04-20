/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // Add more env variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    // Add glob type for Vite
    glob: (pattern: string, options?: { as?: string; eager?: boolean }) => Record<string, any>
}
