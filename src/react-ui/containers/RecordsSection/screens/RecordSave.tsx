import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/button/button';
import TextInput from '../../../components/TextInput/TextInput';
import { T_Services } from '../../../typings/mainTypes';

interface RecordToSave {
  link: string;
  name: string;
}

type RecordSaveProps = {
  disabled?: boolean;
  initialRecord: null | RecordToSave;
  onRecordSave: (r: RecordToSave) => void;
  onShowRecordsList: () => void;
  services: T_Services;
};

const RecordSave = ({
  disabled,
  initialRecord,
  onRecordSave,
  onShowRecordsList,
  services,
}: RecordSaveProps) => {
  const [recordName, setRecordName] = useState<string>(
    initialRecord ? initialRecord.name : '',
  );

  const [recordLink, setRecordLink] = useState<string>(
    initialRecord ? initialRecord.link : '',
  );

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const linkInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    services
      .getCurrentUrl()
      .then((newCurrentUrl) => {
        setCurrentUrl(newCurrentUrl);
        setRecordLink(newCurrentUrl);
      })
      .catch((e: Error) => {
        console.error(e);
      });
  }, [services]);

  if (!currentUrl) {
    return null;
  }

  const isSaveButtonDisabled = !recordName;

  const handleRecordSave = () => {
    if (!isSaveButtonDisabled) {
      onRecordSave({
        link: recordLink.trim(),
        name: recordName,
      });
    }
  };

  return (
    <>
      <div>
        <Button disabled={disabled} onClick={onShowRecordsList}>
          {t('record.list')}
        </Button>
      </div>
      <div>
        <div style={{ padding: 10 }}>
          {t('record.name')}:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              autoFocus
              onChange={(e) => {
                setRecordName(e.target.value);
              }}
              onEnterPress={() => {
                if (recordName) {
                  linkInputRef.current?.focus();
                }
              }}
              tabIndex={1}
              value={recordName}
            />
          </span>
        </div>
        <div style={{ padding: 10 }}>
          {t('record.link')}:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              inputRef={linkInputRef}
              onChange={(e) => {
                setRecordLink(e.target.value);
              }}
              onEnterPress={handleRecordSave}
              tabIndex={2}
              value={recordLink}
            />
          </span>
        </div>
      </div>
      <div>
        <Button
          disabled={isSaveButtonDisabled || disabled}
          onClick={handleRecordSave}
          tabIndex={3}
        >
          {t('record.save')}
        </Button>
      </div>
    </>
  );
};

export default RecordSave;

export { type RecordToSave };
