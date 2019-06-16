let changeColor = document.getElementById('changeColor')

interface TData {
  color: string
}

chrome.storage.sync.get('color', (data: TData) => {
  changeColor.style.backgroundColor = data.color
  changeColor.setAttribute('value', data.color)
})

changeColor.onclick = (element: MouseEvent) => {
  const color: string = (element.target as HTMLButtonElement).value

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `document.body.style.backgroundColor = "${color}";`,
    })
  })
}
