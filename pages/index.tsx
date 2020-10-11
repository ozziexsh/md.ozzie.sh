import Head from 'next/head';
import { ChangeEvent, useEffect, useState } from 'react';
import { debounce } from 'ts-debounce';
import Editor from '../components/editor';
import Preview from '../components/preview';
import { useWindowSize } from '../util';

const DEFAULT_CONTENT = `# Markdown Preview + Editor

* Simple — Just a textarea and preview
* Saves to your browser as you type
* Toggle between 3 modes (Split/Focus/Preview) in the top right
* Preview styled by [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)

Made with ♥ by [oz](https://ozzie.sh)`;

const STORAGE_KEY = 'oz-sh-md';

const MAX_SPLIT_WIDTH = 768;

const saveToLocal = debounce((newText: string) => {
  localStorage.setItem(STORAGE_KEY, newText);
}, 500);

function getFromLocal() {
  return localStorage.getItem(STORAGE_KEY);
}

enum Mode {
  Split,
  Focus,
  Preview,
}

export default function Home() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState(Mode.Split);
  const windowSize = useWindowSize();

  function onTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.currentTarget.value);
    saveToLocal(e.currentTarget.value);
  }

  useEffect(() => {
    const oldContent = getFromLocal();
    setContent(oldContent || DEFAULT_CONTENT);
  }, []);

  useEffect(() => {
    if (
      windowSize.width &&
      windowSize.width <= MAX_SPLIT_WIDTH &&
      mode === Mode.Split
    ) {
      setMode(Mode.Focus);
    }
  }, [windowSize.height, windowSize.width]);

  return (
    <div className={'h-screen'}>
      <Head>
        <title>Markdown Editor + Preview | ozzie.sh</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="actions flex flex-row items-center shadow">
        {windowSize.width && windowSize.width >= MAX_SPLIT_WIDTH ? (
          <button
            className={`py-2 px-4 border-r border-solid border-gray-400 ${
              mode === Mode.Split ? 'bg-black text-white' : ''
            }`}
            onClick={() => setMode(Mode.Split)}
          >
            Split
          </button>
        ) : null}
        <button
          className={`py-2 px-4 border-r border-solid border-gray-400 ${
            mode === Mode.Focus ? 'bg-black text-white' : ''
          }`}
          onClick={() => setMode(Mode.Focus)}
        >
          Focus
        </button>
        <button
          className={`py-2 px-4 ${
            mode === Mode.Preview ? 'bg-black text-white' : ''
          }`}
          onClick={() => setMode(Mode.Preview)}
        >
          Preview
        </button>
      </div>

      {(() => {
        // could have done this without repitition
        // but woulda been real ugly
        switch (mode) {
          case Mode.Focus:
            return (
              <div className="h-full flex flex-row justify-center">
                <Editor
                  value={content}
                  onChange={onTextChange}
                  className={
                    'w-full md:w-1/2 resize-none p-4 text-lg border-r border-l border-solid border-gray-400'
                  }
                />
              </div>
            );
          case Mode.Preview:
            return (
              <div className="h-full flex flex-row justify-center">
                <div className="w-full md:w-1/2 overflow-scroll border-r border-l border-solid border-gray-400">
                  <Preview value={content} />
                </div>
              </div>
            );
          case Mode.Split:
          default:
            return (
              <div className="h-full flex flex-row justify-center">
                <Editor
                  value={content}
                  onChange={onTextChange}
                  className={
                    'w-full md:w-1/2 resize-none p-4 text-lg border-r border-solid border-gray-400'
                  }
                />
                <div className="w-full md:w-1/2 overflow-scroll">
                  <Preview value={content} />
                </div>
              </div>
            );
        }
      })()}

      <style jsx>{`
        .actions {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 50;
        }
      `}</style>
    </div>
  );
}
