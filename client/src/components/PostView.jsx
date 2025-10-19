import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { postService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Skeleton from './ui/Skeleton'

export default function PostView() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const nav = useNavigate()
  const toast = useToast()

  useEffect(() => {
    let mounted = true
    postService.getPost(id)
      .then((res) => {
        if (mounted) setPost(res.data || res)
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
    return () => (mounted = false)
  }, [id])

  const handleAddComment = async (e) => {
    e.preventDefault()
    try {
      const res = await postService.addComment(id, { content: comment })
      setPost(res.data || res)
      setComment('')
      toast.show('Comment added')
    } catch (err) {
      toast.show('Failed to add comment')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await postService.deletePost(id)
      nav('/')
      toast.show('Post deleted')
    } catch (err) {
      toast.show('Delete failed')
    }
  }

  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()

  if (loading) return (
    <Card>
      <Skeleton height={28} style={{ marginBottom: 12 }} />
      <Skeleton height={160} />
    </Card>
  )
  if (error) return <p>Error: {error}</p>
  if (!post) return <p>Post not found</p>

  return (
    <Card className="card-lg">
      <div style={{ display: 'flex', gap: 16 }}>
        {post.featuredImage && <img src={post.featuredImage.startsWith('/') ? post.featuredImage : post.featuredImage} alt="cover" style={{ width: 220, height: 140, objectFit: 'cover', borderRadius: 8 }} />}
        <div>
          <h1 style={{ margin: 0 }}>{post.title}</h1>
          <div className="meta">By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {currentUser && post.author && (currentUser.id === post.author._id || currentUser.id === post.author) && (
        <div style={{ marginTop: 12 }} className="actions">
          <Button onClick={() => nav(`/posts/${id}/edit`)}>Edit</Button>
          <Button className="secondary" onClick={handleDelete}>Delete</Button>
        </div>
      )}

      <div style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: post.content }} />

      <section className="comments">
        <h3>Comments</h3>
        {post.comments && post.comments.length === 0 && <p>No comments yet.</p>}
        <div>
          {post.comments && post.comments.map((c) => (
            <div key={c._id || c.createdAt} className="comment">{c.content} <div style={{ fontSize: 12, color: '#374151' }}>— {c.user?.name || 'User'}</div></div>
          ))}
        </div>

        <form onSubmit={handleAddComment} style={{ marginTop: 12 }}>
          <div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment" required />
          </div>
          <div style={{ marginTop: 8 }}>
            <Button type="submit">Add comment</Button>
          </div>
        </form>
      </section>
    </Card>
  )
}
