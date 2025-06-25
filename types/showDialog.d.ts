export {};

declare module '#app' {
  interface NuxtApp {
    /**
     * Displays a dialog with the specified configuration.
     * @param {Object} config - The configuration object for the dialog.
     * @param {string} config.title - The title of the dialog.
     * @param {string} config.desc - The description to display in the dialog.
     * @param {Array<{ label: string; type: string; placeholder?: string; dropdownopts?: Array<{ value: string; default: boolean }>; color?: string; textcolor: string }>} [config.inputs] - An array of input fields with labels, types, and optional properties.
     * @param {Array<{ label: string; value: string; color?: string; textcolor?: string }>} [config.buttons] - An array of button configurations.
     * @returns {Promise<{ button: string; inputs: { label: string; value: string }[] }>} A promise that resolves with the button clicked and the input values.
     */
    $showDialog: (config: {
      title: string;
      desc: string;
      inputs?: Array<{
        label: string;
        type: string;
        placeholder?: string;
        dropdownopts?: Array<{ value: string; default: boolean }>;
        color?: string;
        textcolor?: string;
        value?: any;
        accepts?: string;
      }>;
      buttons?: Array<{
        label: string;
        value: string;
        color?: string;
        textcolor?: string;
      }>;
    }) => Promise<{ button: string; inputs: { label: string; value: any }[] }>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Displays a dialog with the specified configuration.
     * @param {Object} config - The configuration object for the dialog.
     * @param {string} config.title - The title of the dialog.
     * @param {string} config.desc - The description to display in the dialog.
     * @param {Array<{ label: string; type: string; placeholder?: string; dropdownopts?: Array<{ value: string; default: boolean }>; color?: string; textcolor: string }>} [config.inputs] - An array of input fields with labels, types, and optional properties.
     * @param {Array<{ label: string; value: string; color?: string; textcolor?: string }>} [config.buttons] - An array of button configurations.
     * @returns {Promise<{ button: string; inputs: { label: string; value: string }[] }>} A promise that resolves with the button clicked and the input values.
     */
    $showDialog: (config: {
      title: string;
      desc: string;
      inputs?: Array<{
        label: string;
        type: string;
        placeholder?: string;
        dropdownopts?: Array<{ value: string; default: boolean }>;
        color?: string;
        textcolor?: string;
        value?: string;
        accepts?: string;
      }>;
      buttons?: Array<{
        label: string;
        value: string;
        color?: string;
        textcolor?: string;
      }>;
    }) => Promise<{ button: string; inputs: { label: string; value: string }[] }>;
  }
}
