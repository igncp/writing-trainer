import React, { useState } from 'react'
import { Button } from 'writing-trainer-react-ui'

import openOptionsPage from '@/services/openOptionsPage'
import sendTabsMessage from '@/services/sendTabsMessage'
import { MessageType } from '@/utils/constants'

type onEnableOnceClickOpts = {
  setButtonOneEnabled: (v: boolean) => void
}

type PopupProps = {
  onEnableOnceClick?: (opt: onEnableOnceClickOpts) => void
  onOptionsPageClick?: () => void
}

const Popup = ({ onEnableOnceClick, onOptionsPageClick }: PopupProps) => {
  const [isButtonOneEnabled, setButtonOneEnabled] = useState<boolean>(true)

  return (
    <div style={{ width: 400 }}>
      <div>
        <Button
          disabled={!isButtonOneEnabled}
          onClick={() => {
            onEnableOnceClick?.({ setButtonOneEnabled })
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
  onEnableOnceClick: ({ setButtonOneEnabled }: onEnableOnceClickOpts) => {
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
