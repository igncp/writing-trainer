import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { T_OptionsBlock } from '../../types'

const OptionsBlock: T_OptionsBlock = ({ langOpts, updateLangOpts }) => {
  const { t } = useTranslation()
  const [聲調值, 保存聲調值] = useState(
    (langOpts.聲調值 as string) || '使用聲調',
  )
  const [遊戲模式值, setPlaymodeValue] = useState(
    (langOpts.遊戲模式值 as string) || '還原論者',
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionsChange = (newValues: any) => {
    updateLangOpts({
      ...langOpts,

      聲調值,
      遊戲模式值,

      ...newValues,
    })
  }

  const handleTonesChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    保存聲調值(事件.target.value)

    handleOptionsChange({
      聲調值: 事件.target.value,
    })
  }

  const handlePlaymodeChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    setPlaymodeValue(事件.target.value)

    handleOptionsChange({
      遊戲模式值: 事件.target.value,
    })
  }

  return (
    <div className="flex flex-col gap-[16px] md:flex-row">
      <select
        className="border-[1px] border-[#ccc]"
        onChange={handleTonesChange}
        value={聲調值}
      >
        <option value="不要使用聲調">{t('option.noTones')}</option>
        <option value="使用聲調">{t('option.useTones')}</option>
      </select>
      <select
        className="border-[1px] border-[#ccc]"
        onChange={handlePlaymodeChange}
        value={遊戲模式值}
      >
        <option value="還原論者">{t('option.reductive')}</option>
        <option value="重複的">{t('option.repetitive')}</option>
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
              })
            }}
            type="checkbox"
          />
        </label>
      </span>
      <span className="border-[1px] border-[#ccc] p-[4px]">
        <select
          onChange={e => {
            handleOptionsChange({
              useTonesColors: e.target.value,
            })
          }}
          value={(langOpts.useTonesColors as string) || 'error'}
        >
          <option value={'always'}>{t('option.useTonesColorsAlways')}</option>
          <option value={'never'}>{t('option.useTonesColorsNever')}</option>
          <option value={'current-error'}>
            {t('option.useTonesColorsError')}
          </option>
          <option value={'current'}>{t('option.useTonesColorsCurrent')}</option>
        </select>
      </span>
    </div>
  )
}

export default OptionsBlock
