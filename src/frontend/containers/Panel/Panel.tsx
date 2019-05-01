import React from 'react'

import TextArea from '../../components/TextArea/TextArea'
import PanelBase from '../../components/PanelBase/PanelBase'

type TPanel = React.FC<{
  onHideRequest(): void
  text: string
}>

const Panel: TPanel = ({ onHideRequest, text }) => {
  return (
    <PanelBase>
      <div
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          float: 'right',
          fontSize: 20,
          padding: 10,
        }}
        onClick={onHideRequest}
      >
        Hide
      </div>
      <div>
        <p>Original text:</p>
        <TextArea rows={3}>{text}</TextArea>
        <p>Pronunciation:</p>
        <TextArea rows={2} />
        <p>Special characters:</p>
        <TextArea rows={1} />
        <p>Writing area:</p>
        <TextArea rows={1} />
        <p>Resulting Text:</p>
        <TextArea rows={4} />
      </div>
    </PanelBase>
  )
}

export default Panel
