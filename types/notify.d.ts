export {};

declare module '#app' {
  interface NuxtApp {
    $notify: (message: string, type?: string) => void;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $notify: (message: string, type?: string) => void;
  }
}
