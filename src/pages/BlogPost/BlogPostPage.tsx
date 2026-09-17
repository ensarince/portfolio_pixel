import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

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

const Caption = Node.create({
  name: 'caption',
  group: 'block',
  content: 'inline*',
  parseHTML() { return [{ tag: 'p[data-caption]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-caption': '' }), 0]
  },
})
import Header from '../../components/Header'
import { SupabasePost } from '../../typings'
import styles from './BlogPostPage.module.scss'

type Props = { posts: SupabasePost[] | undefined }

function formatDate(str?: string) {
  if (!str) return ''
  try {
    return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return '' }
}

function PostContent({ content }: { content: any }) {
  const editor = useEditor({
    extensions: [StarterKit, ResizableImage, TextStyle, Color, Caption],
    content,
    editable: false,
  })

  if (!editor) return null
  return <EditorContent editor={editor} />
}

export default function BlogPostPage({ posts }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<SupabasePost | null>(null)

  useEffect(() => {
    const found = posts?.find(p => p.id === id)
    setPost(found ?? null)
  }, [posts, id])

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <button className={styles.back} onClick={() => navigate('/blog')}>← Blog</button>

          {!post && posts !== undefined && <div className={styles.loading}>Not found</div>}
          {!post && posts === undefined && <div className={styles.loading}>Loading…</div>}

          {post && (
            <article className={styles.article}>
              <div className={styles.postMeta}>
                <span className={styles.postCategory} data-cat={post.category}>{post.category}</span>
                <span className={styles.postDate}>{formatDate(post.created_at)}</span>
              </div>

              <h1 className={styles.postTitle}>{post.title}</h1>

              {post.summary && <p className={styles.postSummary}>{post.summary}</p>}

              {post.cover_image_url && (
                <img className={styles.postImage} src={post.cover_image_url} alt={post.title} />
              )}

              <div className={styles.postBody}>
                {post.content && <PostContent content={post.content} />}
              </div>

              <div className={styles.postFooter}>
                <button className={styles.backLinkBottom} onClick={() => navigate('/blog')}>← Back to blog</button>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  )
}
