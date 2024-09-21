const successCharsKey = 'successChars'

const dbNameAllTime = 'WritingTrainerAllTime'
const dbNameToday = 'WritingTrainerToday'

enum CharResult {
  Fail = 'fail',
  Success = 'success',
}

const getDB = (dbName: string) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(dbName, 2)

    dbOpenRequest.onerror = ev => {
      console.log('開放請求錯誤:', ev)
      reject(ev)
    }

    dbOpenRequest.onupgradeneeded = ev => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result

      const dbObjStore = db.createObjectStore(successCharsKey, {
        autoIncrement: false,
      })

      dbObjStore.createIndex('name', 'name', { unique: false })
      dbObjStore.createIndex('type', 'type', { unique: false })
      dbObjStore.createIndex('count', 'count', { unique: false })
      dbObjStore.createIndex('nametype', ['name', 'type'], { unique: false })
    }

    dbOpenRequest.onsuccess = ev => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result

      db.onerror = dbEvent => {
        console.error(`資料庫錯誤:`, dbEvent)
      }

      resolve(db)
    }
  })
}

type DBRecord = {
  count: number
  name: string
  type: CharResult
}

const allDBs = [dbNameAllTime, dbNameToday]

const saveChar = async (char: string, charType: CharResult) => {
  allDBs.forEach(async dbName => {
    const db = await getDB(dbName)

    const transaction = db.transaction([successCharsKey], 'readwrite')

    transaction.onerror = ev => {
      console.error(`Transaction error`, ev)
    }

    const objectStore = transaction.objectStore(successCharsKey)
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
  })
}

export const saveSuccessChar = async (char: string) =>
  saveChar(char, CharResult.Success)

export const saveFailChar = async (char: string) =>
  saveChar(char, CharResult.Fail)

const deleteSingleDB = async (dbName: string) => {
  await (async () => {
    const db = await getDB(dbName)

    db.close()
  })()

  return new Promise<void>(resolve => {
    const deleteRequest = window.indexedDB.deleteDatabase(dbName)

    deleteRequest.onblocked = () => {
      window.location.reload()
    }

    deleteRequest.onerror = () => {
      console.error('Error deleting database')
    }

    deleteRequest.onsuccess = () => {
      resolve()
    }
  })
}

export const getStats = async () => {
  const today = new Date().toLocaleDateString()
  const lastSavedDB = localStorage.getItem('lastSavedTodayDB')

  if (lastSavedDB && lastSavedDB !== today) {
    await deleteSingleDB(dbNameToday)
  }

  localStorage.setItem('lastSavedTodayDB', today)

  const getCount = async (
    charType: CharResult,
  ): Promise<number | undefined> => {
    const db = await getDB(dbNameAllTime)

    const transaction = db.transaction([successCharsKey], 'readonly')
    const objectStore = transaction.objectStore(successCharsKey)

    const index = objectStore.index('type')
    const keyRange = IDBKeyRange.only(charType)

    return new Promise(resolve => {
      const request = index.getAll(keyRange)

      request.onsuccess = () => {
        const total = request.result.reduce(
          (acc: number, record: DBRecord) => acc + record.count,
          0,
        )

        resolve(total)
      }
    })
  }

  const getAllCharsCount = async (): Promise<[number, number]> =>
    allDBs.reduce(
      async (p, dbName) => {
        const existing = await p

        const db = await getDB(dbName)

        const transaction = db.transaction([successCharsKey], 'readonly')
        const objectStore = transaction.objectStore(successCharsKey)

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
    ) as Promise<[number, number]>

  const getTodayChars = async (): Promise<string> => {
    const db = await getDB(dbNameToday)

    const transaction = db.transaction([successCharsKey], 'readonly')
    const objectStore = transaction.objectStore(successCharsKey)

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

  const [
    successCount,
    failCount,
    [allCharsCount, allCharsCountToday],
    charsToday,
  ] = (await [
    getCount(CharResult.Success),
    getCount(CharResult.Fail),
    getAllCharsCount(),
    getTodayChars(),
  ].reduce(
    async (p, operation) => {
      const existing = await p

      existing.push(await operation)

      return existing
    },
    Promise.resolve([] as unknown[]),
  )) as [number, number, [number, number], string]

  return {
    allCharsCount,
    allCharsCountToday,
    charsToday,
    failCount,
    successCount,
  }
}

export const deleteDatabase = async (): Promise<void> =>
  Promise.all(allDBs.map(deleteSingleDB)).then(() => {})
