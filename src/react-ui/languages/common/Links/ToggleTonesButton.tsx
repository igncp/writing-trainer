import { useTranslation } from 'react-i18next';

import Button, { T_ButtonProps } from '../../../components/button/button';
import { T_LangOpts } from '../../types';
import { defaultUseTonesColors } from '../CharsOptions/OptionsBlock';

type Props = {
  focusWritingArea: () => void;
  langOpts: T_LangOpts;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLangOpts: (...args: any[]) => void;
} & Omit<T_ButtonProps, 'children'>;

const ToggleTonesButton = ({
  focusWritingArea,
  langOpts,
  updateLangOpts,
  ...rest
}: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={() => {
        const { useTonesColors } = langOpts as { useTonesColors: string };

        updateLangOpts({
          useTonesColors:
            !useTonesColors || useTonesColors === defaultUseTonesColors
              ? 'current-error'
              : defaultUseTonesColors,
        });

        focusWritingArea();
      }}
      {...rest}
    >
      {t('option.toggleTones', 'Toggle Tones')}
    </Button>
  );
};

export default ToggleTonesButton;
