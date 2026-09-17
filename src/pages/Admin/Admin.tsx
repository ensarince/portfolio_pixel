import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { supabase } from '../../lib/supabase'
import { SupabasePost } from '../../typings'
import styles from './Admin.module.scss'

// Image extension with resizable width attribute
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: el => el.getAttribute('data-width') || '100%',
        renderHTML: attrs => ({
          'data-width': attrs.width,
          style: `width: ${attrs.width}; max-width: 100%; height: auto; display: block; margin: 1.5em auto;`,
        }),
      },
    }
  },
})

// Caption node (italic dim text, centered, below images)
const Caption = Node.create({
  name: 'caption',
  group: 'block',
  content: 'inline*',
  parseHTML() { return [{ tag: 'p[data-caption]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-caption': '' }), 0]
  },
})

type View = 'login' | 'list' | 'editor'
type ListTab = 'posts' | 'ideas'

type Idea = {
  id: string
  text: string
  done: boolean
  created_at: string
}

export default function Admin({ onPostsChange }: { onPostsChange: () => void }) {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<SupabasePost[]>([])
  const [editingPost, setEditingPost] = useState<SupabasePost | null>(null)
  const [listTab, setListTab] = useState<ListTab>('posts')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState('')

  const [title, setTitle] = useState('')
  const titleRef = useRef('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState<'climbing' | 'coding' | 'other'>('other')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [pinned, setPinned] = useState(false)
  const [postDate, setPostDate] = useState(() => new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post here…' }),
      TextStyle,
      Color,
      Caption,
    ],
    content: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setView('list')
        fetchPosts()
        fetchIdeas()
      }
    })
  }, [])

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  async function fetchIdeas() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setIdeas(data ?? [])
  }

  async function addIdea(e: React.FormEvent) {
    e.preventDefault()
    if (!newIdea.trim()) return
    await supabase.from('notes').insert({ text: newIdea.trim() })
    setNewIdea('')
    fetchIdeas()
  }

  async function toggleIdea(idea: Idea) {
    await supabase.from('notes').update({ done: !idea.done }).eq('id', idea.id)
    fetchIdeas()
  }

  async function deleteIdea(id: string) {
    await supabase.from('notes').delete().eq('id', id)
    fetchIdeas()
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
    fetchIdeas()
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
    setPinned(false)
    setPostDate(new Date().toISOString().split('T')[0])
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
    setPinned(post.pinned ?? false)
    setPostDate(post.created_at.split('T')[0])
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
      pinned,
      created_at: new Date(postDate).toISOString(),
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

  const imageActive = editor?.isActive('image')

  if (view === 'login') {
    return (
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Admin</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            {authError && <p className={styles.error}>{authError}</p>}
            <button className={styles.btnPrimary} type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
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
            <h1 className={styles.pageTitle}>{listTab === 'posts' ? 'Posts' : 'Ideas'}</h1>
            <div className={styles.listActions}>
              {listTab === 'posts' && <button className={styles.btnPrimary} onClick={openNewPost}>New post</button>}
              <button className={styles.btnGhost} onClick={handleLogout}>Sign out</button>
            </div>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${listTab === 'posts' ? styles.tabActive : ''}`}
              onClick={() => setListTab('posts')}
            >
              Posts ({posts.length})
            </button>
            <button
              className={`${styles.tabBtn} ${listTab === 'ideas' ? styles.tabActive : ''}`}
              onClick={() => setListTab('ideas')}
            >
              Ideas ({ideas.filter(i => !i.done).length})
            </button>
          </div>

          {listTab === 'posts' && (
            <div className={styles.postList}>
              {posts.map(post => (
                <div key={post.id} className={styles.postRow}>
                  <div className={styles.postInfo}>
                    <span className={styles.postTitle}>{post.title}</span>
                    <span className={styles.postMeta}>
                      <span className={styles.postCat} data-cat={post.category}>{post.category}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.pinned && <span className={styles.pinnedBadge}>Pinned</span>}
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
          )}

          {listTab === 'ideas' && (
            <div className={styles.ideasWrap}>
              <form onSubmit={addIdea} className={styles.ideaForm}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="New idea — what do you want to write about?"
                  value={newIdea}
                  onChange={e => setNewIdea(e.target.value)}
                />
                <button className={styles.btnPrimary} type="submit">Add</button>
              </form>

              <div className={styles.ideaList}>
                {ideas.map(idea => (
                  <div key={idea.id} className={styles.ideaRow} data-done={idea.done}>
                    <input
                      type="checkbox"
                      className={styles.ideaCheck}
                      checked={idea.done}
                      onChange={() => toggleIdea(idea)}
                    />
                    <span className={styles.ideaText}>{idea.text}</span>
                    <span className={styles.ideaDate}>{new Date(idea.created_at).toLocaleDateString()}</span>
                    <button className={styles.ideaDelete} onClick={() => deleteIdea(idea.id)} title="Delete">✕</button>
                  </div>
                ))}
                {ideas.length === 0 && <p className={styles.empty}>No ideas yet. Write one above.</p>}
              </div>
            </div>
          )}
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

          <div className={styles.row}>
            <input type="date" className={styles.input} value={postDate} onChange={e => setPostDate(e.target.value)} style={{ width: 'auto' }} />
            <label className={styles.pinToggle}>
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
              Pin this post
            </label>
          </div>

          {/* Toolbar */}
          <div className={styles.editorToolbar}>
            {/* Text formatting */}
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBold().run()} data-active={editor?.isActive('bold')}><strong>B</strong></button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleItalic().run()} data-active={editor?.isActive('italic')} style={{ fontStyle: 'italic' }}>I</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleStrike().run()} data-active={editor?.isActive('strike')} style={{ textDecoration: 'line-through' }}>S</button>

            <span className={styles.toolSep} />

            {/* Headings */}
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} data-active={editor?.isActive('heading', { level: 2 })}>H2</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} data-active={editor?.isActive('heading', { level: 3 })}>H3</button>

            <span className={styles.toolSep} />

            {/* Lists + quote */}
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBulletList().run()} data-active={editor?.isActive('bulletList')}>• List</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleOrderedList().run()} data-active={editor?.isActive('orderedList')}>1. List</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleBlockquote().run()} data-active={editor?.isActive('blockquote')}>"Quote</button>

            <span className={styles.toolSep} />

            {/* Color */}
            <label className={styles.colorPickerLabel} title="Text color">
              <input
                type="color"
                className={styles.colorPicker}
                defaultValue="#1A1A1A"
                onChange={e => editor?.chain().focus().setColor(e.target.value).run()}
              />
              <span style={{ borderBottom: `3px solid ${editor?.getAttributes('textStyle').color || '#1A1A1A'}` }}>A</span>
            </label>
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().unsetColor().run()} title="Remove color">✕ Color</button>

            <span className={styles.toolSep} />

            {/* Caption */}
            <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().toggleNode('caption', 'paragraph').run()} data-active={editor?.isActive('caption')}>Caption</button>

            {/* Image upload */}
            <label className={styles.toolBtn}>
              {uploadingImage ? '…' : '+ Image'}
              <input type="file" accept="image/*" onChange={handleUploadInlineImage} style={{ display: 'none' }} />
            </label>

            {/* Image resize — only when image is selected */}
            {imageActive && (
              <>
                <span className={styles.toolSep} />
                <span className={styles.toolHint}>Size:</span>
                <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().updateAttributes('image', { width: '30%' }).run()}>S</button>
                <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().updateAttributes('image', { width: '60%' }).run()}>M</button>
                <button type="button" className={styles.toolBtn} onClick={() => editor?.chain().focus().updateAttributes('image', { width: '100%' }).run()}>Full</button>
              </>
            )}
          </div>

          <div className={styles.editorWrap}>
            <EditorContent editor={editor} className={styles.editor} />
          </div>

          <div className={styles.saveRow}>
            <button type="button" className={styles.btnGhost} onClick={() => handleSave(false)} disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</button>
            <button type="button" className={styles.btnPrimary} onClick={() => handleSave(true)} disabled={saving}>{saving ? 'Publishing…' : 'Publish'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
