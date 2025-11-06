declare module '@vitejs/plugin-react' {
  import { PluginOption } from 'vite';
  interface Options {
    jsxImportSource?: string;
    babel?: {
      plugins?: Array<[string, Record<string, unknown>] | string>;
    };
    fastRefresh?: boolean;
  }
  export default function reactPlugin(options?: Options): PluginOption;
}
