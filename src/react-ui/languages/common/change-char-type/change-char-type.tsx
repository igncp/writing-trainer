import { useTranslation } from 'react-i18next';

import Button from '../../../components/button/button';
import { T_Fragments } from '../../types';
import { changeToSimplified, changeToTraditional } from '../conversion';

type 類型 = {
  fragments: T_Fragments;
  updateFragments: (list: T_Fragments) => void;
};

const ChangeCharType = ({ fragments, updateFragments }: 類型) => {
  const { t } = useTranslation();

  return (
    <>
      <span>
        <Button
          onClick={() => {
            updateFragments({
              ...fragments,
              list: fragments.list.map(changeToTraditional),
            });
          }}
        >
          {t('option.changeToTraditional')}
        </Button>
      </span>
      <span>
        <Button
          onClick={() => {
            updateFragments({
              ...fragments,
              list: fragments.list.map(changeToSimplified),
            });
          }}
        >
          {t('option.changeToSimplified')}
        </Button>
      </span>
    </>
  );
};

export default ChangeCharType;
