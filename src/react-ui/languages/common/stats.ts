import { StatsSaveResultDataGql } from '#/react-ui/graphql/graphql';
import { backendClient } from '#/react-ui/lib/backendClient';
import {
  CharsStats,
  CharType,
  get_db_name,
  SentencesCorrectStats,
  SentencesLengthStats,
  TableNames,
} from 'writing-trainer-wasm/writing_trainer_wasm';

type StatsLocation = 'local' | 'remote';

const DBNAME = get_db_name();

const tableNames =
  typeof window === 'undefined' ? ({} as TableNames) : new TableNames();

const {
  chars_all_time: objStoreCharsAllTime,
  chars_today: objStoreCharsToday,
  sentence_length_all_time: objsStoreSentenceLengthAllTime,
  sentence_length_today: objsStoreSentenceLengthToday,
  sentences_all_time: objsStoreSentencesAllTime,
  sentences_today: objsStoreSentencesToday,
} = tableNames;

const objStoresChars = [objStoreCharsAllTime, objStoreCharsToday];

const objStoresSentencesSuccess = [
  objsStoreSentencesAllTime,
  objsStoreSentencesToday,
];

const objStoresSentencesLength = [
  objsStoreSentenceLengthAllTime,
  objsStoreSentenceLengthToday,
];

const objStoreToday = [
  objStoreCharsToday,
  objsStoreSentencesToday,
  objsStoreSentenceLengthToday,
];

const objStoresAllTime = [
  objStoreCharsAllTime,
  objsStoreSentencesAllTime,
  objsStoreSentenceLengthAllTime,
];

const allObjStores = objStoreToday.concat(objStoresAllTime);

enum CharResult {
  Fail = 'fail',
  Success = 'success',
}

type StatsPair = [number, number];

const getLocalDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(DBNAME, 5);

    dbOpenRequest.onerror = (ev) => {
      console.error('開放請求錯誤:', ev);
      reject(ev);
    };

    // For now just clear the previous data, this should be removed in the
    // future
    const deleteStore = (db: IDBDatabase, storeName: string) => {
      try {
        db.deleteObjectStore(storeName);
      } catch {
        // Do nothing
      }
    };

    dbOpenRequest.onupgradeneeded = (ev) => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result;

      objStoresChars.forEach((objStoreName) => {
        deleteStore(db, objStoreName);

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: false,
        });

        dbObjStore.createIndex('lang', 'lang', { unique: false });
        dbObjStore.createIndex('name', 'name', { unique: false });
        dbObjStore.createIndex('type', 'type', { unique: false });
        dbObjStore.createIndex('count', 'count', { unique: false });

        dbObjStore.createIndex('nametype', ['lang', 'name', 'type'], {
          unique: false,
        });
      });

      objStoresSentencesSuccess.forEach((objStoreName) => {
        deleteStore(db, objStoreName);

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        });

        dbObjStore.createIndex('lang', 'lang', { unique: false });
        dbObjStore.createIndex('percentage', 'percentage', { unique: false });
      });

      objStoresSentencesLength.forEach((objStoreName) => {
        deleteStore(db, objStoreName);

        const dbObjStore = db.createObjectStore(objStoreName, {
          autoIncrement: true,
        });

        dbObjStore.createIndex('length', 'length', { unique: false });
        dbObjStore.createIndex('lang', 'lang', { unique: false });
      });
    };

    dbOpenRequest.onsuccess = (ev) => {
      const db = (ev.target as unknown as { result: IDBDatabase }).result;

      db.onerror = (dbEvent) => {
        console.error(`資料庫錯誤:`, dbEvent);
      };

      db.onclose = () => {
        // eslint-disable-next-line no-console
        console.log('資料庫關閉');
      };

      setTimeout(() => {
        db.close();
      }, 1000);

      resolve(db);
    };
  });

