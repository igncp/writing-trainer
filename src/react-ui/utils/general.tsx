export const getSelectedText = (): string =>
  window.getSelection()?.toString() ?? '';
