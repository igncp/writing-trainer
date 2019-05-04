export const getSelectedText = (): string => {
  return window.getSelection().toString()
}

export const copyTextToClipboard = (str: string): void => {
  const element = document.createElement('textarea')

  element.innerHTML = str

  element.style.position = 'absolute'
  element.style.left = '-9999px'
  ;(document.body as any).appendChild(element)

  element.select()
  document.execCommand('copy')
  ;(document.body as any).removeChild(element)
}
