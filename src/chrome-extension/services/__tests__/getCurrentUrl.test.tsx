import { MessageType } from '@/utils/constants'

import { _test } from '../getCurrentUrl'

const { getFromHref, getWithChrome } = _test!

const chrome: any = {
  runtime: {
    sendMessage: jest.fn<any, any>(),
  },
}
;(global as any)['chrome'] = chrome

beforeEach(() => {
  chrome.runtime.sendMessage.mockImplementation((_: any, fn: any) => {
    fn('messageResult')
  })
})

describe('getWithChrome', () => {
  it('calls the expected API', async () => {
    const result = await getWithChrome()

    expect(result).toEqual('messageResult')

    expect(chrome.runtime.sendMessage.mock.calls).toEqual([
      [{ type: MessageType.RequestUrl }, expect.any(Function)],
    ])
  })
})

describe('getFromHref', () => {
  it('returns the value from window', async () => {
    const result = await getFromHref()

    expect(result).toEqual(window.location.href)
    expect(!!window.location.href).toEqual(true)
  })
})
