export {};

declare module '#app' {
  interface NuxtApp {
    /**
     * Displays a dialog with the specified title, message, buttons, and optional input fields.
     * @param {string} title - The title of the dialog.
     * @param {string} message - The message to display in the dialog.
     * @param {string[]} buttons - An array of button labels to display in the dialog.
     * @param {Array<{ label: string; value: string }>} [inputs=[]] - An array of input fields with labels and default values.
     * @returns {Promise<{ button: string; inputs: { label: string; value: string }[] }>} A promise that resolves with the button clicked and the input values.
     */
    $showDialog: (
      title: string,
      message: string,
      buttons: string[],
      inputs?: { label: string; value: string }[]
    ) => Promise<{ button: string; inputs: { label: string; value: string }[] }>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Displays a dialog with the specified title, message, buttons, and optional input fields.
     * @param {string} title - The title of the dialog.
     * @param {string} message - The message to display in the dialog.
     * @param {string[]} buttons - An array of button labels to display in the dialog.
     * @param {Array<{ label: string; value: string }>} [inputs=[]] - An array of input fields with labels and default values.
     * @returns {Promise<{ button: string; inputs: { label: string; value: string }[] }>} A promise that resolves with the button clicked and the input values.
     */
    $showDialog: (
      title: string,
      message: string,
      buttons: string[],
      inputs?: { label: string; value: string }[]
    ) => Promise<{ button: string; inputs: { label: string; value: string }[] }>;
  }
}
