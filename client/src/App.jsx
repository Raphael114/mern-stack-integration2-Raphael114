import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PostList from './components/PostList'
import PostView from './components/PostView'
import PostForm from './components/PostForm'
import PostEdit from './components/PostEdit'
import { Layout, ProtectedRoute } from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import { PostsProvider } from './context/PostsContext'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <PostsProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
            <Route path="/posts/:id/edit" element={<ProtectedRoute><PostEdit /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </PostsProvider>
  )
}
