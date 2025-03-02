import {
  CharType,
  CharsStats,
  SentencesCorrectStats,
  SentencesLengthStats,
  get_db_name,
} from 'writing-trainer-wasm/writing_trainer_wasm'

const DBNAME = get_db_name()

const objStoreCharsAllTime = 'charsAllTime'
const objStoreCharsToday = 'charsToday'
const objsStoreSentencesAllTime = 'sentencesAllTime'
const objsStoreSentencesToday = 'sentencesToday'
const objsStoreSentenceLengthAllTime = 'sentenceLengthAllTime'
const objsStoreSentenceLengthToday = 'sentenceLengthToday'

const objStoresChars = [objStoreCharsAllTime, objStoreCharsToday]

const objStoresSentencesSuccess = [
  objsStoreSentencesAllTime,
  objsStoreSentencesToday,
]

const objStoresSentencesLength = [
  objsStoreSentenceLengthAllTime,
  objsStoreSentenceLengthToday,
]

const objStoreToday = [
  objStoreCharsToday,
  objsStoreSentencesToday,
  objsStoreSentenceLengthToday,
]

enum CharResult {
  Fail = 'fail',
  Success = 'success',
}

type StatsPair = [number, number]

const getDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(DBNAME, 5)

    dbOpenRequest.onerror = ev => {
      console.log('開放請求錯誤:', ev)
      reject(ev)
    }

    // For now just clear the previous data, this should be removed in the
    // future
    const deleteStore = (db: IDBDatabase, storeName: string) => {
      try {
        db.deleteObjectStore(storeName)
      } catch {
        // Do nothing
      }
    }

    dbOpenRequest.onupgradeneeded = ev => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result

      objStoresChars.forEach(objStoreName => {
        deleteStore(db, objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: false,
        })

        dbObjStore.createIndex('lang', 'lang', { unique: false })
        dbObjStore.createIndex('name', 'name', { unique: false })
        dbObjStore.createIndex('type', 'type', { unique: false })
        dbObjStore.createIndex('count', 'count', { unique: false })

        dbObjStore.createIndex('nametype', ['lang', 'name', 'type'], {
          unique: false,
        })
      })

      objStoresSentencesSuccess.forEach(objStoreName => {
        deleteStore(db, objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        })

        dbObjStore.createIndex('lang', 'lang', { unique: false })
        dbObjStore.createIndex('percentage', 'percentage', { unique: false })
      })

      objStoresSentencesLength.forEach(objStoreName => {
        deleteStore(db, objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        })

        dbObjStore.createIndex('length', 'length', { unique: false })
        dbObjStore.createIndex('lang', 'lang', { unique: false })
      })
    }

    dbOpenRequest.onsuccess = ev => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result

      db.onerror = dbEvent => {
        console.error(`資料庫錯誤:`, dbEvent)
      }

      resolve(db)
    }
  })

const getStore = async (
  objStoreName: string,
  mode: IDBTransactionMode = 'readonly',
) => {
  const db = await getDB()

  const transaction = db.transaction([objStoreName], mode)

  transaction.onerror = ev => {
    console.error(`Transaction error for ${objStoreName}`, ev)
  }

  return transaction.objectStore(objStoreName)
}

const saveChar = async (lang: string, char: string, charType: CharResult) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  objStoresChars.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')
    const searchIndex = objectStore.index('nametype')
    const key = [lang, char, charType]
    const query = searchIndex.get(key)

    query.onsuccess = result => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const record = (result.target as unknown as { result: any | undefined })
        .result

      if (record) {
        record.count += 1

        const updateRequest = objectStore.put(record, key)

        updateRequest.onerror = ev => {
          console.error('Update error', ev)
        }
      } else {
        const addRequest = objectStore.add(
          {
            count: 1,
            lang,
            name: char,
            type: charType,
          },
          key,
        )

        addRequest.onerror = ev => {
          console.error('Add error', ev)
        }
      }
    }
  }, Promise.resolve())
}

export const saveSuccessChar = async (lang: string, char: string) =>
  saveChar(lang, char, CharResult.Success)

