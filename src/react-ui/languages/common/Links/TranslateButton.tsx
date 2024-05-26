import { useMainContext } from '#/react-ui/containers/main-context'
import { backendClient } from '#/react-ui/lib/backendClient'
import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

import 按鈕, { T_ButtonProps } from '../../../components/按鈕/按鈕'

type Props = {
  language: string
  text: string
} & Omit<T_ButtonProps, 'children'>

const TranslateButton = ({ language, text, ...rest }: Props) => {
  const mainContext = useMainContext()
  const [translation, setTranslation] = useState<[string, string] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = mainContext.state

  return (
    <>
      <按鈕
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
        title={isLoggedIn ? '' : 'Please log in to use this feature'}
        {...rest}
      >
        <span className="inline-flex flex-row items-center gap-[4px]">
          <span>Translate AI</span>
          <span
            className={['animate-spin', isLoading ? 'block' : 'hidden'].join(
              ' ',
            )}
          >
            <FaSpinner color="#0f0" />
          </span>
        </span>
      </按鈕>
      {translation?.[0] === text && (
        <div className="line- mb-[24px] whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
          {translation[1]}
        </div>
      )}
    </>
  )
}

export default TranslateButton
