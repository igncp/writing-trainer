import 按鈕 from '../../../components/按鈕/按鈕'
import { 類型_文字片段列表 } from '../../types'
import { changeToSimplified, changeToTraditional } from '../conversion'

type 類型 = {
  文字片段列表: 類型_文字片段列表
  更改文字片段列表: (列表: 類型_文字片段列表) => void
}

const 字元類型更改 = ({ 文字片段列表, 更改文字片段列表 }: 類型) => (
  <>
    <span>
      <按鈕
        onClick={() => {
          更改文字片段列表({
            ...文字片段列表,
            列表: 文字片段列表.列表.map(changeToTraditional),
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
            列表: 文字片段列表.列表.map(changeToSimplified),
          })
        }}
      >
        轉換為簡體字
      </按鈕>
    </span>
  </>
)

export default 字元類型更改
