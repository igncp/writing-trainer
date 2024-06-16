import { useMainContext } from '#/react-ui/containers/main-context'
import { backendClient } from '#/react-ui/lib/backendClient'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSpinner } from 'react-icons/fa'

import Button, { T_ButtonProps } from '../../../components/button/button'

type Props = {
  language: string
  text: string
} & Omit<T_ButtonProps, 'children'>

const TranslateButton = ({ language, text, ...rest }: Props) => {
  const { t } = useTranslation()
  const mainContext = useMainContext()
  const [translation, setTranslation] = useState<[string, string] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = mainContext.state

  return (
    <>
      <Button
        disabled={!isLoggedIn}
        onClick={() => {
          setIsLoading(true)

          backendClient
            .translateText(text, language)
            .then(_translation => {
              setTranslation([text, _translation])
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
        title={isLoggedIn ? '' : t('option.loginUse')}
        {...rest}
      >
        <span className="inline-flex flex-row items-center gap-[4px]">
          <span>{t('option.translateAI')}</span>
          <span
            className={['animate-spin', isLoading ? 'block' : 'hidden'].join(
              ' ',
            )}
          >
            <FaSpinner color="#0f0" />
          </span>
        </span>
      </Button>
      {translation?.[0] === text && (
        <div className="line- mb-[24px] whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
          {translation[1]}
        </div>
      )}
    </>
  )
}

export default TranslateButton
