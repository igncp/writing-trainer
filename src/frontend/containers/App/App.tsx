import React, { useEffect, useState } from 'react'

import { useTextSelection } from '../../utils/hooks'

import Panel from '../Panel/Panel'

const App = () => {
  const [isTextSelected] = useTextSelection()

  if (!isTextSelected) {
    return null
  }

  return <Panel />
}

export default App
