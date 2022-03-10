import React, { useState } from 'react'
import Button from 'writing-trainer-react-ui/dist/components/Button/Button'

import openOptionsPage from '#/services/openOptionsPage'
import sendTabsMessage from '#/services/sendTabsMessage'
import { MessageType } from '#/utils/constants'

type Popup = React.FC<{
  onEnableOnceClick?(opt: { setButtonOneEnabled(v: boolean): void }): void
  onOptionsPageClick?(): void
}>

const Popup: Popup = ({ onEnableOnceClick, onOptionsPageClick }) => {
  const [isButtonOneEnabled, setButtonOneEnabled] = useState<boolean>(true)

  return (
    <div style={{ width: 400 }}>
      <div>
        <Button
          disabled={!isButtonOneEnabled}
          onClick={() => {
            onEnableOnceClick({ setButtonOneEnabled })
          }}
        >
          Enable one time
        </Button>
      </div>
      <div>
        <Button onClick={onOptionsPageClick}>Open Config</Button>
      </div>
    </div>
  )
}

Popup.defaultProps = {
  onEnableOnceClick: ({ setButtonOneEnabled }) => {
    sendTabsMessage({ type: MessageType.EnableOnce })
      .then((received: boolean) => {
        if (received) {
          setButtonOneEnabled(false)
        }
      })
      .catch((e: Error) => {
        console.log(e)
      })
  },
  onOptionsPageClick: openOptionsPage,
}

export default Popup
