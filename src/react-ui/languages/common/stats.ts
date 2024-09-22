const dbName = 'WritingTrainerDB'

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
    const dbOpenRequest = window.indexedDB.open(dbName, 4)

    dbOpenRequest.onerror = ev => {
      console.log('開放請求錯誤:', ev)
      reject(ev)
    }

    // For now just clear the previous data, this should be removed in the
    // future
    const deleteStore = (storeName: string) => {
      try {
        dbOpenRequest.result.deleteObjectStore(storeName)
      } catch {
        // Do nothing
      }
    }

    dbOpenRequest.onupgradeneeded = ev => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result

      objStoresChars.forEach(objStoreName => {
        deleteStore(objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: false,
        })

        dbObjStore.createIndex('name', 'name', { unique: false })
        dbObjStore.createIndex('type', 'type', { unique: false })
        dbObjStore.createIndex('count', 'count', { unique: false })
        dbObjStore.createIndex('nametype', ['name', 'type'], { unique: false })
      })

      objStoresSentencesSuccess.forEach(objStoreName => {
        deleteStore(objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        })

        dbObjStore.createIndex('percentage', 'percentage', { unique: false })
      })

      objStoresSentencesLength.forEach(objStoreName => {
        deleteStore(objStoreName)

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        })

        dbObjStore.createIndex('length', 'length', { unique: false })
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

type DBRecord = {
  count: number
  name: string
  type: CharResult
}

const saveChar = async (char: string, charType: CharResult) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  objStoresChars.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')
    const searchIndex = objectStore.index('nametype')
    const key = [char, charType]
    const query = searchIndex.get(key)

    query.onsuccess = result => {
      const record = (
        result.target as unknown as { result: DBRecord | undefined }
      ).result

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

export const saveSuccessChar = async (char: string) =>
  saveChar(char, CharResult.Success)

export const saveFailChar = async (char: string) =>
  saveChar(char, CharResult.Fail)

const getSentencePercentages = async (): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          const results =
            request.result
              .map((record: { count: number }) => record.count)
              .reduce((acc: number, count: number) => acc + count, 0) /
            (request.result.length || 1)

          resolve(existing.concat([results]) as StatsPair)
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getSentenceCounts = async (): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName, 'readwrite')
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          resolve(existing.concat([request.result.length]) as StatsPair)
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

const getSentenceLength = async (): Promise<StatsPair> =>
  objStoresSentencesLength.reduce(
    async (p, objStoreName) => {
      const existing = await p

      const objectStore = await getStore(objStoreName)
      const request = objectStore.getAll()

      return new Promise(resolve => {
        request.onsuccess = () => {
          const results =
            request.result
              .map((record: { length: number }) => record.length)
              .reduce((acc: number, count: number) => acc + count, 0) /
            (request.result.length || 1)

          resolve(existing.concat([results]) as StatsPair)
        }
      })
    },
    Promise.resolve([] as unknown as StatsPair),
  )

export const saveSentenceStats = async (
  length: number,
  correctRatio: number,
) => {
  await objStoresSentencesSuccess.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')

    const request = objectStore.add({
      count: correctRatio,
    })

    request.onerror = () => {
      console.error('Error saving sentence percentage')
    }
  }, Promise.resolve())

  await objStoresSentencesLength.reduce(async (p, objStoreName) => {
    await p

    const objectStore = await getStore(objStoreName, 'readwrite')

    const request = objectStore.add({
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

    const deleteRequest = window.indexedDB.deleteDatabase(dbName)

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
  sentenceLength: HistoricStat
  sentencePercentage: HistoricStat
  sentencesCompleted: HistoricStat
  successCount: HistoricStat
  successPerc: HistoricStat
  uniqueCharsCount: HistoricStat
}

export const getStats = async (): Promise<StatsResult> => {
  const today = new Date().toLocaleDateString()
  const lastSavedDB = localStorage.getItem('lastSavedTodayDB')

  if (lastSavedDB && lastSavedDB !== today) {
    const db = await getDB()

    objStoreToday.forEach(objStoreName => {
      db.deleteObjectStore(objStoreName)
    })
  }

  localStorage.setItem('lastSavedTodayDB', today)

  const getCount = async (charType: CharResult): Promise<StatsPair> =>
    objStoresChars.reduce(
      async (p, objStoreName) => {
        const existing = await p

        const objectStore = await getStore(objStoreName)
        const index = objectStore.index('type')
        const keyRange = IDBKeyRange.only(charType)

        return new Promise(resolve => {
          const request = index.getAll(keyRange)

          request.onsuccess = () => {
            const total = request.result.reduce(
              (acc: number, record: DBRecord) => acc + record.count,
              0,
            )

            resolve(existing.concat([total]) as StatsPair)
          }
        })
      },
      Promise.resolve([] as unknown as StatsPair),
    )

  const getUniqueCharsCount = async (): Promise<StatsPair> =>
    objStoresChars.reduce(
      async (p, objStoreName) => {
        const existing = await p

        const objectStore = await getStore(objStoreName)
        const index = objectStore.index('type')
        const keyRange = IDBKeyRange.only(CharResult.Success)

        return new Promise<number[]>(resolve => {
          const request = index.getAll(keyRange)

          request.onsuccess = () => {
            const total = request.result.length

            resolve(existing.concat(total))
          }
        })
      },
      Promise.resolve([] as number[]),
    ) as Promise<StatsPair>

  const getTodayChars = async (): Promise<string> => {
    const objectStore = await getStore(objStoreCharsToday)

    const index = objectStore.index('type')
    const keyRange = IDBKeyRange.only(CharResult.Success)

    return new Promise<string>(resolve => {
      const request = index.getAll(keyRange)

      request.onsuccess = () => {
        const chars = request.result
          .map((record: DBRecord) => record.name)
          .sort()

        resolve(chars.join(' '))
      }
    })
  }

  const promises = [
    getCount(CharResult.Success),
    getCount(CharResult.Fail),
    getUniqueCharsCount(),
    getTodayChars(),
    getSentencePercentages(),
    getSentenceCounts(),
    getSentenceLength(),
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
