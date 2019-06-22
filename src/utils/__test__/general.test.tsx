import { copyTextToClipboard, getSelectedText } from '../general'

beforeEach(() => {
  window.getSelection = jest.fn()
  document.execCommand = jest.fn()
  jest.spyOn(document, 'createElement')
})

describe('utils/general', () => {
  it('returns the expected value', () => {
    // tslint:disable-next-line semicolon
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

    copyTextToClipboard('foo')

    expect((document as any).execCommand.mock.calls).toEqual([['copy']])
    expect((document as any).createElement.mock.calls).toEqual([['textarea']])
  })
})
