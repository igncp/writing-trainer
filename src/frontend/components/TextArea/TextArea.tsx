import React from 'react'

type TTextArea = React.FC<{
  [key: string]: any
}>

const TextArea: TTextArea = props => {
  return (
    <textarea style={{ width: '100%' }} data-gramm_editor={false} {...props} />
  )
}

export default TextArea
