import Button from '#/react-ui/components/button/button'
import { backendClient } from '#/react-ui/lib/backendClient'
import { TOOLTIP_ID } from '#/utils/tooltip'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useMainContext } from '../main-context'

const LoginWidget = () => {
  const mainContext = useMainContext()
  const { t } = useTranslation()

  const { isBackendActive, isLoggedIn } = mainContext.state

  if (!isBackendActive) return null

  return (
    <>
      <div
        className="flex items-center justify-center"
        data-tooltip-content={t('auth.backendActive')}
        data-tooltip-id={TOOLTIP_ID}
      >
        <div
          className={[
            'ml-[12px] inline-block h-[15px] w-[15px] rounded-[50%]',
            'animate-pulse bg-[#125a12]',
          ].join(' ')}
        />
      </div>
      {isLoggedIn ? (
        <>
          <span className="ml-[12px] flex items-center justify-center">
            {t('auth.alreadyLoggedIn')}
          </span>
          <Button
            className="ml-[12px]"
            onClick={() => {
              backendClient.logout().then(() => {
                mainContext.dispatch({
                  payload: false,
                  type: 'SET_IS_LOGGED_IN',
                })
              })
            }}
          >
            {t('auth.logout')}
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            backendClient.login()
          }}
        >
          {t('auth.login')}
        </Button>
      )}
    </>
  )
}

export default memo(LoginWidget)
