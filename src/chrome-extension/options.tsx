import { createRoot } from 'react-dom/client'

import Options from '@/containers/Options/Options'

const main = () => {
  const div = document.createElement('div')
  const root = createRoot(div)

  document.body.prepend(div)

  root.render(<Options />)
}

setTimeout(main, 100)
