const 成功收集字符 = 'successChars'
const 資料庫名稱 = 'WritingTrainer'

enum 字元類型 {
  失敗 = 'fail',
  成功 = 'success',
}

const 取得資料庫 = () => {
  return new Promise<IDBDatabase>((解決, 拒絕) => {
    const 開放請求 = window.indexedDB.open(資料庫名稱, 2)

    開放請求.onerror = 事件 => {
      console.log('開放請求錯誤:', 事件)
      拒絕(事件)
    }

    開放請求.onupgradeneeded = 事件 => {
      const 資料庫 = (事件.target as unknown as { result: IDBDatabase }).result

      const 物件儲存 = 資料庫.createObjectStore(成功收集字符, {
        autoIncrement: false,
      })

      物件儲存.createIndex('name', 'name', { unique: false })
      物件儲存.createIndex('type', 'type', { unique: false })
      物件儲存.createIndex('count', 'count', { unique: false })
      物件儲存.createIndex('nametype', ['name', 'type'], { unique: false })
    }

    開放請求.onsuccess = 事件 => {
      const 資料庫 = (事件.target as unknown as { result: IDBDatabase }).result

      資料庫.onerror = 資料庫事件 => {
        console.error(`資料庫錯誤:`, 資料庫事件)
      }

      解決(資料庫)
    }
  })
}

type DBRecord = {
  count: number
  name: string
  type: 字元類型
}

const 儲存字元 = async (char: string, charType: 字元類型) => {
  const 資料庫 = await 取得資料庫()

  const transaction = 資料庫.transaction([成功收集字符], 'readwrite')

  transaction.onerror = 事件 => {
    console.error(`Transaction error`, 事件)
  }

  const objectStore = transaction.objectStore(成功收集字符)
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

      updateRequest.onerror = 事件 => {
        console.error('Update error', 事件)
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

      addRequest.onerror = 事件 => {
        console.error('Add error', 事件)
      }
    }
  }
}

export const 儲存成功字元 = async (字元: string) =>
  儲存字元(字元, 字元類型.成功)

export const 儲存失敗字元 = async (字元: string) =>
  儲存字元(字元, 字元類型.失敗)

export const 取得字元數 = async () => {
  const getCount = async (charType: 字元類型): Promise<number | undefined> => {
    const 資料庫 = await 取得資料庫()

    const transaction = 資料庫.transaction([成功收集字符], 'readonly')
    const objectStore = transaction.objectStore(成功收集字符)

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

  const [successCount, failCount] = await Promise.all([
    getCount(字元類型.成功),
    getCount(字元類型.失敗),
  ])

  return {
    failCount,
    successCount,
  }
}

export const 刪除資料庫 = async (): Promise<void> => {
  await (async () => {
    const 資料庫 = await 取得資料庫()

    資料庫.close()
  })()

  return new Promise(resolve => {
    const deleteRequest = window.indexedDB.deleteDatabase(資料庫名稱)

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
