import Logger from '@utils/Logger.js';

const _logger = new Logger('Clipboard');

export default class Clipboard {
  static async copy(text) {
    if (navigator?.clipboard) {
      return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
