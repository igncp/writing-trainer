import CharactersDisplay from '#/react-ui/components/CharactersDisplay/CharactersDisplay';
import { AnkiGql } from '#/react-ui/graphql/graphql';
import {
  changeToSimplified,
  changeToTraditional,
} from '#/react-ui/languages/common/conversion';
import { backendClient } from '#/react-ui/lib/backendClient';
import { Paths } from '#/react-ui/lib/paths';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CharObjUI } from 'writing-trainer-wasm/writing_trainer_wasm';

import Button from '../../components/button/button';
import TextArea from '../../components/TextArea/TextArea';

export enum AnkisMode {
  Add = 'add',
  Main = 'main',
}

export const ankiModeToPath: Record<AnkisMode, string> = {
  [AnkisMode.Add]: Paths.ankis.add,
  [AnkisMode.Main]: Paths.ankis.main,
};

type AnkiRoundItem = Pick<AnkiGql, 'back' | 'front' | 'id'>;

/* eslint-disable react/no-unused-prop-types */
type Props = {
  charsObjsList: CharObjUI[];
  language: string;
  mode: AnkisMode;
  setMode: (mode: AnkisMode | null) => void;
};
/* eslint-enable react/no-unused-prop-types */

type AnkisRoundProps = {
  ankisRound: AnkiRoundItem[] | null;
  setAnkisRound: (ankisRound: AnkiRoundItem[] | null) => void;
};

