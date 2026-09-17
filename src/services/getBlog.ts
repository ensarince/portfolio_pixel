import { supabase } from '../lib/supabase'
import { SupabasePost } from '../typings'

export default async function getBlogPosts(): Promise<{ posts: SupabasePost[] }> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase blog fetch error:', error)
    return { posts: [] }
  }
  return { posts: data ?? [] }
}
