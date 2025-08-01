import 獲取 from 'lodash/get';
import { TextareaHTMLAttributes, useEffect, useRef } from 'react';

type 特性 = {
  無遊標?: boolean;
  autoScroll?: boolean;
  setRef?: (ref: HTMLTextAreaElement | null) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({
  無遊標,
  autoScroll = false,
  className,
  onChange,
  setRef,
  style,
  ...特性
}: 特性) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const 顏色 = 獲取(style, 'color', 'var(--color-text, "black")');

  const 遊標樣式 = 無遊標
    ? {
        color: 'transparent',
        textShadow: `0 0 0 ${顏色}`,
      }
    : {};

  if (setRef) {
    setRef(ref.current);
  }

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  });

  return (
    <textarea
      className={[
        'border-[1px] border-solid border-[var(--color-background)] p-2',
        className,
      ].join(' ')}
      data-gramm_editor={false}
      onChange={onChange}
      ref={ref}
      spellCheck={false}
      style={{
        outline: 0,
        resize: 'none',
        width: '100%',

        ...遊標樣式,
        ...style,
      }}
      {...特性}
    />
  );
};

export default TextArea;
