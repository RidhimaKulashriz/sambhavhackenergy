/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

// Type definitions for environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend the JSX namespace for custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
