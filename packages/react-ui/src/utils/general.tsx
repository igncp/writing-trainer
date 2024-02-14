export const getSelectedText = (): string => {
  return window.getSelection()?.toString() ?? ''
}

export const 將文字複製到剪貼簿 = (文字: string): void => {
  const element = document.createElement('textarea')

  element.innerHTML = 文字

  element.style.position = 'absolute'
  element.style.left = '-9999px'

  document.body.appendChild(element)

  element.select()
  document.execCommand('copy')

  document.body.removeChild(element)
}
