import { useEffect, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import './App.scss'
import MountainLayer from './components/Mountain/MountainLayer'
import AboutContent from './components/Mountain/AboutContent'
import Panel from './components/Panel/Panel'
import Blog from './pages/Blog/Blog'
import BlogPostPage from './pages/BlogPost/BlogPostPage'
import Climbs from './pages/Climbs/Climbs'
import ClimbDetail from './pages/ClimbDetail/ClimbDetail'
import Projects from './pages/Projects/Projects'
import Skills from './pages/Skills/Skills'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import Admin from './pages/Admin/Admin'
import getBlogPosts from './services/getBlog'
import { getClimbs } from './services/getClimbs'
import getProjects from './services/getProjects'
import getSkills from './services/getSkills'
import getGallery from './services/getGallery'
import { IconKey } from './components/Mountain/icons'
import { SupabasePost, Climb, Gallery, Project, Skill } from './typings'

const PANEL_META: Record<string, { label: string; icon: IconKey }> = {
  '/portfolio': { label: 'Work', icon: 'work' },
  '/skills': { label: 'Skills', icon: 'skills' },
  '/about': { label: 'About', icon: 'about' },
  '/blog': { label: 'Blog', icon: 'blog' },
  '/climbs': { label: 'Climbs', icon: 'climbs' },
  '/gallery': { label: 'Gallery', icon: 'gallery' },
}

// One panel for every browsing route. Keeping it mounted means moving between
// sections swaps the contents instead of tearing the panel down and rebuilding it.
function PanelLayout() {
  const { pathname } = useLocation()
  const meta = PANEL_META[pathname]
  if (!meta) return null

  return (
    <Panel label={meta.label} icon={meta.icon}>
      <Outlet />
    </Panel>
  )
}

function App() {
  const [posts, setPosts] = useState<SupabasePost[]>()
  const [projects, setProjects] = useState<Project[]>()
  const [skills, setSkills] = useState<Skill[]>()
  const [gallery, setGallery] = useState<Gallery[]>()
  const [climbs, setClimbs] = useState<Climb[]>()

  const refreshPosts = () => {
    getBlogPosts().then((data) => setPosts(data.posts))
  }

  useEffect(() => {
    refreshPosts()
    getProjects().then((data: any) => setProjects(data.projects))
    getSkills().then((data: any) => setSkills(data.skills))
    getGallery().then((data: any) => setGallery(data.gallery))
    getClimbs().then((data: any) => setClimbs(data))
  }, [])

  return (
    <BrowserRouter>
      {/* The map is the shell: it stays mounted under every panel route */}
      <MountainLayer />

      <Routes>
        <Route path="/" element={null} />

        {/* Browsing happens in panels over the living map */}
        <Route element={<PanelLayout />}>
          <Route path="/portfolio" element={<Projects projects={projects} />} />
          <Route path="/skills" element={<Skills skills={skills} />} />
          <Route path="/about" element={<AboutContent />} />
          <Route path="/blog" element={<Blog posts={posts} />} />
          <Route path="/climbs" element={<Climbs climbs={climbs} />} />
          <Route path="/gallery" element={<GalleryPage gallery={gallery} />} />
        </Route>

        {/* Reading gets the whole screen and no moving scenery */}
        <Route path="/blog/:id" element={<div className="full-page"><BlogPostPage posts={posts} /></div>} />
        <Route path="/climbs/:id" element={<div className="full-page"><ClimbDetail /></div>} />
        <Route path="/admin" element={<div className="full-page"><Admin onPostsChange={refreshPosts} /></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
