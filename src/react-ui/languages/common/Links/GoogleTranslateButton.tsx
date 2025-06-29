import { useIsMobile } from '#/react-ui/lib/hooks';
import { useTranslation } from 'react-i18next';

import Button, { T_ButtonProps } from '../../../components/button/button';

type Props = {
  language: string;
  text: string;
} & Omit<T_ButtonProps, 'children'>;

const GoogleTranslateButton = ({ language, text, ...rest }: Props) => {
  const { i18n, t } = useTranslation();
  const isMobile = useIsMobile();

  const hrefText = text
    .split('')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .join('');

  const hrefLang =
    {
      'zh_hant': 'yue',
      'zh-HK': 'yue',
    }[language] ?? 'auto';

  const intoLang =
    {
      en: 'en',
      es: 'es',
      jp: 'ja',
      zh_hant: 'yue',
    }[i18n.language] ?? 'en';

  return (
    <Button
      onClick={() => {
        const link = `https://translate.google.com/?sl=${hrefLang}&tl=${intoLang}&text=${encodeURIComponent(hrefText)}`;

        // Copy to clipboard since sometimes it doesn't work on mobile to
        // directly open the link with the text prefilled
        if (isMobile) {
          void navigator.clipboard.writeText(text);
        }

        window.open(link, '_blank', 'noopener,noreferrer');
      }}
      {...rest}
    >
      {t('option.translateGoogle')}
    </Button>
  );
};

export default GoogleTranslateButton;
