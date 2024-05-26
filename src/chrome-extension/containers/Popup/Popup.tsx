import { 按鈕 } from '#/react-ui'
import { useState } from 'react'

import openOptionsPage from '@/services/openOptionsPage'
import sendTabsMessage from '@/services/sendTabsMessage'
import { MessageType } from '@/utils/constants'

type onEnableOnceClickOpts = {
  setButtonOneEnabled: (v: boolean) => void
}

const defaultOnEnableOnceClick = ({
  setButtonOneEnabled,
}: onEnableOnceClickOpts) => {
  sendTabsMessage({ type: MessageType.EnableOnce })
    .then((received: boolean) => {
      if (received) {
        setButtonOneEnabled(false)
      }
    })
    .catch((e: Error) => {
      console.log(e)
    })
}

type PopupProps = {
  onEnableOnceClick?: (opt: onEnableOnceClickOpts) => void
  onOptionsPageClick?: () => void
}

const Popup = ({
  onEnableOnceClick = defaultOnEnableOnceClick,
  onOptionsPageClick = openOptionsPage,
}: PopupProps) => {
  const [isButtonOneEnabled, setButtonOneEnabled] = useState<boolean>(true)

  return (
    <div style={{ width: 400 }}>
      <div>
        <按鈕
          disabled={!isButtonOneEnabled}
          onClick={() => {
            onEnableOnceClick({ setButtonOneEnabled })
          }}
        >
          Enable one time
        </按鈕>
      </div>
      <div>
        <按鈕 onClick={onOptionsPageClick}>Open Config</按鈕>
      </div>
    </div>
  )
}

export default Popup
