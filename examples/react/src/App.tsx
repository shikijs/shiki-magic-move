import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'
import * as React from 'react'

import { ShikiMagicMove } from '../../../src/react'

export default function App() {
  const [preCode, setPreCode] = React.useState('console.log("Hello, world!")')
  const [code, setCode] = React.useState(preCode)

  const options = React.useMemo(() => ({ duration: 750 }), [])

  const highlighter = React.useRef<Highlighter>()
  const [isHighlighterReady, setIsHighlighterReady] = React.useState(false)

  const [isAnimating, setIsAnimating] = React.useState(false)
  const onStart = React.useCallback(() => {
    setIsAnimating(true)
  }, [])
  const onEnd = React.useCallback(() => {
    setIsAnimating(false)
  }, [])

  React.useEffect(() => {
    getHighlighter({
      themes: ['nord'],
      langs: ['ts'],
    })
      .then((h) => {
        highlighter.current = h
        setIsHighlighterReady(true)
      })
  }, [])

  return (
    <div className="grid grid-cols-2 h-screen">
      <div>
        <textarea
          value={preCode}
          onChange={e => setPreCode(e.target.value)}
          className="w-full h-[50vh] p-4"
        />
        <button
          onClick={() => {
            setCode(preCode)
          }}
          className="w-full p-4 bg-blue-500 text-white"
        >
          Commit
        </button>
        {isAnimating
          ? (
            <div className="bg-green-500">
              isAnimating
            </div>
            )
          : null}
      </div>
      {isHighlighterReady
        ? (
          <ShikiMagicMove
            highlighter={highlighter.current!}
            lang="ts"
            theme="nord"
            code={code}
            className="font-mono relative"
            options={options}
            onStart={onStart}
            onEnd={onEnd}
          />
          )
        : null}
    </div>
  )
}
