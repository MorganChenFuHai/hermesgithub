/** 由 OpenClaw 网关在运行时提供；本地仅作类型校验 */
declare module "openclaw/plugin-sdk/plugin-entry" {
  export interface PluginRegisterApi {
    /** ~/.openclaw/openclaw.json → plugins.entries.<插件 id>.config */
    pluginConfig?: unknown;
    registerTool?: (tool: unknown) => void;
    on?: (event: string, handler: (...args: any[]) => any) => void;
    registerCli?: (
      registerFn: (ctx: { program: any }) => void,
      options: { descriptors: { name: string; description: string; hasSubcommands: boolean }[] }
    ) => void;
  }

  export interface PluginEntry {
    id: string;
    name: string;
    description: string;
    register(api: PluginRegisterApi): void;
  }

  export function definePluginEntry(entry: PluginEntry): unknown;
}