export const saveFailChar = async (lang: string, char: string) =>
  saveChar(lang, char, CharResult.Fail)

const getSentencePercentages = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          const stats = new SentencesCorrectStats()

          request.result.forEach(record => {
            stats.add_stat(record.lang, Number(record.count))
          })

          resolve(
            existing.concat([stats.get_correct_percentage(lang)]) as StatsPair,
          )
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getSentenceCounts = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName, 'readwrite')
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          const stats = new SentencesCorrectStats()

          request.result.forEach(record => {
            stats.add_stat(record.lang, Number(record.count))
          })

          resolve(existing.concat([stats.get_total(lang)]) as StatsPair)
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getSentenceLength = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesLength.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          const stats = new SentencesLengthStats()

          request.result.forEach(record => {
            stats.add_stat(record.lang, Number(record.length))
          })

          resolve(
            existing.concat([stats.get_length_average(lang)]) as StatsPair,
          )
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getCount = async (
  lang: string,
  charType: CharResult,
): Promise<StatsPair> =>
  objStoresChars.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const index = objectStore.index('type')
      const keyRange = IDBKeyRange.only(charType)

      return new Promise(resolve => {
        const request = index.getAll(keyRange)

        request.onsuccess = () => {
          const stats = new CharsStats()

          request.result.forEach(record => {
            const statType =
              record.type === CharResult.Success
                ? CharType.Success
                : CharType.Fail

            stats.add_stat(
              record.lang,
              Number(record.count),
              statType,
              record.name || '',
            )
          })

          resolve(existing.concat([stats.get_total(lang)]) as StatsPair)
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getUniqueCharsCount = async (lang: string): Promise<StatsPair> =>
  objStoresChars.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const index = objectStore.index('type')
      const keyRange = IDBKeyRange.only(CharResult.Success)

      return new Promise<number[]>(resolve => {
        const request = index.getAll(keyRange)

        request.onsuccess = () => {
          const stats = new CharsStats()

          request.result.forEach(record => {
            const statType =
              record.type === CharResult.Success
                ? CharType.Success
                : CharType.Fail

            stats.add_stat(
              record.lang,
              Number(record.count),
              statType,
              record.name || '',
            )
          })

          resolve(existing.concat(stats.get_unique_chars(lang)))
        }
      })
    },
    Promise.resolve([] as number[]),
  ) as Promise<StatsPair>

const getTodayChars = async (lang: string): Promise<string> => {
  const objectStore = await getStore(objStoreCharsToday)

  const index = objectStore.index('type')
  const keyRange = IDBKeyRange.only(CharResult.Success)

  return new Promise<string>(resolve => {
    const request = index.getAll(keyRange)

    request.onsuccess = () => {
      const stats = new CharsStats()

      request.result.forEach(record => {
        const statType =
          record.type === CharResult.Success ? CharType.Success : CharType.Fail

        stats.add_stat(
          record.lang,
          Number(record.count),
          statType,
          record.name || '',
        )
      })

      resolve(stats.get_names(lang))
    }
  })
}

export const saveSentenceStats = async (
  lang: string,
  length: number,
  correctRatio: number,
) => {
  await objStoresSentencesSuccess.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')

    const request = objectStore.add({
      count: correctRatio,
      lang,
    })

    request.onerror = () => {
      console.error('Error saving sentence percentage')
    }
  }, Promise.resolve())

  await objStoresSentencesLength.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')

    const request = objectStore.add({
      lang,
      length,
    })

    request.onerror = () => {
      console.error('Error saving sentence length')
    }
  }, Promise.resolve())
}

const deleteSingleDB = async () => {
  await (async () => {
    console.log('Closing database')

    const db = await getDB()

    db.close()
  })()

  return new Promise<void>(resolve => {
    console.log('Deleting database')

    const deleteRequest = window.indexedDB.deleteDatabase(DBNAME)

    deleteRequest.onblocked = () => {
      window.location.reload()
    }

    deleteRequest.onerror = () => {
      console.error('Error deleting database')
    }

    deleteRequest.onsuccess = () => {
      console.log('Database deleted successfully')
      resolve()
    }
  })
}

