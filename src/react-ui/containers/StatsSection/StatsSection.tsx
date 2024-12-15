import Button from '#/react-ui/components/button/button'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  deleteDatabase,
  getStats,
  StatsResult,
} from '../../languages/common/stats'

type Props = {
  onClose: () => void
  selectedLanguage: string
}

const rowClasses = 'border-b-[1px] border-[#ccc] even:bg-[#222]'
const cellClasses = 'p-[8px]'

export const StatsSection = ({ onClose, selectedLanguage }: Props) => {
  const { t } = useTranslation()

  const [isShowingChars, setIsShowingChars] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const [stats, setStats] = useState<null | StatsResult>(null)

  const retrieveStats = useCallback(async () => {
    if (process.env.NODE_ENV === 'test') return

    getStats(selectedLanguage)
      .then(result => {
        setStats(result)
      })
      .catch(err => {
        console.error('Error getting stats:', err)
      })
  }, [selectedLanguage])

  useEffect(() => {
    retrieveStats()
  }, [retrieveStats])

  const displayPerc = (perc: number | undefined) => {
    if (perc === undefined) return '-'

    return `${(perc * 100).toFixed(2)}%`
  }

  return (
    <div>
      <Button onClick={onClose}>Close</Button>
      {!!stats && (
        <div className="mt-[8px] flex flex-col gap-[16px]">
          <table className="w-full border-[1px] border-[#ccc] p-[8px]">
            <thead>
              <tr className={rowClasses}>
                <th>{t('panel.title', 'Metric')}</th>
                <th>{t('panel.allTime', 'All Time')}</th>
                <th>{t('panel.today', 'Today')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.successPerc', 'Success Percentage')}
                </td>
                <td className={cellClasses}>
                  {displayPerc(stats.successPerc.allTime)}
                </td>
                <td className={cellClasses}>
                  {displayPerc(stats.successPerc.today)}
                </td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.successCount', 'Success Count')}
                </td>
                <td className={cellClasses}>{stats.successCount.allTime}</td>
                <td className={cellClasses}>{stats.successCount.today}</td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.failCount', 'Fail Count')}
                </td>
                <td className={cellClasses}>{stats.failCount.allTime}</td>
                <td className={cellClasses}>{stats.failCount.today}</td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.uniqueCharsCount', 'Unique Chars Count')}
                </td>
                <td className={cellClasses}>
                  {stats.uniqueCharsCount.allTime}
                </td>
                <td className={cellClasses}>{stats.uniqueCharsCount.today}</td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.sentenceLength', 'Sentence Length')}
                </td>
                <td className={cellClasses}>
                  {(stats.sentenceLength.allTime || 0).toFixed(2)}
                </td>
                <td className={cellClasses}>
                  {(stats.sentenceLength.today || 0).toFixed(2)}
                </td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.sentenceCount', 'Sentence Count')}
                </td>
                <td className={cellClasses}>
                  {stats.sentencesCompleted.allTime}
                </td>
                <td className={cellClasses}>
                  {stats.sentencesCompleted.today}
                </td>
              </tr>
              <tr className={rowClasses}>
                <td className={cellClasses}>
                  {t('stats.sentencePerc', 'Sentence Percentage')}
                </td>
                <td className={cellClasses}>
                  {displayPerc(stats.sentencePercentage.allTime)}
                </td>
                <td className={cellClasses}>
                  {displayPerc(stats.sentencePercentage.today)}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <Button
              onClick={() => {
                setIsShowingChars(!isShowingChars)
              }}
            >
              {t('stats.showChars', 'Show unique chars today')}
            </Button>
          </div>
          {isShowingChars && (
            <div className="border-[1px] border-[#ccc] p-[8px] text-[25px]">
              {stats.charsToday}
            </div>
          )}
          <div>
            <Button
              onClick={() => {
                setIsDeleting(true)
                setDeleteConfirmation('')
              }}
            >
              {t('panel.deleteStats')}
            </Button>
            {isDeleting && (
              <div>
                <div>
                  {t(
                    'panel.deleteStatsConfirmation',
                    'Input "confirm" and click the button',
                  )}
                </div>
                <div className="my-[16px] flex flex-row flex-wrap gap-[16px]">
                  <input
                    autoFocus
                    className="rounded-[8px] border-[1px] border-[#fff] p-[4px]"
                    onChange={e => setDeleteConfirmation(e.target.value)}
                    type="text"
                    value={deleteConfirmation}
                  />
                  <Button
                    disabled={deleteConfirmation !== 'confirm'}
                    onClick={() => {
                      if (deleteConfirmation === 'confirm') {
                        deleteDatabase().then(() => {
                          setStats(null)
                          setIsDeleting(false)
                        })
                      }
                    }}
                  >
                    {t('panel.confirm', 'Confirm')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}