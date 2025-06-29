import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { T_CharObj } from '#/core';
import CantoDictButton from '#/react-ui/languages/common/Links/CantoDictButton';
import GoogleTranslateButton from '#/react-ui/languages/common/Links/GoogleTranslateButton';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CHAR_WIDTH = 25;
const MAX_HEIGHT = 160;

type Props = {
  重點字元索引?: number;
  應該有不同的寬度?: boolean;
  顯示目前字元的發音?: boolean;
  charsObjsList: T_CharObj[];
  colorOfChar?: (isCurrentChar: boolean, c: T_CharObj) => string | undefined;
  fontSize?: number;
  hasCantodict?: boolean;
  onSymbolClick?: (o: {
    charObj: T_CharObj;
    charsObjsList: T_CharObj[];
    index: number;
  }) => void;
  shouldHidePronunciation: boolean;
};

const CharactersDisplay = ({
  重點字元索引,
  應該有不同的寬度,
  顯示目前字元的發音,
  charsObjsList,
  colorOfChar,
  fontSize,
  hasCantodict,
  onSymbolClick,
  shouldHidePronunciation: shouldHidePronunciationDefault,
}: Props) => {
  const { i18n } = useTranslation();
  const usedFontSize = fontSize ?? 30;
  const wrapperRef = useRef<HTMLDivElement | undefined>();
  const charWidth = CHAR_WIDTH + usedFontSize;

  const [multichar, setMultichar] = useState<
    [number, null] | [number, number] | null
  >(null);

  const [showMultichar, setShowMultichar] = useState<
    [number, 'left' | 'right'] | null
  >(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {}, [multichar]);

  useEffect(() => {
    if (!wrapperRef.current || (!wrapperRef.current.childNodes as unknown)) {
      return () => {};
    }

    const charEl = wrapperRef.current.childNodes[
      重點字元索引 as number
    ] as HTMLDivElement;

    if (!(charEl as unknown)) {
      return () => {};
    }

    const { scrollTop } = wrapperRef.current;
    const { offsetTop } = charEl;
    const { height } = charEl.getBoundingClientRect();

    if (offsetTop + height > scrollTop + MAX_HEIGHT) {
      wrapperRef.current.scrollTop = offsetTop + height - MAX_HEIGHT;
    } else if (offsetTop < scrollTop) {
      wrapperRef.current.scrollTop = offsetTop;
    }
  }, [重點字元索引]);

  return (
    <div
      ref={wrapperRef as MutableRefObject<HTMLDivElement>}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxHeight: MAX_HEIGHT,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {charsObjsList.map((charObj, index) => {
        const { pronunciation, word } = charObj;

        const shouldHidePronunciation =
          !(顯示目前字元的發音 && index === 重點字元索引) &&
          shouldHidePronunciationDefault;

        const showMulticharHere =
          (!!showMultichar && showMultichar[0] === index) ||
          (multichar && (multichar[0] === index || multichar[1] === index));

        const opacity = index === 重點字元索引 ? 1 : 0.3;

        const hasLeft =
          (showMultichar?.[0] === index && showMultichar[1] === 'left') ||
          multichar?.[0] === index;

        const hasRight =
          (showMultichar?.[0] === index && showMultichar[1] === 'right') ||
          multichar?.[1] === index;

        return (
          <span
            key={`${index}${charObj.word}`}
            onClick={(e) => {
              e.stopPropagation();

              setMultichar(null);
              setShowMultichar(null);

              onSymbolClick?.({
                charObj,
                charsObjsList,
                index,
              });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (!multichar) {
                setMultichar([index, null]);
              }
            }}
            onMouseEnter={() => {
              if (!multichar) setShowMultichar([index, 'left']);
              else if (multichar[1] === null && index >= multichar[0])
                setShowMultichar([index, 'right']);
            }}
            onMouseLeave={() => {
              if (!multichar || typeof multichar[1] !== 'number') {
                setShowMultichar(null);
              }
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (!multichar) return;

              if (multichar[1] === null) {
                setMultichar([multichar[0], index]);
              }
            }}
            style={{
              color:
                colorOfChar?.(index === 重點字元索引, charObj) ?? undefined,
              cursor: pronunciation && onSymbolClick ? 'pointer' : 'default',
              display: 'inline-flex',
              flexDirection: 'column',
              marginBottom: 10,
              position: 'relative',
            }}
          >
            {showMulticharHere && (
              <button
                ref={
                  !!multichar && multichar[1] === index
                    ? setAnchorEl
                    : undefined
                }
                style={{
                  zIndex: 3,
                  ...(hasLeft && {
                    left: 0,
                  }),
                  padding: 5,
                  ...(hasRight && {
                    right: 0,
                  }),
                  position: 'absolute',
                }}
              >
                {hasLeft ? (
                  hasRight ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronLeft />
                  )
                ) : (
                  <FaChevronRight />
                )}
              </button>
            )}
            <span
              style={{
                fontSize: 13,
                height: 10,
                opacity,
                textAlign: 'center',
                userSelect: 'none',
                visibility:
                  shouldHidePronunciation || showMulticharHere
                    ? 'hidden'
                    : undefined,
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {pronunciation}
            </span>
            <span
              className="min-width-[10px] inline pt-[5px] text-center"
              style={{
                fontSize: usedFontSize + 10,
                opacity,
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
      {multichar && typeof multichar[1] === 'number' && anchorEl && (
        <BasePopup
          anchor={anchorEl}
          keepMounted
          open={typeof multichar[1] === 'number'}
        >
          <ClickAwayListener onClickAway={() => setMultichar(null)}>
            <div style={{ background: 'rgba(0, 0, 0, 0.7)', padding: 40 }}>
              {(() => {
                const [firstIndex, secondIndex] = multichar;

                const word = charsObjsList
                  .slice(firstIndex, secondIndex + 1)
                  .map((c) => c.word)
                  .join('');

                return (
                  <div className="flex flex-col gap-[16px]">
                    <div>{word}</div>
                    <div>
                      <GoogleTranslateButton
                        language={i18n.language}
                        text={word}
                      />
                    </div>
                    {hasCantodict && (
                      <div>
                        <CantoDictButton text={word} />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </ClickAwayListener>
        </BasePopup>
      )}
    </div>
  );
};

export default CharactersDisplay;