const AnkiRound = ({ ankisRound, setAnkisRound }: AnkisRoundProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShowingBack, setIsShowingBack] = useState(false);
  const [showBothCharsTypes, setShowBothCharsTypes] = useState(true);
  const currentAnki = ankisRound?.[currentIndex];

  return (
    <div className="flex flex-col gap-[16px]">
      <div>{t('anki.round')}</div>
      <div className="flex flex-row gap-[16px]">
        <Button
          onClick={() => {
            setAnkisRound(null);
          }}
        >
          {t('anki.end')}
        </Button>
        <Button
          onClick={() => {
            setShowBothCharsTypes(!showBothCharsTypes);
          }}
        >
          {t('anki.toggleTypes')}
        </Button>
      </div>
      <div>
        {currentAnki ? (
          (() => {
            const onNext = (guessed: boolean) => {
              backendClient
                .saveReviewedAnki({
                  guessed,
                  id: currentAnki.id,
                })
                .then(() => {
                  setIsShowingBack(false);

                  if (currentIndex + 1 < ankisRound.length) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    setAnkisRound(null);
                  }
                })
                .catch(() => {
                  toast.error(t('anki.saveFailed'));
                });
            };

            const front = (() => {
              if (!showBothCharsTypes) return currentAnki.front;

              const simplified = changeToSimplified(currentAnki.front);
              const traditional = changeToTraditional(currentAnki.front);

              return simplified === traditional
                ? simplified
                : `${traditional} / ${simplified}`;
            })();

            return (
              <div className="flex flex-col gap-[24px]">
                <div>
                  {t('anki.num')} {currentIndex + 1} / {ankisRound.length}
                </div>
                <div className="whitespace-pre rounded-[4px] border-[1px] border-[#777] p-[8px] text-[60px]">
                  {front}
                </div>
                {isShowingBack ? (
                  <>
                    <div className="overflow-auto whitespace-pre rounded-[4px] border-[1px] border-[#777] p-[8px] text-[30px]">
                      {currentAnki.back}
                    </div>
                    <div className="flex flex-row justify-start gap-[24px]">
                      <Button onClick={() => onNext(true)}>
                        {t('anki.correct')}
                      </Button>
                      <Button onClick={() => onNext(false)}>
                        {t('anki.wrong')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <Button onClick={() => setIsShowingBack(true)}>
                      {t('anki.displayBack')}
                    </Button>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div>{t('anki.noMore')}</div>
        )}
      </div>
    </div>
  );
};

const AnkisMain = ({ setMode }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const [ankis, setAnkis] = useState<Awaited<
    ReturnType<typeof backendClient.getUserAnkis>
  > | null>(null);

  const timeoutRef = useRef<null | number>(null);
  const [filter, setFilter] = useState('');
  const [ankiDetail, setAnkiDetail] = useState<AnkiGql | null>(null);
  const [ankisRound, setAnkisRound] = useState<AnkiRoundItem[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPage, setLoadedPage] = useState(0);
  const pageItems = 10;

  const getAnkis = useCallback(
    (pageNum: number, query: string, debounce: boolean) => {
      if (ankisRound) return;

      const fn = () => {
        const loadingTimeout = setTimeout(() => {
          setIsLoading(true);
        }, 1000);

        backendClient
          .getUserAnkis(pageItems, pageNum * pageItems, query)
          .then((_ankis) => {
            setAnkis(_ankis);
            setLoadedPage(pageNum);
          })
          .catch(() => {
            toast.error(t('anki.loadFailed'));
          })
          .finally(() => {
            clearTimeout(loadingTimeout);
            setIsLoading(false);
          });
      };

      if (debounce) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(fn, 500);
      } else {
        fn();
      }
    },
    [ankisRound, t],
  );

  useEffect(() => {
    setCurrentPage(0);
    setLoadedPage(0);
  }, [filter]);

  useEffect(() => {
    getAnkis(currentPage, filter, true);
  }, [getAnkis, currentPage, filter]);

  if (ankisRound) {
    return <AnkiRound ankisRound={ankisRound} setAnkisRound={setAnkisRound} />;
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        {t('anki.list')}
        {!!ankis?.total && ` (${ankis.total})`}
      </div>
      <div className="flex flex-row items-center justify-start gap-[8px]">
        <input
          className="h-[24px w-[200px] rounded-[4px] border-[1px] border-[#777] p-[4px]"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
        {filter && (
          <button
            onClick={() => {
              setFilter('');
            }}
          >
            X
          </button>
        )}
      </div>
      <div className="flex flex-row gap-[12px]">
        <Button
          onClick={() => {
            setIsLoading(true);

            backendClient
              .getAnkisRound(filter)
              .then((_ankisRound) => {
                setAnkisRound(_ankisRound);
              })
              .catch(() => {
                toast.error('Failed to load ankis round');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          {t('anki.startRound')}
        </Button>
        <Button onClick={() => setMode(AnkisMode.Add)}>
          {t('anki.addNew')}
        </Button>
      </div>
      {isLoading ? (
        <div>
          <span className="animate-spin">
            <FaSpinner color="#00f" />
          </span>
        </div>
      ) : (
        <ul className="width-max flex flex-col">
          {ankis?.list.map((anki, ankiItemIdx) => (
            <li
              className="flex flex-1 flex-row py-[3px] even:bg-[#333]"
              key={anki.id}
            >
              ({ankis.total - (loadedPage * pageItems + ankiItemIdx)}):{' '}
              <span className="ml-[4px] flex-1">{anki.front}</span>{' '}
              {ankiDetail?.id === anki.id && (
                <div className="flex-[10]">
                  <br />
                  <div className="flex flex-col gap-[8px] whitespace-pre-line">
                    <div>{ankiDetail.back}</div>
                  </div>
                </div>
              )}
              <span className="mx-[12px]">{anki.language}</span>{' '}
              <span className="mx-[12px]">
                ({anki.correct}/{anki.correct + anki.incorrect})
              </span>{' '}
              <button
                className="mr-[8px]"
                disabled={isLoading}
                onClick={() => {
                  if (ankiDetail?.id === anki.id) {
                    setAnkiDetail(null);

                    return;
                  }

                  const timeout = setTimeout(() => {
                    setIsLoading(true);
                  }, 1000);

                  backendClient
                    .getUserAnki(anki.id)
                    .then((_ankiDetail) => setAnkiDetail(_ankiDetail))
                    .catch(() => {
                      toast.error(t('anki.loadFailed'));
                    })
                    .finally(() => {
                      clearTimeout(timeout);
                      setIsLoading(false);
                    });
                }}
              >
                <FaEye />
              </button>
              <button
                className="mr-[8px]"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);

                  backendClient
                    .saveAnki({
                      back: '',
                      front: '',
                      id: anki.id,
                      language: '',
                    })
                    .then(() => getAnkis(currentPage, filter, false))
                    .catch(() => {
                      toast.error(t('anki.deleteFailed'));
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      )}
      {!!ankis &&
        (() => {
          const lastPage = Math.ceil(ankis.total / pageItems);

          return (
            <div className="flex flex-row gap-[24px]">
              <Button
                disabled={isLoading || currentPage === 0}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                {t('anki.previousPage')}
              </Button>
              <Button
                disabled={isLoading || currentPage === 0}
                onClick={() => {
                  setCurrentPage(0);
                }}
              >
                1
              </Button>
              {lastPage > 1 && (
                <>
                  {currentPage > 0 && currentPage < lastPage - 1 && (
                    <Button>{currentPage + 1}</Button>
                  )}
                  <Button
                    disabled={isLoading || currentPage === lastPage - 1}
                    onClick={() => {
                      setCurrentPage(lastPage - 1);
                    }}
                  >
                    {lastPage}
                  </Button>
                </>
              )}
              <Button
                disabled={isLoading || currentPage === lastPage - 1}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                {t('anki.nextPage')}
              </Button>
            </div>
          );
        })()}
    </div>
  );
};

const AnkisAdd = ({ charsObjsList, language, setMode }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [frontVal, setFrontVal] = useState('');
  const [backVal, setBackVal] = useState('');
  const [showPronunciation, setShowPronunciation] = useState(true);
  const [frontRef, setFrontRef] = useState<HTMLTextAreaElement | null>(null);
  const [backRef, setBackRef] = useState<HTMLTextAreaElement | null>(null);

  const clear = () => {
    setFrontVal('');
    setBackVal('');
  };

  return (
    <div>
      <div className="flex flex-row gap-[16px]">
        <Button onClick={() => setMode(AnkisMode.Main)}>
          {t('anki.displayList')}
        </Button>
        <Button
          onClick={() => {
            void navigator.clipboard.writeText(
              charsObjsList.map((charObj) => charObj.word).join(''),
            );
          }}
        >
          {t('anki.copyChars')}
        </Button>
        <Button
          onClick={() => {
            void navigator.clipboard.writeText(
              charsObjsList.map((charObj) => charObj.pronunciation).join(' '),
            );
          }}
        >
          {t('anki.copyPronunciations')}
        </Button>
      </div>
      <div className="my-[8px]">
        <CharactersDisplay
          charsObjsList={charsObjsList}
          onSymbolClick={({ charObj }) => {
            setFrontVal(frontVal + charObj.word);

            setBackVal(
              `${backVal
                .split('\n')
                .map((line, idx) => {
                  if (idx === 0)
                    return [line, charObj.pronunciation]
                      .filter(Boolean)
                      .join(' ');

                  return line;
                })
                .join('\n')
                .trim()}${backVal.split('\n').filter(Boolean).length === 1 ? '\n' : ''}`,
            );

            backRef?.focus();
          }}
          shouldHidePronunciation={!showPronunciation}
        />
      </div>
      <div className="flex flex-row gap-[16px]">
        <Button
          onClick={() => {
            setFrontVal('');
            setBackVal('');
            frontRef?.focus();
          }}
        >
          {t('anki.clear')}
        </Button>
        <Button
          onClick={() => {
            setShowPronunciation(!showPronunciation);
          }}
        >
          {t('anki.togglePronunciation')}
        </Button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsLoading(true);

          backendClient
            .saveAnki({
              back: backVal,
              front: frontVal,
              id: '',
              language,
            })
            .then(() => {
              clear();
              frontRef?.focus();
            })
            .catch(() => {
              toast.error(t('anki.saveCardFailed'));
            })
            .finally(() => {
              setIsLoading(false);
            });
        }}
      >
        <TextArea
          autoFocus
          className="border-[#777]"
          onChange={(e) => setFrontVal(e.target.value)}
          placeholder={t('anki.frontSide')}
          setRef={setFrontRef}
          tabIndex={1}
          value={frontVal}
        />
        <TextArea
          className="border-[#777]"
          onChange={(e) => setBackVal(e.target.value)}
          placeholder={t('anki.backSide')}
          setRef={setBackRef}
          tabIndex={2}
          value={backVal}
        />
        <Button disabled={isLoading || !frontVal || !backVal} tabIndex={3}>
          {t('anki.save')}
        </Button>
      </form>
    </div>
  );
};

export const AnkisSection = (props: Props) => {
  const { t } = useTranslation();
  const { mode, setMode } = props;

  return (
    <div className="flex flex-col gap-[16px]">
      <h1>Ankis</h1>
      <span>
        <Button onClick={() => setMode(null)}>{t('anki.close')}</Button>
      </span>
      {mode === AnkisMode.Main && <AnkisMain {...props} />}
      {mode === AnkisMode.Add && <AnkisAdd {...props} />}
    </div>
  );
};
