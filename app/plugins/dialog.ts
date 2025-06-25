export default defineNuxtPlugin((nuxtApp) => {
  const dialog = useState<{
    show: boolean;
    title: string;
    desc: string;
    inputs: Array<{
      label: string;
      type: string;
      placeholder?: string;
      dropdownopts?: Array<{ value: string; default: boolean }>;
      color?: string;
      textcolor?: string;
      value?: any;
      accepts?: string;
    }>;
    buttons: Array<{
      label: string;
      value: string;
      color?: string;
      textcolor?: string;
    }>;
    resolve?: (value: any) => void;
  }>('dialog', () => ({
    show: false,
    title: '',
    desc: '',
    inputs: [],
    buttons: []
  }));

  /**
   * Displays a dialog with the specified title, description, inputs, and buttons.
   * @param {Object} config - The configuration object for the dialog.
   * @param {string} config.title - The title of the dialog.
   * @param {string} config.desc - The description to display in the dialog.
   * @param {Array<{ label: string; type: string; placeholder?: string; dropdownopts?: Array<{ value: string; default: boolean }>; color?: string; textcolor: string }>} [config.inputs] - An array of input fields with labels, types, and optional properties.
   * @param {Array<{ label: string; value: string; color?: string; textcolor?: string }>} [config.buttons] - An array of button configurations.
   * @returns {Promise<{ button: string; inputs: { label: string; value: string }[] }>} A promise that resolves with the button clicked and the input values.
   */
  const displayDialog = (config: {
    title: string;
    desc: string;
    inputs?: Array<{
      label: string;
      type: string;
      placeholder?: string;
      dropdownopts?: Array<{ value: string; default: boolean }>;
      color?: string;
      textcolor: string;
      accepts?: string;
    }>;
    buttons?: Array<{
      label: string;
      value: string;
      color?: string;
      textcolor?: string;
    }>;
  }) => {
    return new Promise<{ button: string; inputs: { label: string; value: string }[] }>((resolve) => {
      const processedInputs = config.inputs?.map((input) => {
        if (input.type === 'dropdown' && input.dropdownopts) {
          const defaultOption = input.dropdownopts.find((opt) => opt.default);
          return {
            ...input,
            value: defaultOption ? defaultOption.value : ''
          };
        }
        return input;
      }) || [];

      dialog.value = {
        show: true,
        title: config.title,
        desc: config.desc,
        inputs: processedInputs,
        buttons: config.buttons || [],
        resolve
      };
    });
  };

  nuxtApp.provide('showDialog', displayDialog);
});

