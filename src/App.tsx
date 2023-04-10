import axios from 'axios'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import Blog from './pages/Blog/Blog'
import BlogPostPage from './pages/BlogPost/BlogPostPage'
import Contact from './pages/Contact/Contact'
import HomePage from './pages/HomePage/HomePage'
import Projects from './pages/Projects/Projects'
import Skills from './pages/Skills/Skills'
import getBlogPosts from './services/getBlog'
import getPageInfo from './services/getPageInfo'
import getProjects from './services/getProjects'
import getSkills from './services/getSkills'
import getSocials from './services/getSocials'
import { getNowPlaying, SpotifyData } from './services/spotify'
import { BlogPost, PageInfo, Project, Skill, Social } from './typings'

function App() {
  const [nowPlaying, setNowPlaying] = useState<SpotifyData | null>(null);

  const [posts, setPosts] = useState<BlogPost[]>()
  const [projects, setProjects] = useState<Project[]>()
  const [skills, setSkills] = useState<Skill[]>()
  const [pageInfo, setPageInfo] = useState<PageInfo[]>()
  const [socials, setSocials] = useState<Social[]>()
  
  useEffect(() => {
    getBlogPosts().then((data: any) => setPosts(data.posts));
    getProjects().then((data: any) => setProjects(data.projects));
    getSkills().then((data: any) => setSkills(data.skills));
    getPageInfo().then((data: any) => setPageInfo(data));
    getSocials().then((data: any) => setSocials(data));
  }, []);

  
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await getNowPlaying();
      setNowPlaying(data);
    }, 5000);
          
    return () => clearInterval(intervalId);

  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage nowPlaying={nowPlaying} />} />
          <Route path='/projects' element={<Projects projects={projects} />} />
          <Route path='/skills' element={<Skills skills={skills} />} />
          <Route path='/blog' element={<Blog posts={posts}/>} />
          <Route path='/blog/:id' element={<BlogPostPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App  
