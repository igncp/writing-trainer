import { backendClient } from '#/react-ui/lib/backendClient'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSpinner } from 'react-icons/fa'

import Button, { T_ButtonProps } from '../../../components/button/button'

type Props = {
  text: string
} & Omit<T_ButtonProps, 'children'>

const CantoDictButton = ({ text, ...rest }: Props) => {
  const { t } = useTranslation()
  const [translation, setTranslation] = useState<[string, string] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setIsLoading(true)

          backendClient
            .queryCantodict(text)
            .then(_translation => {
              const final = _translation
                .filter(it => !!it.meaning && it.meaning !== '-')
                .map(it => `- ${it.word}: ${it.meaning}`)
                .join('\n')

              setTranslation([text, final])
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
        {...rest}
      >
        <span className="inline-flex flex-row items-center gap-[4px]">
          <span>{t('option.translateCantodict', 'Use cantodict')}</span>
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
        <>
          <br />
          <div className="line- mb-[24px] whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
            {translation[1]}
          </div>
        </>
      )}
    </>
  )
}

export default CantoDictButton
