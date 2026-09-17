import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '../../lib/supabase'
import { SupabasePost } from '../../typings'
import styles from './Admin.module.scss'

type View = 'login' | 'list' | 'editor'

export default function Admin({ onPostsChange }: { onPostsChange: () => void }) {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<SupabasePost[]>([])
  const [editingPost, setEditingPost] = useState<SupabasePost | null>(null)

  const [title, setTitle] = useState('')
  const titleRef = useRef('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState<'climbing' | 'coding' | 'other'>('other')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post here…' }),
    ],
    content: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setView('list')
        fetchPosts()
      }
    })
  }, [])

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setAuthError(error.message); return }
    setView('list')
    fetchPosts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setView('login')
  }

  function openNewPost() {
    setEditingPost(null)
    setTitle('')
    titleRef.current = ''
    setSummary('')
    setCategory('other')
    setCoverImageUrl('')
    editor?.commands.setContent('')
    setView('editor')
  }

  function openEditPost(post: SupabasePost) {
    setEditingPost(post)
    setTitle(post.title)
    titleRef.current = post.title
    setSummary(post.summary ?? '')
    setCategory(post.category)
    setCoverImageUrl(post.cover_image_url ?? '')
    editor?.commands.setContent(post.content ?? '')
    setView('editor')
  }

  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const filename = `cover-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('blog-images').upload(filename, file)
    if (error) { alert('Upload failed: ' + error.message); setUploadingImage(false); return }
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path)
    setCoverImageUrl(urlData.publicUrl)
    setUploadingImage(false)
  }

  async function handleUploadInlineImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const filename = `inline-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('blog-images').upload(filename, file)
    if (error) { alert('Upload failed: ' + error.message); setUploadingImage(false); return }
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path)
    editor.chain().focus().setImage({ src: urlData.publicUrl }).run()
    setUploadingImage(false)
  }

  async function handleSave(publish: boolean) {
    const currentTitle = titleRef.current || title
    if (!currentTitle.trim()) { alert('Title is required'); return }
    setSaving(true)
    const content = editor?.getJSON() ?? {}
    const payload = {
      title: currentTitle.trim(),
      summary: summary.trim() || null,
      content,
      category,
      cover_image_url: coverImageUrl || null,
      published: publish,
      updated_at: new Date().toISOString(),
    }

    if (editingPost) {
      await supabase.from('posts').update(payload).eq('id', editingPost.id)
    } else {
      await supabase.from('posts').insert(payload)
    }

    setSaving(false)
    onPostsChange()
    fetchPosts()
    setView('list')
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    onPostsChange()
    fetchPosts()
  }

  if (view === 'login') {
    return (
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Admin</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {authError && <p className={styles.error}>{authError}</p>}
            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.listHead}>
            <h1 className={styles.pageTitle}>Posts</h1>
            <div className={styles.listActions}>
              <button className={styles.btnPrimary} onClick={openNewPost}>New post</button>
              <button className={styles.btnGhost} onClick={handleLogout}>Sign out</button>
            </div>
          </div>

          <div className={styles.postList}>
            {posts.map(post => (
              <div key={post.id} className={styles.postRow}>
                <div className={styles.postInfo}>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postMeta}>
                    <span className={styles.postCat} data-cat={post.category}>{post.category}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {!post.published && <span className={styles.draftBadge}>Draft</span>}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <button className={styles.btnGhost} onClick={() => openEditPost(post)}>Edit</button>
                  <button className={styles.btnDanger} onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.editorHead}>
          <button className={styles.back} onClick={() => setView('list')}>← Posts</button>
          <h2 className={styles.editorHeading}>{editingPost ? 'Edit post' : 'New post'}</h2>
        </div>

        <div className={styles.editorForm}>
          <input
            className={styles.titleInput}
            type="text"
            placeholder="Post title"
            value={title}
            onChange={e => { setTitle(e.target.value); titleRef.current = e.target.value }}
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Short summary (optional)"
            value={summary}
            onChange={e => setSummary(e.target.value)}
          />

          <div className={styles.row}>
            <select className={styles.select} value={category} onChange={e => setCategory(e.target.value as any)}>
              <option value="other">Other</option>
              <option value="climbing">Climbing</option>
              <option value="coding">Coding</option>
            </select>

            <label className={styles.uploadBtn}>
              {uploadingImage ? 'Uploading…' : coverImageUrl ? 'Change cover' : 'Upload cover image'}
              <input type="file" accept="image/*" onChange={handleUploadCover} style={{ display: 'none' }} />
            </label>

            {coverImageUrl && <img src={coverImageUrl} alt="Cover" className={styles.coverThumb} />}
          </div>

          <div className={styles.editorToolbar}>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBold().run()} data-active={editor?.isActive('bold')}>B</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleItalic().run()} data-active={editor?.isActive('italic')} style={{ fontStyle: 'italic' }}>I</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} data-active={editor?.isActive('heading', { level: 2 })}>H2</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} data-active={editor?.isActive('heading', { level: 3 })}>H3</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBulletList().run()} data-active={editor?.isActive('bulletList')}>List</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBlockquote().run()} data-active={editor?.isActive('blockquote')}>"</button>
            <label className={styles.toolBtn}>
              {uploadingImage ? '…' : 'Image'}
              <input type="file" accept="image/*" onChange={handleUploadInlineImage} style={{ display: 'none' }} />
            </label>
          </div>

          <div className={styles.editorWrap}>
            <EditorContent editor={editor} className={styles.editor} />
          </div>

          <div className={styles.saveRow}>
            <button type="button" className={styles.btnGhost} onClick={() => handleSave(false)} disabled={saving}>
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            <button type="button" className={styles.btnPrimary} onClick={() => handleSave(true)} disabled={saving}>
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
