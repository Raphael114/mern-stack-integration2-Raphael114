import React, { createContext, useContext, useEffect, useState } from 'react'
import { postService } from '../services/api'

const PostsContext = createContext()

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    postService.getAllPosts()
      .then((res) => {
        const data = res.data || res
        if (mounted) setPosts(data)
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
    return () => (mounted = false)
  }, [])

  // Optimistic create
  const createPost = async (postData) => {
    const tempId = `temp-${Date.now()}`
    const temp = { ...postData, _id: tempId }
    setPosts((p) => [temp, ...p])
    try {
      const res = await postService.createPost(postData)
      const created = res.data || res
      setPosts((p) => p.map((x) => (x._id === tempId ? created : x)))
      return created
    } catch (err) {
      // rollback
      setPosts((p) => p.filter((x) => x._id !== tempId))
      throw err
    }
  }

  return (
    <PostsContext.Provider value={{ posts, loading, error, createPost, setPosts }}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePosts = () => useContext(PostsContext)
