import React, { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useNavigate, useParams } from 'react-router-dom'
import { postService, uploadService, categoryService } from '../services/api'
import { usePosts } from '../context/PostsContext'



export default function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { createPost } = usePosts()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let featuredImage = null
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await uploadService.uploadFile(fd)
        featuredImage = res.data?.url || res.url
      }
      const created = await createPost({ title, content, category, featuredImage })
      toast.show('Post created')
      nav(`/posts/${created._id}`)
    } catch (err) {
      console.error(err)
      toast.show('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    categoryService.getAllCategories().then((res) => { if (mounted) setCategories(res.data || res) }).catch(() => {})
    return () => (mounted = false)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="field">
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div className="field">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- choose --</option>
          {categories.map((c) => (
            <option value={c._id} key={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Featured Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        {file && (
          <div style={{ marginTop: 8 }}>
            <img src={URL.createObjectURL(file)} alt="preview" style={{ width: 200, borderRadius: 8 }} />
          </div>
        )}
      </div>
      <div className="actions">
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Post'}</button>
      </div>
    </form>
  )
}
