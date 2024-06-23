import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import { backendClient } from '../lib/backendClient'

type MainContextState = {
  canUseAI: boolean
  isBackendActive: boolean
  isLoggedIn: boolean
}

const initialState: MainContextState = {
  canUseAI: false,
  isBackendActive: false,
  isLoggedIn: false,
}

type ContextAction =
  | {
      payload: boolean
      type: 'SET_BACKEND_ACTIVE'
    }
  | {
      payload: boolean
      type: 'SET_IS_LOGGED_IN'
    }
  | {
      payload: boolean
      type: 'SET_CAN_USE_AI'
    }

type MainContextType = readonly [
  MainContextState,
  React.Dispatch<ContextAction>,
]

const Context = createContext<MainContextType>([
  initialState,
  () => {},
] as const)

const reducer = (state: MainContextState, action: ContextAction) => {
  switch (action.type) {
    case 'SET_BACKEND_ACTIVE':
      return { ...state, isBackendActive: action.payload }
    case 'SET_IS_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload }
    case 'SET_CAN_USE_AI':
      return { ...state, canUseAI: action.payload }
    default:
      return state
  }
}

export const MainContextProvider = ({ children }: PropsWithChildren) => {
  const [mainState, setMainState] = useReducer(reducer, initialState)
  const value = useMemo(() => [mainState, setMainState] as const, [mainState])

  useEffect(() => {
    backendClient
      .getHealth()
      .then(() => {
        setMainState({
          payload: true,
          type: 'SET_BACKEND_ACTIVE',
        })

        return backendClient.getInfo()
      })
      .then(({ canUseAI }) => {
        setMainState({
          payload: true,
          type: 'SET_IS_LOGGED_IN',
        })

        setMainState({
          payload: canUseAI,
          type: 'SET_CAN_USE_AI',
        })
      })
      .catch(() => {
        // It is expected that in some cases the backend will not be active
      })
  }, [])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useMainContext = () => {
  type RefContent = {
    dispatch: MainContextType[1]
    state: MainContextType[0]
  }

  const ref = useRef<RefContent>({} as RefContent)
  const context = useContext(Context)

  ref.current.state = context[0]
  ref.current.dispatch = context[1]

  return ref.current
}
