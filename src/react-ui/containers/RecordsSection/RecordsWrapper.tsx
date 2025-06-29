import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../components/button/button';

type IProps = {
  children: ReactNode;
  onRecordsClose: () => void;
};

const RecordsWrapper = ({ children, onRecordsClose }: IProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Button onClick={onRecordsClose}>{t('record.close')}</Button>
      <div>{children}</div>
    </div>
  );
};

export default RecordsWrapper;
