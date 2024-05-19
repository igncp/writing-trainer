import { createRoot } from 'react-dom/client'

import Popup from '@/containers/Popup/Popup'

const main = () => {
  const div = document.createElement('div')
  const root = createRoot(div)

  document.body.prepend(div)

  root.render(<Popup />)
}

setTimeout(main, 100)
