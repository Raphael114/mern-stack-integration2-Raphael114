import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postService, uploadService, categoryService } from '../services/api'
import { useToast } from '../context/ToastContext'

export default function PostEdit() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const nav = useNavigate()
  const toast = useToast()

  useEffect(() => {
    let mounted = true
    postService.getPost(id).then((res) => { const p = res.data || res; if (mounted) { setPost(p); setTitle(p.title); setContent(p.content); setCategory(p.category?._id || ''); }})
    categoryService.getAllCategories().then((res) => { if (mounted) setCategories(res.data || res) }).catch(() => {})
    return () => (mounted = false)
  }, [id])

  const handle = async (e) => {
    e.preventDefault()
    try {
      let featuredImage = post.featuredImage
      if (file) {
        const fd = new FormData(); fd.append('file', file)
        const res = await uploadService.uploadFile(fd)
        featuredImage = res.data?.url || res.url
      }
      const updated = await postService.updatePost(id, { title, content, category, featuredImage })
      toast.show('Post updated')
      nav(`/posts/${updated.data?._id || updated._id || id}`)
    } catch (err) { alert('Update failed') }
  }

  if (!post) return <p>Loading post...</p>

  return (
    <form onSubmit={handle} className="card">
      <div className="field"><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="field"><label>Content</label><textarea value={content} onChange={(e) => setContent(e.target.value)} /></div>
      <div className="field">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- choose --</option>
          {categories.map((c) => <option value={c._id} key={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Featured Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        {file && <div style={{ marginTop: 8 }}><img src={URL.createObjectURL(file)} alt="preview" style={{ width: 200, borderRadius: 8 }} /></div>}
        {!file && post.featuredImage && <div style={{ marginTop: 8 }}><img src={post.featuredImage} alt="current" style={{ width: 200, borderRadius: 8 }} /></div>}
      </div>
      <div className="actions"><button className="btn" type="submit">Save</button></div>
    </form>
  )
}
