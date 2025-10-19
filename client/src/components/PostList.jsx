import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'
import Skeleton from './ui/Skeleton'
import { postService } from '../services/api'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [meta, setMeta] = useState(null)

  const load = (p = 1) => {
    setLoading(true)
    postService.getAllPosts(p)
      .then((res) => {
        // handle response shapes: { success, data, meta } or direct array
        const payload = res && res.data !== undefined ? res.data : res
        setPosts(Array.isArray(payload) ? payload : (payload || []))
        // store meta if available
          if (res && res.meta) {
            setMeta(res.meta)
          } else if (res && res.total) {
            setMeta({ total: res.total })
          } else {
            setMeta(null)
          }
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(page)
  }, [page])

  const doSearch = (e) => {
    e.preventDefault()
    if (!query) return load(1)
    setLoading(true)
    postService.searchPosts(query)
      .then((res) => {
        const payload = res && res.data !== undefined ? res.data : res
        setPosts(Array.isArray(payload) ? payload : (payload || []))
        setMeta(null)
      })
      .catch((err) => setError(err.message || 'Search failed'))
      .finally(() => setLoading(false))
  }

  if (loading) return (
    <div>
      <Skeleton height={28} style={{ marginBottom: 12 }} />
      <div style={{ display: 'grid', gap: 12 }}>
        {[1,2,3].map(i => <Skeleton key={i} height={120} />)}
      </div>
    </div>
  )
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Posts</h2>
        <form onSubmit={doSearch} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts..." />
          <button className="btn" type="submit">Search</button>
        </form>
      </div>

      {posts.length === 0 && <p>No posts yet.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {posts.map((p) => {
          // compute image URL: if backend provided a relative path like '/uploads/..', prefix with server origin
          let imgSrc = null
          if (p.featuredImage) {
            const isRelative = p.featuredImage.startsWith('/')
            if (isRelative) {
              // default API origin (strip '/api' if present)
              const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '').replace(/\/api$/,'')
              const origin = apiBase.replace(/\/api$/, '')
              imgSrc = `${origin}${p.featuredImage}`
            } else {
              imgSrc = p.featuredImage
            }
          }

          return (
            <Card key={p._id} className="post-card">
              {imgSrc && <img src={imgSrc} alt="cover" />}
              <div>
                <Link to={`/posts/${p._id}`} style={{ fontSize: 18, fontWeight: 700 }}>{p.title}</Link>
                <div className="meta">{p.author?.name} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</div>
                <p>{p.excerpt}</p>
                <div style={{ marginTop: 8 }}>
                  <Link to={`/posts/${p._id}`}><Button>Read</Button></Link>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div style={{ marginTop: 12 }} className="actions">
        <Button className="secondary" onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Prev</Button>
        <span>Page {page}{meta && meta.total ? ` — ${meta.total} items` : ''}</span>
        <Button
          onClick={() => setPage((s) => s + 1)}
          disabled={meta ? (page * (meta.limit || 10) >= (meta.total || 0)) : false}
        >Next</Button>
      </div>
    </div>
  )
}
