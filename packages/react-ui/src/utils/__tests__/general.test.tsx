import { 將文字複製到剪貼簿, getSelectedText } from '../general'

beforeEach(() => {
  window.getSelection = jest.fn()
  document.execCommand = jest.fn()

  jest.spyOn(document, 'createElement')
})

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElement.mockRestore()
})

describe('utils/general', () => {
  it('returns the expected value', () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi,padding-line-between-statements
    ;(window as any).getSelection.mockReturnValue({
      toString: () => 'toStringValue',
    })

    expect(getSelectedText()).toEqual('toStringValue')
  })
})

describe('copyTextToClipboard', () => {
  it('calls the expected function', () => {
    expect((document as any).execCommand.mock.calls).toEqual([])
    expect((document as any).createElement.mock.calls).toEqual([])

    將文字複製到剪貼簿('foo')

    expect((document as any).execCommand.mock.calls).toEqual([['copy']])
    expect((document as any).createElement.mock.calls).toEqual([['textarea']])
  })
})
