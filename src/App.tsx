/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  LogIn,
  LogOut,
  Settings,
  Cpu
} from "lucide-react";
import { cn, formatDate } from "./lib/utils";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from "firebase/auth";
import myPhoto from "./my photo.jpeg";

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  order: number;
}

interface Certificate {
  id: string;
  title: string;
  provider: string;
  issueDate?: string;
  imageUrl?: string;
}

interface GuestMessage {
  id: string;
  userName: string;
  message: string;
  timestamp: any;
}

interface SiteSettings {
  name: string;
  title: string;
  bio: string;
  profileImageUrl: string;
  email: string;
  phone: string;
  location: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Gokul Krisnan P",
  title: "Digital Marketer & MBA Scholar",
  bio: "A detail-oriented and proactive individual seeking an opportunity to apply Technical skills in problem-solving and strong Softskills to contribute to the organization's growth.",
  profileImageUrl: myPhoto,
  email: "gokulkrisnan06@gmail.com",
  phone: "+91 8667576957",
  location: "Salem, TamilNadu",
};

// --- Components ---

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fdfdfd]/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter italic">
          Gokul Krisnan <span className="text-teal-500">.</span>
        </Link>

        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {["Home", "Works", "Experience", "Guestbook"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#141414] transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="md:hidden text-[#141414]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white p-6 flex flex-col gap-4 border-b border-gray-100"
        >
           {["Home", "Works", "Experience", "Guestbook"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest">
                {item}
              </a>
            ))}
        </motion.div>
      )}
    </nav>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// --- Main Pages ---

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("order")), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));

    const unsubMessages = onSnapshot(query(collection(db, "guestbook"), orderBy("timestamp", "desc")), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as GuestMessage)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'guestbook'));

    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    });

    return () => { unsubProjects(); unsubMessages(); unsubSettings(); };
  }, []);

  return (
    <div className="bg-[#fdfdfd] text-[#141414] selection:bg-teal-100">
      <Nav />
      
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1 className="text-7xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8">
              Hey There,<br />I'm {settings.name.split(' ')[0]}
            </h1>
            <p className="text-lg text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
              I design beautifully simple experiences, and I love what I do.
            </p>
            <div className="flex flex-col gap-4">
              <div className="text-teal-600 font-bold tracking-tight">{settings.email}</div>
              <div className="flex gap-4 items-center">
                <div className="text-5xl font-display font-bold">2</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-300 leading-tight">
                  CURRENT<br />QUALIFICATIONS
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image with Brushstroke */}
          <div className="relative order-first md:order-last">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-teal-600/20 fill-current rotate-12 scale-125">
                <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,89.9,-16.3,88.5,-0.8C87.1,14.7,81.8,29.4,73.1,41.4C64.4,53.4,52.3,62.7,39.1,69.5C25.9,76.3,11.5,80.6,-2.8,85.5C-17.1,90.4,-31.2,95.9,-44.6,90.9C-57.9,85.9,-70.6,70.5,-78.4,54.2C-86.2,37.9,-89.1,20.7,-88.4,4.1C-87.7,-12.5,-83.4,-28.4,-74.6,-42.2C-65.8,-56.1,-52.5,-67.9,-38.3,-75C-24.1,-82.1,-9,-84.5,4.3,-91.9C17.6,-99.3,30.6,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden bg-brand-yellow rounded-b-[4rem] md:rounded-b-[6rem] shadow-2xl"
            >
              <img 
                src={settings.profileImageUrl} 
                alt={settings.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 md:right-0 bg-white p-6 shadow-xl rounded-2xl hidden md:block border border-gray-100">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                   <Briefcase size={24} />
                 </div>
                 <div>
                   <div className="text-lg font-bold tracking-tight uppercase">Digital Marketer</div>
                   <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">MBA Student</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="bg-white p-8 border border-gray-100 rounded-3xl flex items-center gap-8 group hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Settings size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Digital Marketer</h3>
                <p className="text-sm text-gray-400">SEO & Social Media</p>
              </div>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-3xl flex items-center gap-8 group hover:shadow-lg transition-all translate-x-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Github size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Tech Solutions</h3>
                <p className="text-sm text-gray-400">WordPress & Development</p>
              </div>
            </div>
          </div>

          <div>
             <h2 className="text-5xl font-display font-bold mb-8 leading-tight">What do I help?</h2>
             <p className="text-gray-500 leading-relaxed mb-10 max-w-md font-medium">
               {settings.bio}
             </p>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-32 px-6 bg-[#fafafa]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-5xl font-display font-bold mb-4">Work Experience</h2>
               <p className="text-gray-400">Charting my professional growth</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-12 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
               {[
                 { year: "2025 - 2025", title: "HR Intern", company: "RND Private Limited", desc: "Conducted initial candidate screening and maintained employee records." },
                 { year: "2025 - 2027", title: "MBA Scholar", company: "Firebird FIRM", desc: "Pursuing Master of Business Administration to bridge tech and management." },
                 { year: "2021 - 2024", title: "BCA Graduate", company: "Mahendra College", desc: "Foundation in computer applications and technical problem-solving." }
               ].map((item, idx) => (
                 <div key={idx} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#fafafa] bg-teal-500 shadow-sm" />
                    <div className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-widest">{item.year}</div>
                    <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm font-bold text-gray-300 mb-3">{item.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Latest Works */}
      <section id="works" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-5xl font-display font-bold mb-4">Latest Works</h2>
              <p className="text-gray-400">Perfect solution for digital experience</p>
            </div>
            <a href="#" className="hidden md:block text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-600 pb-1">Explore More Works</a>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-8 relative border border-gray-100 flex items-center justify-center p-8">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center text-gray-200">
                       <Cpu size={80} className="mb-6 opacity-20" />
                       <div className="text-sm font-bold uppercase tracking-widest opacity-20">No Image</div>
                    </div>
                  )}
                  <div className="absolute inset-x-8 bottom-8">
                     <div className="px-4 py-2 bg-teal-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-3">
                       Project {idx + 1}
                     </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300 font-medium">
                No projects found. Add some in the Admin Panel!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Guestbook Hub */}
      <section id="guestbook" className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-8 leading-tight">Digital Connections</h2>
          <p className="text-gray-400 mb-10 leading-relaxed font-medium mx-auto max-w-lg">
            Leave a message for the gallery. Let's start a conversation about Digital Marketing, Tech, or MBA life.
          </p>
          <div className="max-w-3xl mx-auto">
            <GuestbookForm />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="p-10 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl transition-all relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold">
                    {msg.userName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">@{msg.userName}</div>
                    <div className="text-[10px] text-gray-300 uppercase font-bold tracking-widest">
                       {msg.timestamp?.toDate ? formatDate(msg.timestamp.toDate()) : "Recent"}
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm italic">"{msg.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
           <h2 className="text-6xl md:text-8xl font-display font-bold leading-[0.8] tracking-tighter mb-12">
             Let's make something<br />amazing together.
           </h2>
           <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href={`mailto:${settings.email}`} className="text-2xl font-bold underline underline-offset-8 decoration-teal-500 hover:text-teal-600 transition-colors">
                Start by saying hi
              </a>
              <div className="hidden md:block w-px h-10 bg-gray-200" />
              <div className="flex gap-6">
                 <Linkedin className="text-gray-300 hover:text-teal-600 cursor-pointer transition-colors" />
                 <Github className="text-gray-300 hover:text-teal-600 cursor-pointer transition-colors" />
              </div>
           </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 {settings.name}
          </div>
          <div className="flex gap-10 text-[10px] uppercase font-extrabold tracking-widest text-gray-200">
             <a href="#" className="hover:text-teal-500">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GuestbookForm() {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !message) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        userName,
        message,
        timestamp: serverTimestamp()
      });
      setUserName("");
      setMessage("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'guestbook');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Your Name" 
        value={userName} 
        onChange={e => setUserName(e.target.value)}
        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-colors shadow-sm"
      />
      <textarea 
        placeholder="Your message..." 
        rows={4}
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-colors resize-none shadow-sm"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#141414] text-white font-bold py-5 rounded-2xl hover:bg-teal-600 transition-colors disabled:opacity-50 tracking-widest text-xs uppercase"
      >
        {loading ? "Sending..." : "Start by saying hi"}
      </button>
    </form>
  );
}

// --- Admin Section ---

function Admin() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-3xl text-center"
        >
          <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-teal-500/20">
            <LogIn size={40} className="text-black" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Admin Access</h2>
          <p className="text-white/40 mb-10">Sign in with your authorized Google account to manage your portfolio.</p>
          <button 
            onClick={login}
            className="w-full bg-[#EA4335] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#d33426] transition-colors shadow-lg shadow-red-500/20"
          >
            <Mail size={20} />
            Login with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const isAdmin = user.email === 'krishnan989756@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-white/40 mb-8">Unauthorized account: {user.email}</p>
          <button onClick={logout} className="text-white underline">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
          <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-white">
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
          {["projects", "certificates", "settings", "messages"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-teal-500 text-black" : "bg-white/5 text-white/40 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {activeTab === 'projects' && <AdminProjects />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'messages' && <AdminMessages />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    return onSnapshot(query(collection(db, "projects"), orderBy("order")), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
  }, []);

  const save = async () => {
    if (!editing?.title) return;
    try {
      if (editing.id) {
        await updateDoc(doc(db, "projects", editing.id), editing);
      } else {
        await addDoc(collection(db, "projects"), { ...editing, order: projects.length });
      }
      setEditing(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'projects'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await deleteDoc(doc(db, "projects", id)); } 
    catch (err) { handleFirestoreError(err, OperationType.DELETE, 'projects'); }
  };

  return (
    <div className="space-y-8">
      <button 
        onClick={() => setEditing({ title: "", description: "", order: projects.length })}
        className="w-full p-8 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-teal-500 transition-all"
      >
        <Plus /> Add New Project
      </button>

      {editing && (
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
          <input 
            placeholder="Title" 
            className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-teal-500"
            value={editing.title}
            onChange={e => setEditing({...editing, title: e.target.value})}
          />
          <textarea 
            placeholder="Description" 
            className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-teal-500"
            value={editing.description}
            onChange={e => setEditing({...editing, description: e.target.value})}
          />
          <div className="flex gap-4">
            <button onClick={save} className="flex-1 bg-teal-500 text-black font-bold py-4 rounded-xl">Save Project</button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-white/5 font-bold py-4 rounded-xl">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p.id} className="p-6 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
             <div>
               <h4 className="font-bold">{p.title}</h4>
               <p className="text-xs text-white/20">{p.description.slice(0, 50)}...</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setEditing(p)} className="p-2 text-white/40 hover:text-teal-500"><Edit size={16} /></button>
               <button onClick={() => remove(p.id)} className="p-2 text-white/40 hover:text-red-500"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "global")).then(snap => {
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "global"), settings);
      alert('Settings saved!');
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'settings/global'); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {Object.entries(settings).map(([key, val]) => (
        <div key={key}>
          <label className="text-xs font-bold uppercase tracking-widest text-white/20 mb-2 block">{key}</label>
          {key === 'bio' ? (
             <textarea 
               value={val} 
               onChange={e => setSettings({...settings, [key]: e.target.value})}
               className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-teal-500 h-32"
             />
          ) : (
             <input 
               value={val} 
               onChange={e => setSettings({...settings, [key]: e.target.value})}
               className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-teal-500"
             />
          )}
        </div>
      ))}
      <button 
        onClick={save} 
        disabled={loading}
        className="w-full bg-teal-500 text-black font-bold py-4 rounded-xl hover:bg-teal-400 transition-colors"
      >
        {loading ? "Saving..." : "Save Global Settings"}
      </button>
    </div>
  );
}

function AdminMessages() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);

  useEffect(() => {
    return onSnapshot(query(collection(db, "guestbook"), orderBy("timestamp", "desc")), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as GuestMessage)));
    });
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Remove this message?')) return;
    await deleteDoc(doc(db, "guestbook", id));
  };

  return (
    <div className="space-y-4">
      {messages.map(m => (
        <div key={m.id} className="p-6 bg-white/5 rounded-2xl flex justify-between items-start border border-white/5">
          <div>
            <div className="text-teal-500 font-bold mb-2">@{m.userName}</div>
            <p className="text-white/60 text-sm">{m.message}</p>
          </div>
          <button onClick={() => remove(m.id)} className="text-white/20 hover:text-red-500"><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
}

// --- App Entry ---

function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'krishnan989756@gmail.com') {
        if (location.pathname === '/') {
          navigate('/admin');
        }
      } else if (!user && location.pathname === '/admin') {
        // Stay on admin to show login UI or redirect to home? 
        // User wants "/admin" to redirect to login if not authenticated.
        // Currently /admin SHOWS the login UI, which is effectively a login page.
      } else if (!user && location.pathname === '/') {
        // User said: "If not authenticated, redirect to the login page."
        // This implies the home page is now behind a login?
        // Or did they mean when accessing /admin? 
        // "Configure the application to redirect to the /admin page when the root URL is accessed, 
        // if the user is already authenticated. If not authenticated, redirect to the login page."
        // This suggests they want to force login altogether.
        navigate('/admin');
      }
    });
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <AuthRedirect />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
