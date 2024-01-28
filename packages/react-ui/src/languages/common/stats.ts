const SUCCESS_CHARS_COLLECTION = 'successChars'
const DB_NAME = 'WritingTrainer'

enum CharType {
  Fail = 'fail',
  Success = 'success',
}

const getDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openReq = window.indexedDB.open(DB_NAME, 1)

    openReq.onerror = event => {
      console.log('Open error: ', event)
      reject(event)
    }

    openReq.onupgradeneeded = event => {
      const db = (event.target as unknown as { result: IDBDatabase }).result

      const objectStore = db.createObjectStore(SUCCESS_CHARS_COLLECTION, {
        autoIncrement: true,
      })

      objectStore.createIndex('name', 'name', { unique: false })
      objectStore.createIndex('type', 'type', { unique: false })
      objectStore.createIndex('nametype', ['name', 'type'], { unique: false })
    }

    openReq.onsuccess = event => {
      const db = (event.target as unknown as { result: IDBDatabase }).result

      db.onerror = dbEvent => {
        console.error(`Database error:`, dbEvent)
      }

      resolve(db)
    }
  })
}

type DBRecord = {
  name: string
  type: CharType
}

export const saveCorrectChar = async (char: string) => {
  const db = await getDB()

  const transaction = db.transaction([SUCCESS_CHARS_COLLECTION], 'readwrite')

  transaction.onerror = ev => {
    console.error(`Transaction error`, ev)
  }

  const objectStore = transaction.objectStore(SUCCESS_CHARS_COLLECTION)

  const request = objectStore.add({
    name: char,
    type: CharType.Success,
  } satisfies DBRecord)

  request.onerror = event => {
    console.log('Add error', event)
  }
}

export const saveIncorrectChar = async (char: string) => {
  const db = await getDB()

  const transaction = db.transaction([SUCCESS_CHARS_COLLECTION], 'readwrite')

  transaction.onerror = ev => {
    console.error(`Transaction error`, ev)
  }

  const objectStore = transaction.objectStore(SUCCESS_CHARS_COLLECTION)

  const request = objectStore.add({
    name: char,
    type: CharType.Fail,
  } satisfies DBRecord)

  request.onerror = event => {
    console.log('Add error', event)
  }
}

export const getCharsCount = async () => {
  const getCount = async (charType: CharType): Promise<number | undefined> => {
    const db = await getDB()

    const transaction = db.transaction([SUCCESS_CHARS_COLLECTION], 'readonly')
    const objectStore = transaction.objectStore(SUCCESS_CHARS_COLLECTION)

    const index = objectStore.index('type')
    const keyRange = IDBKeyRange.only(charType)

    return new Promise(resolve => {
      const request = index.count(keyRange)

      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  const [successCount, failCount] = await Promise.all([
    getCount(CharType.Success),
    getCount(CharType.Fail),
  ])

  return {
    failCount,
    successCount,
  }
}

export const deleteDB = async (): Promise<void> => {
  await (async () => {
    const db = await getDB()

    db.close()
  })()

  return new Promise(resolve => {
    const deleteRequest = window.indexedDB.deleteDatabase(DB_NAME)

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
