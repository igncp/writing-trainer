import { Language } from '#/rust_packages/wasm/pkg/writing_trainer_wasm';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/button/button';
import { changeToSimplified, changeToTraditional } from '../conversion';

type 類型 = {
  language: Language;
  rerender: () => void;
};

const ChangeCharType = ({ language, rerender }: 類型) => {
  const { t } = useTranslation();

  return (
    <>
      <span>
        <Button
          onClick={() => {
            const sourceText = language.get_source_text();
            // @TODO: Do this in wasm
            const traditional = changeToTraditional(sourceText);

            language.set_source_text(traditional);
            rerender();
          }}
        >
          {t('option.changeToTraditional')}
        </Button>
      </span>
      <span>
        <Button
          onClick={() => {
            const sourceText = language.get_source_text();
            // @TODO: Do this in wasm
            const traditional = changeToSimplified(sourceText);

            language.set_source_text(traditional);
            rerender();
          }}
        >
          {t('option.changeToSimplified')}
        </Button>
      </span>
    </>
  );
};

export default ChangeCharType;
