export default defineNuxtPlugin((nuxtApp) => {
  const dialog = useState<{ show: boolean; title: string; message: string; buttons: string[]; input?: boolean; inputValue: string; resolve?: (value: any) => void }>('dialog', () => ({
    show: false,
    title: '',
    message: '',
    buttons: [],
    input: false,
    inputValue: ''
  }));
  
  /**
   * Displays a dialog with the specified title, message, buttons, and optional input field.
   * @param {string} title - The title of the dialog.
   * @param {string} message - The message to display in the dialog.
   * @param {string[]} buttons - An array of button labels to display in the dialog.
   * @param {boolean} [input=false] - Whether to display an input field in the dialog.
   * @returns {Promise<{ button: string; inputValue: string }>} A promise that resolves with the button clicked and the input value (if any).
   */
  const displayDialog = (title: string, message: string, buttons: string[], input: boolean = false) => {
    return new Promise<{ button: string; inputValue: string }>((resolve) => {
      dialog.value = { show: true, title, message, buttons, input, inputValue: '', resolve };
    });
  };

  nuxtApp.provide('showDialog', displayDialog);
});