export {};

declare module '#app' {
  interface NuxtApp {
    /**
     * Displays a dialog with the specified title, message, buttons, and optional input field.
     * @param {string} title - The title of the dialog.
     * @param {string} message - The message to display in the dialog.
     * @param {string[]} buttons - An array of button labels to display in the dialog.
     * @param {boolean} [input=false] - Whether to display an input field in the dialog.
     * @returns {Promise<{ button: string; inputValue: string }>} A promise that resolves with the button clicked and the input value (if any).
     */
    $showDialog: (title: string, message: string, buttons: string[], input?: boolean) => Promise<{ button: string; inputValue: string }>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Displays a dialog with the specified title, message, buttons, and optional input field.
     * @param {string} title - The title of the dialog.
     * @param {string} message - The message to display in the dialog.
     * @param {string[]} buttons - An array of button labels to display in the dialog.
     * @param {boolean} [input=false] - Whether to display an input field in the dialog.
     * @returns {Promise<{ button: string; inputValue: string }>} A promise that resolves with the button clicked and the input value (if any).
     */
    $showDialog: (title: string, message: string, buttons: string[], input?: boolean) => Promise<{ button: string; inputValue: string }>;
  }
}
