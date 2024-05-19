import { ChangeEvent, useState } from 'react'

import { T_OptionsBlock } from '../../types'

const OptionsBlock: T_OptionsBlock = ({ 更改語言選項, 語言選項 }) => {
  const [聲調值, 保存聲調值] = useState(
    (語言選項.聲調值 as string) || '使用聲調',
  )
  const [遊戲模式值, setPlaymodeValue] = useState(
    (語言選項.遊戲模式值 as string) || '還原論者',
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionsChange = (newValues: any) => {
    更改語言選項({
      ...語言選項,

      聲調值,
      遊戲模式值,

      ...newValues,
    })
  }

  const handleTonesChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    保存聲調值(事件.target.value)

    handleOptionsChange({
      聲調值: 事件.target.value,
    })
  }

  const handlePlaymodeChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    setPlaymodeValue(事件.target.value)

    handleOptionsChange({
      遊戲模式值: 事件.target.value,
    })
  }

  return (
    <div>
      <select onChange={handleTonesChange} value={聲調值}>
        <option value="不要使用聲調">不要使用聲調</option>
        <option value="使用聲調">使用聲調</option>
      </select>
      <select onChange={handlePlaymodeChange} value={遊戲模式值}>
        <option value="還原論者">還原論者</option>
        <option value="重複的">重複的</option>
      </select>
      <span style={{ marginLeft: 10 }}>
        <label htmlFor="自動分割文字行">
          自動分割文字行:
          <input
            checked={!!語言選項.自動分割文字行}
            id="自動分割文字行"
            onChange={() => {
              handleOptionsChange({
                自動分割文字行: !語言選項.自動分割文字行,
              })
            }}
            type="checkbox"
          />
        </label>
      </span>
      <span style={{ marginLeft: 10 }}>
        <label htmlFor="使用聲調的顏色">
          使用聲調的顏色:
          <input
            checked={語言選項.使用聲調的顏色 !== false}
            id="使用聲調的顏色"
            onChange={() => {
              handleOptionsChange({
                使用聲調的顏色: !語言選項.使用聲調的顏色,
              })
            }}
            type="checkbox"
          />
        </label>
      </span>
    </div>
  )
}

export default OptionsBlock
