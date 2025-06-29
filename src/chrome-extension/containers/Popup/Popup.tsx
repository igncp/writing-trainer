import openOptionsPage from '@/services/openOptionsPage';
import sendTabsMessage from '@/services/sendTabsMessage';
import { MessageType } from '@/utils/constants';
import { Button } from '#/react-ui';
import { useState } from 'react';

type onEnableOnceClickOpts = {
  setButtonOneEnabled: (v: boolean) => void;
};

const defaultOnEnableOnceClick = ({
  setButtonOneEnabled,
}: onEnableOnceClickOpts) => {
  sendTabsMessage({ type: MessageType.EnableOnce })
    .then((received: boolean) => {
      if (received) {
        setButtonOneEnabled(false);
      }
    })
    .catch((e: Error) => {
      console.error(e);
    });
};

type PopupProps = {
  onEnableOnceClick?: (opt: onEnableOnceClickOpts) => void;
  onOptionsPageClick?: () => void;
};

const Popup = ({
  onEnableOnceClick = defaultOnEnableOnceClick,
  onOptionsPageClick = openOptionsPage,
}: PopupProps) => {
  const [isButtonOneEnabled, setButtonOneEnabled] = useState<boolean>(true);

  return (
    <div style={{ width: 400 }}>
      <div>
        <Button
          disabled={!isButtonOneEnabled}
          onClick={() => {
            onEnableOnceClick({ setButtonOneEnabled });
          }}
        >
          Enable one time
        </Button>
      </div>
      <div>
        <Button onClick={onOptionsPageClick}>Open Config</Button>
      </div>
    </div>
  );
};

export default Popup;