const getStore = async (
  objStoreName: string,
  mode: IDBTransactionMode = 'readonly',
) => {
  const db = await getLocalDB();

  const transaction = db.transaction([objStoreName], mode);

  transaction.onerror = (ev) => {
    console.error(`Transaction error for ${objStoreName}`, ev);
  };

  return transaction.objectStore(objStoreName);
};

const saveChar = (lang: string, char: string, charType: CharResult) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  void objStoresChars.reduce(async (p, objStoreName) => {
    await p;

    const objectStore = await getStore(objStoreName, 'readwrite');
    const searchIndex = objectStore.index('nametype');
    const key = [lang, char, charType];
    const query = searchIndex.get(key);

    query.onsuccess = (result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const record = (result.target as unknown as { result: any }).result;

      if (record) {
        record.count += 1;

        const updateRequest = objectStore.put(record, key);

        updateRequest.onerror = (ev) => {
          console.error('Update error', ev);
        };
      } else {
        const addRequest = objectStore.add(
          {
            count: 1,
            lang,
            name: char,
            type: charType,
          },
          key,
        );

        addRequest.onerror = (ev) => {
          console.error('Add error', ev);
        };
      }
    };
  }, Promise.resolve());
};

const saveSuccessChar = (lang: string, char: string) =>
  saveChar(lang, char, CharResult.Success);

const saveFailChar = (lang: string, char: string) =>
  saveChar(lang, char, CharResult.Fail);

const getSentenceLengthStats = async (
  objStoreName: string,
): Promise<SentencesLengthStats> => {
  const objectStore = await getStore(objStoreName);
  const request = objectStore.getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const stats = new SentencesLengthStats();

      request.result.forEach((record) => {
        stats.add_stat(record.lang, Number(record.length));
      });

      resolve(stats);
    };
  });
};

const getCharsStats = async (objStoreName: string): Promise<CharsStats> => {
  const objectStore = await getStore(objStoreName);
  const request = objectStore.getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const stats = new CharsStats();

      request.result.forEach((record) => {
        const statType =
          record.type === CharResult.Success ? CharType.Success : CharType.Fail;

        stats.add_stat(
          record.lang,
          Number(record.count),
          statType,
          record.name ?? '',
        );
      });

      resolve(stats);
    };
  });
};

const getSentencePercentages = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p;

      const objectStore = await getStore(objStoreName);
      const request = objectStore.getAll();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const stats = new SentencesCorrectStats();

          request.result.forEach((record) => {
            stats.add_stat(record.lang, Number(record.count));
          });

          resolve(
            existing.concat([stats.get_correct_percentage(lang)]) as StatsPair,
          );
        };
      });
    },
    Promise.resolve([] as unknown as StatsPair),
  );

const getSentenceCountsStats = async (
  objStoreName: string,
): Promise<SentencesCorrectStats> => {
  const objectStore = await getStore(objStoreName, 'readwrite');
  const request = objectStore.getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const stats = new SentencesCorrectStats();

      request.result.forEach((record) => {
        stats.add_stat(record.lang, Number(record.count));
      });

      resolve(stats);
    };
  });
};

const getSentenceCounts = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesSuccess.reduce(
    async (p, objStoreName) => {
      const existing = await p;
      const stats = await getSentenceCountsStats(objStoreName);

      return existing.concat([stats.get_total(lang)]) as StatsPair;
    },
    Promise.resolve([] as unknown as StatsPair),
  );

const getSentenceLength = async (lang: string): Promise<StatsPair> =>
  objStoresSentencesLength.reduce(
    async (p, objStoreName) => {
      const existing = await p;
      const stats = await getSentenceLengthStats(objStoreName);

      return existing.concat([stats.get_length_average(lang)]) as StatsPair;
    },
    Promise.resolve([] as unknown as StatsPair),
  );

