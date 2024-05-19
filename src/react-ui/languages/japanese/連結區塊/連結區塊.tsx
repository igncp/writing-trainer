import GTButton from '../../common/Links/GoogleTranslateButton'
import { 類型_連結區塊 } from '../../types'

const 連結區塊: 類型_連結區塊 = ({ 文字 }) => {
  return (
    <div style={{ width: '100%' }}>
      <GTButton language="ja" text={文字} />
    </div>
  )
}

export default 連結區塊
