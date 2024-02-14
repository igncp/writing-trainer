import { 類型_文字片段列表 } from '#/languages/types'
import React from 'react'

import 按鈕 from '../../../components/按鈕/按鈕'
import { 繁體轉簡體 } from '../conversion'

type 類型 = {
  文字片段列表: 類型_文字片段列表
  更改文字片段列表: (列表: 類型_文字片段列表) => void
}

const 字元類型更改 = ({ 文字片段列表, 更改文字片段列表 }: 類型) => (
  <>
    <span>
      <按鈕
        onClick={() => {
          const 簡體轉繁體 = Object.entries(繁體轉簡體).reduce<
            Record<string, string>
          >((acc, [k, v]) => {
            if (!v) return acc

            v.forEach(s => {
              acc[s] = k
            })

            return acc
          }, {})

          更改文字片段列表({
            ...文字片段列表,
            列表: 文字片段列表.列表.map(文字行 =>
              文字行
                .split('')
                .map(字元 => 簡體轉繁體[字元] || 字元)
                .join(''),
            ),
          })
        }}
      >
        轉換為繁體字
      </按鈕>
    </span>
    <span>
      <按鈕
        onClick={() => {
          更改文字片段列表({
            ...文字片段列表,
            列表: 文字片段列表.列表.map(文字行 =>
              文字行
                .split('')
                .map(字元 => 繁體轉簡體[字元] ?? 字元)
                .join(''),
            ),
          })
        }}
      >
        轉換為簡體字
      </按鈕>
    </span>
  </>
)

export default 字元類型更改