const getCount = async (
  lang: string,
  charType: CharResult,
): Promise<StatsPair> =>
  objStoresChars.reduce(
    async (p, objStoreName) => {
      const existing = await p;
      const stats = await getCharsStats(objStoreName);

      stats.filter_by_type(
        charType === CharResult.Success ? CharType.Success : CharType.Fail,
      );

      return existing.concat([stats.get_total(lang)]) as StatsPair;
    },
    Promise.resolve([] as unknown as StatsPair),
  );

const getUniqueCharsCount = async (lang: string): Promise<StatsPair> =>
  objStoresChars.reduce(
    async (p, objStoreName) => {
      const existing = await p;
      const stats = await getCharsStats(objStoreName);

      stats.filter_by_type(CharType.Success);

      return existing.concat(stats.get_unique_chars(lang));
    },
    Promise.resolve([] as number[]),
  ) as Promise<StatsPair>;

const getTodayChars = async (lang: string): Promise<string> => {
  const stats = await getCharsStats(objStoreCharsToday);

  stats.filter_by_type(CharType.Success);

  return stats.get_names(lang);
};

const saveSentenceStats = async (
  lang: string,
  length: number,
  correctRatio: number,
) => {
  await objStoresSentencesSuccess.reduce(async (p, objStoreName) => {
    await p;

    const objectStore = await getStore(objStoreName, 'readwrite');

    const request = objectStore.add({
      count: correctRatio,
      lang,
    });

    request.onerror = () => {
      console.error('Error saving sentence percentage');
    };
  }, Promise.resolve());

  await objStoresSentencesLength.reduce(async (p, objStoreName) => {
    await p;

    const objectStore = await getStore(objStoreName, 'readwrite');

    const request = objectStore.add({
      lang,
      length,
    });

    request.onerror = () => {
      console.error('Error saving sentence length');
    };
  }, Promise.resolve());
};

const deleteSingleDB = async () => {
  const closeDB = async () => {
    const db = await getLocalDB();

    db.onerror = (ev) => {
      console.error('Error closing database', ev);
    };

    db.close();

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  await closeDB();

  return new Promise<void>((resolve) => {
    const deleteRequest = window.indexedDB.deleteDatabase(DBNAME);

    deleteRequest.onblocked = () => {
      window.location.reload();
    };

    deleteRequest.onerror = () => {
      console.error('Error deleting database');
    };

    deleteRequest.onsuccess = () => {
      // eslint-disable-next-line no-console
      console.log('Database deleted successfully');
      resolve();
    };
  });
};

const doStatsCheck = async () => {
  const today = new Date().toLocaleDateString();
  const lastSavedDB = localStorage.getItem('lastSavedTodayDB');

  if (lastSavedDB && lastSavedDB !== today) {
    await objStoreToday.reduce(async (acc, objStoreName) => {
      await acc;

      const objStore = await getStore(objStoreName, 'readwrite');

      objStore.clear();
    }, Promise.resolve());
  }

  localStorage.setItem('lastSavedTodayDB', today);
};

const getStatsLocal = async (lang: string): Promise<StatsSaveResultDataGql> => {
  const promises = [
    getCount(lang, CharResult.Success),
    getCount(lang, CharResult.Fail),
    getUniqueCharsCount(lang),
    getTodayChars(lang),
    getSentencePercentages(lang),
    getSentenceCounts(lang),
    getSentenceLength(lang),
  ] as const;

  type Tuple = typeof promises;

  // Needed to be able to have types and use the series approach
  type PromisesAwaited = {
    [Index in keyof Tuple]: Awaited<Tuple[Index]>;
  } & {
    length: Tuple['length'];
    push: (value: Awaited<Tuple[number]>) => void;
  };

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
      const existing = await p;

      existing.push(await operation);

      return existing;
    },
    Promise.resolve([] as unknown as PromisesAwaited),
  );

  const uniqueCharsCount = {
    allTime: uniqueCharsAlways,
    today: uniqueCharsToday,
  };

  const sentenceLength = {
    allTime: sentenceLengthAllTime,
    today: sentenceLengthToday,
  };

  const sentencesCompleted = {
    allTime: sentencesCompletedAllTime,
    today: sentencesCompletedToday,
  };

  const failCount = {
    allTime: failCountAllTime,
    today: failCountToday,
  };

  const successCount = {
    allTime: successCountAllTime,
    today: successCountToday,
  };

  const total = {
    allTime: successCount.allTime + failCount.allTime || 0,
    today: successCount.today + failCount.today || 0,
  };

  const successPerc = {
    allTime: total.allTime > 0 ? successCount.allTime / total.allTime : 0,
    today: total.today > 0 ? successCount.allTime / total.allTime : 0,
  };

  const sentencePercentage = {
    allTime: sentencePercentageAllTime,
    today: sentencePercentageToday,
  };

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
  } satisfies StatsSaveResultDataGql;
};

