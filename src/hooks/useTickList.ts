import { useCallback, useState } from 'react'

const KEY = 'ticked-routes'

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useTickList() {
  const [ticked, setTicked] = useState<string[]>(read)

  const tick = useCallback((id: string) => {
    setTicked(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isTicked = useCallback((id: string) => ticked.includes(id), [ticked])

  return { ticked, tick, isTicked }
}
