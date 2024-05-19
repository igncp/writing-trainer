import 按鈕 from '#/react-ui/components/按鈕/按鈕'
import { backendClient } from '#/react-ui/lib/backendClient'
import { memo } from 'react'

import { useMainContext } from '../main-context'

const LoginWidget = () => {
  const mainContext = useMainContext()

  const { isBackendActive, isLoggedIn } = mainContext.state

  return (
    <>
      <div
        className={[
          'ml-[12px] inline-block h-[15px] w-[15px] rounded-[50%]',
          isBackendActive ? 'animate-pulse bg-[#125a12]' : 'bg-[#403e3e]',
        ].join(' ')}
      />
      {isBackendActive && (
        <>
          {isLoggedIn ? (
            <>
              <span className="ml-[12px]">Logged in</span>
              <按鈕
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
                Log out
              </按鈕>
            </>
          ) : (
            <按鈕
              onClick={() => {
                backendClient.login()
              }}
            >
              Log in
            </按鈕>
          )}
        </>
      )}
    </>
  )
}

export default memo(LoginWidget)
