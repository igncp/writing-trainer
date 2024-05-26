import { 字元對象類別 } from '#/core'
import CharactersDisplay from '#/react-ui/components/CharactersDisplay/CharactersDisplay'
import { AnkiGql } from '#/react-ui/graphql/graphql'
import { backendClient } from '#/react-ui/lib/backendClient'
import { useEffect, useState } from 'react'
import { FaSpinner, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

import 按鈕 from '../../components/按鈕/按鈕'
import 文字區 from '../../components/文字區/文字區'

export enum AnkisMode {
  Add = 'add',
  Main = 'main',
}

type Props = {
  language: string
  mode: AnkisMode
  setMode: (mode: AnkisMode | null) => void
  字元對象列表: 字元對象類別[]
}

const AnkisMain = ({ setMode }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ankis, setAnkis] = useState<AnkiGql[]>([])

  useEffect(() => {
    setIsLoading(true)

    backendClient
      .getUserAnkis()
      .then(_ankis => {
        setAnkis(_ankis)
      })
      .catch(() => {
        toast.error('Failed to load ankis')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div>
      <div>清單{!!ankis.length && ` (${ankis.length})`}</div>
      <按鈕 onClick={() => toast.info('即將推出')}>開始 Anki 回合</按鈕>
      <按鈕 onClick={() => setMode(AnkisMode.Add)}>添新</按鈕>
      {isLoading ? (
        <div>
          <span className="animate-spin">
            <FaSpinner color="#00f" />
          </span>
        </div>
      ) : (
        <ul className="width-max flex flex-col">
          {ankis.map(anki => (
            <li
              className="flex flex-1 flex-row py-[3px] even:bg-[#333]"
              key={anki.id}
            >
              - <span className="ml-[4px] flex-1">{anki.front}</span>{' '}
              <span className="mx-[12px]">{anki.language}</span>{' '}
              <button
                className="mr-[8px]"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true)

                  backendClient
                    .saveAnki({
                      back: '',
                      front: '',
                      id: anki.id,
                      language: '',
                    })
                    .then(() => {
                      setAnkis(ankis.filter(_anki => _anki.id !== anki.id))
                    })
                    .catch(() => {
                      toast.error('Failed to delete anki')
                    })
                    .finally(() => {
                      setIsLoading(false)
                    })
                }}
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const AnkisAdd = ({ language, setMode, 字元對象列表 }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [frontVal, setFrontVal] = useState('')
  const [backVal, setBackVal] = useState('')

  return (
    <div>
      <按鈕 onClick={() => setMode(AnkisMode.Main)}>顯示清單</按鈕>
      <按鈕
        onClick={() => {
          navigator.clipboard.writeText(
            字元對象列表.map(字元對象 => 字元對象.word).join(''),
          )
        }}
      >
        複製文字字元
      </按鈕>
      <按鈕
        onClick={() => {
          navigator.clipboard.writeText(
            字元對象列表.map(字元對象 => 字元對象.pronunciation).join(' '),
          )
        }}
      >
        複製文字發音
      </按鈕>
      <div className="my-[8px]">
        <CharactersDisplay 字元對象列表={字元對象列表} 應該隱藏發音={false} />
      </div>
      <文字區
        className="border-[#777]"
        onChange={e => setFrontVal(e.target.value)}
        placeholder="前面"
        tabIndex={1}
        value={frontVal}
      />
      <文字區
        className="border-[#777]"
        onChange={e => setBackVal(e.target.value)}
        placeholder="背面"
        tabIndex={2}
        value={backVal}
      />
      <按鈕
        disabled={isLoading || !frontVal || !backVal}
        onClick={() => {
          setIsLoading(true)

          backendClient
            .saveAnki({
              back: backVal,
              front: frontVal,
              id: '',
              language,
            })
            .then(() => {
              setMode(AnkisMode.Main)
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
      >
        保存
      </按鈕>
    </div>
  )
}

export const AnkisSection = (props: Props) => {
  const { mode, setMode } = props

  return (
    <div>
      <h1>Ankis</h1>
      <按鈕 onClick={() => setMode(null)}>關閉</按鈕>
      {mode === AnkisMode.Main && <AnkisMain {...props} />}
      {mode === AnkisMode.Add && <AnkisAdd {...props} />}
    </div>
  )
}