type HistoricStat = {
  allTime: number
  today: number
}

export type StatsResult = {
  charsToday: string
  failCount: HistoricStat
  lang: string
  sentenceLength: HistoricStat
  sentencePercentage: HistoricStat
  sentencesCompleted: HistoricStat
  successCount: HistoricStat
  successPerc: HistoricStat
  uniqueCharsCount: HistoricStat
}

export const doStatsCheck = async () => {
  const today = new Date().toLocaleDateString()
  const lastSavedDB = localStorage.getItem('lastSavedTodayDB')

  if (lastSavedDB && lastSavedDB !== today) {
    await objStoreToday.reduce(async (acc, objStoreName) => {
      await acc

      const objStore = await getStore(objStoreName, 'readwrite')

      objStore.clear()
    }, Promise.resolve())
  }

  localStorage.setItem('lastSavedTodayDB', today)
}

export const getStats = async (lang: string): Promise<StatsResult> => {
  const promises = [
    getCount(lang, CharResult.Success),
    getCount(lang, CharResult.Fail),
    getUniqueCharsCount(lang),
    getTodayChars(lang),
    getSentencePercentages(lang),
    getSentenceCounts(lang),
    getSentenceLength(lang),
  ] as const

  type Tuple = typeof promises

  // Needed to be able to have types and use the series approach
  type PromisesAwaited = {
    [Index in keyof Tuple]: Awaited<Tuple[Index]>
  } & { length: Tuple['length']; push: (value: Awaited<Tuple[number]>) => void }

  const [
    [successCountAllTime, successCountToday],
    [failCountAllTime, failCountToday],
    [uniqueCharsAlways, uniqueCharsToday],
    charsToday,
    [sentencePercentageAllTime, sentencePercentageToday],
    [sentencesCompletedAllTime, sentencesCompletedToday],
    [sentenceLengthAllTime, sentenceLengthToday],
  ] = await promises.reduce(
    async (p, operation) => {
      const existing = await p

      existing.push(await operation)

      return existing
    },
    Promise.resolve([] as unknown as PromisesAwaited),
  )

  const uniqueCharsCount = {
    allTime: uniqueCharsAlways,
    today: uniqueCharsToday,
  }

  const sentenceLength = {
    allTime: sentenceLengthAllTime,
    today: sentenceLengthToday,
  }

  const sentencesCompleted = {
    allTime: sentencesCompletedAllTime,
    today: sentencesCompletedToday,
  }

  const failCount = {
    allTime: failCountAllTime,
    today: failCountToday,
  }

  const successCount = {
    allTime: successCountAllTime,
    today: successCountToday,
  }

  const total = {
    allTime: successCount.allTime + failCount.allTime || 0,
    today: successCount.today + failCount.today || 0,
  }

  const successPerc = {
    allTime: total.allTime > 0 ? successCount.allTime / total.allTime : 0,
    today: total.today > 0 ? successCount.allTime / total.allTime : 0,
  }

  const sentencePercentage = {
    allTime: sentencePercentageAllTime,
    today: sentencePercentageToday,
  }

  return {
    charsToday,
    failCount,
    lang,
    sentenceLength,
    sentencePercentage,
    sentencesCompleted,
    successCount,
    successPerc,
    uniqueCharsCount,
  } satisfies StatsResult
}

export const deleteDatabase = async (): Promise<void> =>
  deleteSingleDB().then(() => {})

export const getMostFailures = async (
  lang: string,
  count: number,
): Promise<string> => {
  const objectStore = await getStore(objStoreCharsAllTime)

  return new Promise<string>(resolve => {
    const request = objectStore.getAll()

    request.onsuccess = () => {
      const stats = new CharsStats()

      request.result.forEach(record => {
        const statType =
          record.type === CharResult.Success ? CharType.Success : CharType.Fail

        stats.add_stat(
          record.lang,
          Number(record.count),
          statType,
          record.name || '',
        )
      })

      resolve(stats.prepare_failure_sentence(lang, count))
    }
  })
}
