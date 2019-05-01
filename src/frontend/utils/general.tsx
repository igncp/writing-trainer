export const getSelectedText = ({ trim = true } = {}): string => {
  let selection = window.getSelection().toString()

  if (trim) {
    selection = selection.trim()
  }

  return selection
}
