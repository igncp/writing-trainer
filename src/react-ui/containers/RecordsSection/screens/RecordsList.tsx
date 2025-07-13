import { backendClient, SongItem } from '#/react-ui/lib/backendClient';
import { TOOLTIP_ID } from '#/utils/tooltip';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextRecord,
  TextRecordObj,
} from 'writing-trainer-wasm/writing_trainer_wasm';

import Button from '../../../components/button/button';
import TextInput from '../../../components/TextInput/TextInput';

type CellProps = {
  bold?: boolean;
  className?: string;
  label?: string;
  tooltip?: string;
  value: string;
};

const Cell = ({ bold, className, label, tooltip, value }: CellProps) => (
  <div
    className={className}
    style={{
      display: 'inline-block',
      marginRight: 30,
      ...(bold ? { fontWeight: 700 } : {}),
    }}
    {...(tooltip
      ? {
          'data-tooltip-content': tooltip,
          'data-tooltip-id': TOOLTIP_ID,
        }
      : {})}
  >
    {label && (
      <>
        <b>{label}</b>:{' '}
      </>
    )}
    {value}
  </div>
);

const formatRecordDate = (d: number): string => {
  const date = new Date(d);

  const dateStr = date.toLocaleDateString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  });

  return `[${dateStr}]`;
};

type 條目清單屬性 = {
  disabled: boolean;
  onPronunciationLoad: (p: string) => void;
  onRecordEdit: (r: TextRecordObj) => void;
  onRecordLoad: (r: TextRecordObj) => void;
  onRecordRemove: (r: TextRecordObj) => void;
  onSongLoad: (s: string[]) => void;
  records: TextRecordObj[];
  setSongsFilter: (s: string) => void;
  songs: { list: SongItem[]; total: number };
  songsFilter: string;
};

const RecordsList = ({
  disabled,
  onPronunciationLoad,
  onRecordEdit,
  onRecordLoad,
  onRecordRemove,
  onSongLoad,
  records,
  setSongsFilter,
  songs,
  songsFilter,
}: 條目清單屬性) => {
  const { t } = useTranslation();
  const [filterText, setFilterText] = useState<string>('');

  const filteredList = useMemo(() => {
    const nativeRecords = records.map((r) => TextRecord.from_js(r));

    return TextRecord.filter_by_text(filterText, nativeRecords).map((r) =>
      r.to_js(),
    );
  }, [filterText, records]);

  return (
    <div>
      {records.length > 0 && (
        <div style={{ padding: 10, position: 'relative' }}>
          <TextInput
            autoFocus
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
            onEnterPress={() => {
              if (filteredList.length > 0) {
                onRecordLoad(filteredList[0]);
              }
            }}
            placeholder="Filter by name and language"
            style={{ width: '100%' }}
          />
        </div>
      )}
      {!!filteredList.length && (
        <div style={{ maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
          {filteredList.map((filteredItem) => {
            const { created_on, id, last_loaded_on, name } = filteredItem;

            return (
              <div
                className="flex flex-row flex-wrap justify-between gap-[16px] odd:bg-[#333]"
                key={id}
                style={{ padding: 10 }}
              >
                <Cell label={t('record.name', 'Name')} value={name} />
                <Cell
                  tooltip={t('record.created', 'Created')}
                  value={formatRecordDate(Number(created_on))}
                />
                <Cell
                  tooltip={t('record.loaded', 'Loaded')}
                  value={formatRecordDate(Number(last_loaded_on))}
                />
                <Cell
                  bold
                  tooltip={t('record.language', 'Language')}
                  value={filteredItem.language}
                />
                {filteredItem.link && (
                  <a
                    href={filteredItem.link}
                    style={{ marginRight: 15 }}
                    target="_blank"
                    {...(filteredItem.link && {
                      'data-tooltip-content': filteredItem.link,
                      'data-tooltip-id': TOOLTIP_ID,
                    })}
                  >
                    {t('record.link')}
                  </a>
                )}
                <div className="flex flex-row gap-[16px]">
                  <Button
                    disabled={disabled}
                    onClick={() => {
                      onRecordLoad(filteredItem);
                    }}
                  >
                    {t('record.load')}
                  </Button>
                  <Button
                    disabled={disabled}
                    onClick={() => {
                      onRecordEdit(filteredItem);
                    }}
                  >
                    {t('record.edit')}
                  </Button>
                  <Button
                    disabled={disabled}
                    onClick={() => {
                      onRecordRemove(filteredItem);
                    }}
                  >
                    {t('record.remove')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
        <TextInput
          className="my-[16px] w-full"
          onChange={(e) => {
            setSongsFilter(e.target.value);
          }}
          onEnterPress={() => {}}
          placeholder={t('record.filter', 'Filter songs')}
          value={songsFilter}
        />
        {songs.list.map((song) => {
          const { artist, id: songId, title, videoUrl } = song;

          const 影片連結網址 = videoUrl.startsWith('https://')
            ? videoUrl
            : `https://www.youtube.com/watch?v=${videoUrl}`;

          return (
            <div
              className="grid min-w-[1024px] grid-cols-4 flex-wrap items-center justify-between gap-[16px] odd:bg-[#333]"
              key={songId}
              style={{ padding: 10 }}
            >
              <Cell value={title} />
              <Cell tooltip={t('record.artist')} value={artist} />
              {videoUrl && (
                <a
                  href={影片連結網址}
                  style={{ marginRight: 15 }}
                  target="_blank"
                  {...(影片連結網址 && {
                    'data-tooltip-content': 影片連結網址,
                    'data-tooltip-id': TOOLTIP_ID,
                  })}
                >
                  {t('record.video')}
                </a>
              )}
              <Button
                disabled={disabled}
                onClick={() => {
                  void backendClient
                    .getSongLyrics(song.id)
                    .then(({ lyrics, pronunciation }) => {
                      onSongLoad(
                        [song.title].concat((lyrics || '').split('\n')),
                      );

                      if (pronunciation) {
                        onPronunciationLoad(pronunciation);
                      }
                    });
                }}
              >
                {t('record.load')}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecordsList;