const deleteLocalDB = async (): Promise<void> =>
  deleteSingleDB().then(() => {});

const deleteAllStatsOfLang = async (lang: string) => {
  const db = await getLocalDB();

  for (const objStoreName of allObjStores) {
    const objectStore = db
      .transaction([objStoreName], 'readwrite')
      .objectStore(objStoreName);

    const deleteByLang = objectStore.index('lang');
    const keyRange = IDBKeyRange.only(lang);

    await (() =>
      new Promise<void>((resolve) => {
        const request = deleteByLang.openCursor(keyRange);

        request.onsuccess = (event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cursor = (event.target as any)
            .result as IDBCursorWithValue | null;

          if (cursor) {
            const key = cursor.primaryKey;

            objectStore.delete(key);

            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => {
          console.error(`Error deleting records for ${lang}`);
          resolve();
        };
      }))();
  }
};

const toIsoString = (date: Date) => {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num: number) {
      return (num < 10 ? '0' : '') + num;
    };

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}${dif}${pad(Math.floor(Math.abs(tzo) / 60))}:${pad(Math.abs(tzo) % 60)}`;
};

const getRawStats = async (lang: string) => {
  const result: Record<string, unknown> = {
    isoDate: toIsoString(new Date()),
    lang,
  };

  for (const objStoreName of objStoresSentencesSuccess) {
    const stats = await getSentenceCountsStats(objStoreName);

    result[objStoreName] = stats.encode_for_transfer(lang);
  }

  for (const objStoreName of objStoresSentencesLength) {
    const stats = await getSentenceLengthStats(objStoreName);

    result[objStoreName] = stats.encode_for_transfer(lang);
  }

  for (const objStoreName of objStoresChars) {
    const stats = await getCharsStats(objStoreName);

    result[objStoreName] = stats.encode_for_transfer(lang);
  }

  return result;
};

const getStats = async (
  isLoggedIn: boolean,
  lang: string,
): Promise<{ data: null | StatsSaveResultDataGql; type: StatsLocation }> => {
  if (isLoggedIn) {
    const rawStats = await getRawStats(lang);

    const remoteStats = await backendClient.saveStats(rawStats).catch((err) => {
      console.error('debug: stats.ts: err', err);

      return {
        data: null,
        success: false,
      };
    });

    if (remoteStats.success) {
      await deleteAllStatsOfLang(lang);

      return { data: remoteStats.data, type: 'remote' };
    }
  }

  const localStats = await getStatsLocal(lang);

  return { data: localStats, type: 'local' };
};

const deleteStats = async (): Promise<boolean> => {
  const [, result] = await Promise.all([
    deleteLocalDB(),
    backendClient.clearStats(),
  ]);

  return result.success;
};

const getMostFailures = async (
  lang: string,
  count: number,
): Promise<string> => {
  const stats = await getCharsStats(objStoreCharsAllTime);

  return stats.prepare_failure_sentence(lang, count);
};

export {
  deleteStats,
  doStatsCheck,
  getMostFailures,
  getStats,
  saveFailChar,
  saveSentenceStats,
  saveSuccessChar,
  type StatsLocation,
};
