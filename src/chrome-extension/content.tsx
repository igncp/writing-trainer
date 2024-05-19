import { MainContextProvider } from '#/react-ui/containers/main-context'
import { createRoot } from 'react-dom/client'

import Content from '@/containers/Content/Content'
import log from '@/services/log'

const main = () => {
  const div = document.createElement('div')
  const root = createRoot(div)

  document.body.prepend(div)

  root.render(
    <MainContextProvider>
      <Content
        onContentEnabledResult={result => {
          log('ENABLED', result)
        }}
      />
    </MainContextProvider>,
  )
}

setTimeout(main, 100)
