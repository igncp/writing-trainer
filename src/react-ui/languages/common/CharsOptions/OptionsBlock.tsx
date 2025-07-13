import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { gameModes, T_OptionsBlock } from '../../types';

const defaultUseTonesColors = 'current';

const OptionsBlock: T_OptionsBlock = ({ langOpts, updateLangOpts }) => {
  const { t } = useTranslation();

  const [tonesHandling, 保存tonesHandling] = useState(
    (langOpts.tonesHandling as string) || 'with-tones',
  );

  const [gameModeValue, setPlaymodeValue] = useState(
    (langOpts.gameModeValue as string) || 'reductive',
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionsChange = (newValues: any) => {
    updateLangOpts({
      ...langOpts,

      [gameModes?.key ?? '']: gameModeValue,
      tonesHandling,

      ...newValues,
    });
  };

  const handleTonesChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    保存tonesHandling(事件.target.value);

    handleOptionsChange({
      tonesHandling: 事件.target.value,
    });
  };

  const handlePlaymodeChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    setPlaymodeValue(事件.target.value);

    handleOptionsChange({
      gameModeValue: 事件.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-[16px] md:flex-row">
      <select
        className="border-[1px] border-[#ccc]"
        onChange={handleTonesChange}
        value={tonesHandling}
      >
        <option value="without-tones">{t('option.noTones')}</option>
        <option value="with-tones">{t('option.useTones')}</option>
      </select>
      <select
        className="border-[1px] border-[#ccc]"
        onChange={handlePlaymodeChange}
        value={gameModeValue}
      >
        <option value={gameModes?.reductive}>{t('option.reductive')}</option>
        <option value={gameModes?.repetitive}>{t('option.repetitive')}</option>
      </select>
      <span className="border-[1px] border-[#ccc] p-[4px]">
        <label className="flex flex-row gap-[8px]" htmlFor="自動分割文字行">
          <span>{t('option.automaticSplitText')}:</span>
          <input
            checked={!!langOpts.自動分割文字行}
            id="自動分割文字行"
            onChange={() => {
              handleOptionsChange({
                自動分割文字行: !langOpts.自動分割文字行,
              });
            }}
            type="checkbox"
          />
        </label>
      </span>
      <span className="border-[1px] border-[#ccc] p-[4px]">
        <select
          onChange={(e) => {
            handleOptionsChange({
              useTonesColors: e.target.value,
            });
          }}
          value={(langOpts.useTonesColors as string) || defaultUseTonesColors}
        >
          <option value="always">{t('option.useTonesColorsAlways')}</option>
          <option value="never">{t('option.useTonesColorsNever')}</option>
          <option value="current-error">
            {t('option.useTonesColorsError')}
          </option>
          <option value="current">{t('option.useTonesColorsCurrent')}</option>
        </select>
      </span>
    </div>
  );
};

export default OptionsBlock;

export { defaultUseTonesColors };
