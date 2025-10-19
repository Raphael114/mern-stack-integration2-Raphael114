import { useState, useEffect, useRef } from 'react'

export default function useApi(promiseFactory, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    setLoading(true)
    setError(null)
    promiseFactory()
      .then((res) => { if (mounted.current) setData(res) })
      .catch((err) => { if (mounted.current) setError(err) })
      .finally(() => { if (mounted.current) setLoading(false) })
    return () => { mounted.current = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
