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
  Cpu,
  Scissors
} from "lucide-react";
import Cropper, { Area, Point } from "react-easy-crop";
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

interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  order: number;
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
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    });
    return () => unsubSettings();
  }, []);

  useEffect(() => {
    if (isAdminPage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-5% 0px -90% 0px', // focused strip near top
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = ['home', 'experience', 'works', 'certificates', 'guestbook'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdminPage]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // adjust for nav height
        behavior: "smooth"
      });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  if (isAdminPage) {
    return (
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <motion.nav 
          layout
          className="bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-200/50 pointer-events-auto border border-gray-100 rounded-full px-6 py-2 flex items-center gap-6"
        >
          <Link to="/" className="text-xs font-display font-bold tracking-tight italic text-teal-600">
            Admin Mode<span className="text-[#141414]">.</span>
          </Link>
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-[#141414] px-4 py-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-all font-bold">
            Live Site
          </Link>
        </motion.nav>
      </div>
    );
  }

  const menuItems = ["Home", "Experience", "Works", "Certificates", "Guestbook"];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-white h-16 flex items-center justify-between px-6">
        <div className="text-2xl font-display font-bold tracking-tight">
          {settings.name.split(' ')[0][0]}. {settings.name.split(' ').slice(-2, -1)}
          <span className="text-teal-500">.</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-end text-[#141414]"
        >
          {isMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Desktop Island Nav */}
      <div className="hidden md:flex fixed top-6 left-0 right-0 z-[100] justify-center px-4 pointer-events-none">
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto border border-gray-100 rounded-full p-1.5 flex items-center gap-1"
        >
          {menuItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={(e) => scrollToSection(e, item.toLowerCase())}
              className={cn(
                "relative text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-300",
                activeSection === item.toLowerCase() 
                  ? "text-white" 
                  : "text-gray-400 hover:text-[#141414]"
              )}
            >
              <span className="relative z-10">{item}</span>
              {activeSection === item.toLowerCase() && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-teal-500 rounded-full shadow-lg shadow-teal-100/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </a>
          ))}
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[90] bg-white pt-32 px-10 flex flex-col items-start gap-8"
          >
             <div className="flex flex-col gap-8 w-full">
               {menuItems.map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, item.toLowerCase())}
                  className={cn(
                    "relative text-xl font-display font-medium uppercase tracking-[0.4em] transition-all",
                    activeSection === item.toLowerCase() 
                      ? "text-[#141414]" 
                      : "text-gray-300"
                  )}
                >
                  {item}
                </a>
              ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

// --- Helper Components ---

/**
 * Utility to create a cropped image from canvas
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box for rotated image
  const { width: bBoxW, height: bBoxH } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  // Set canvas size to match the bounding box
  canvas.width = bBoxW;
  canvas.height = bBoxH;

  // Translate to center, rotate, then flip
  ctx.translate(bBoxW / 2, bBoxH / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw the image
  ctx.drawImage(image, 0, 0);

  // Extract the cropped portion
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Reset canvas for the final cropped image
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Put the cropped image onto the reset canvas
  ctx.putImageData(data, 0, 0);

  // Return as a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject(new Error('Canvas is empty'));
    }, 'image/jpeg');
  });
};

function FileUpload({ onUpload, currentUrl, label }: { onUpload: (url: string) => void, currentUrl?: string, label: string }) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const isConfigured = !!(cloudName && uploadPreset);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type && !file.type.startsWith('image/')) {
      alert("The selected file doesn't seem to be an image. Please try a different photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setUploading(true);
    const originalImage = imageToCrop;
    setImageToCrop(null); // Close cropper UI
    
    try {
      const croppedBlob = await getCroppedImg(originalImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });

      // Proceed with upload
      if (!isConfigured) {
        if (croppedFile.size > 800 * 1024) {
          alert("Cropped image exceeds 800KB. Try a smaller crop or configure Cloudinary.");
          setUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          onUpload(reader.result as string);
          setUploading(false);
        };
        reader.readAsDataURL(croppedFile);
        return;
      }

      const formData = new FormData();
      formData.append('file', croppedFile);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
      }

      const data = await response.json();
      onUpload(data.secure_url);
    } catch (error: any) {
      console.error("Cropping/Upload error:", error);
      alert(`Operation failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cropper Modal Overlay */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-10"
          >
            <div className="relative w-full max-w-4xl aspect-square sm:aspect-video bg-[#141414] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1} // Assuming 1:1 for now, but can be configured
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setImageToCrop(null)}
                  className="flex-1 px-8 py-4 bg-gray-800 text-gray-400 font-bold rounded-2xl hover:bg-gray-700 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmCrop}
                  className="flex-1 px-8 py-4 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
        <button 
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold text-teal-600 uppercase tracking-tight hover:opacity-70 transition-opacity"
        >
          {showUrlInput ? "Use File Upload" : "Enter External URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-2">
          <input 
            placeholder="https://example.com/image.jpg" 
            className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-teal-500 transition-all shadow-sm text-xs"
            value={currentUrl || ""}
            onChange={e => onUpload(e.target.value)}
          />
          {currentUrl && (
            <div className="flex items-center gap-3 p-3 bg-teal-50/30 rounded-xl border border-teal-100/50">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-sm shrink-0">
                <img src={currentUrl} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] text-teal-700 font-medium truncate flex-1">URL active and previewed</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-4">
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={cn(
                "w-16 h-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shrink-0",
                uploading && "opacity-50 cursor-wait",
                !isConfigured ? "hover:border-blue-400 hover:bg-blue-50" : "hover:border-teal-500 hover:bg-teal-50"
              )}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Scissors size={16} className={cn(!isConfigured ? "text-blue-400" : "text-teal-500")} />
              )}
              <span className="text-[7px] font-bold uppercase text-gray-400">{uploading ? "..." : "Crop"}</span>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />

            <div className="flex-1 min-w-0">
              {currentUrl ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm shrink-0">
                    <img src={currentUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-[#141414] truncate uppercase tracking-widest">Artwork Ready</p>
                    <p className="text-[8px] text-gray-300 truncate font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{currentUrl}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Artwork</p>
                  <p className="text-[8px] text-gray-300 leading-tight">
                    {!isConfigured 
                      ? "Direct upload enabled (max 800KB)" 
                      : "Cloudinary upload active"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Pages ---

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const p = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      setProjects(p.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));

    const unsubCerts = onSnapshot(collection(db, "certificates"), (snap) => {
      const c = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
      // Sort by issueDate desc if it exists, otherwise use id as fallback
      setCertificates(c.sort((a, b) => (b.issueDate || "").localeCompare(a.issueDate || "")));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'));

    const unsubExp = onSnapshot(collection(db, "experiences"), (snap) => {
      const e = snap.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
      setExperiences(e.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'experiences'));

    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    });

    return () => { unsubProjects(); unsubCerts(); unsubExp(); unsubSettings(); };
  }, []);

  return (
    <div className="bg-[#fdfdfd] text-[#141414] selection:bg-teal-100">
      <Nav />
      
      <div id="home" className="scroll-mt-32">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 overflow-hidden relative">
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
                Crafting data-driven digital strategies,<br />
                to amplify brand visibility and growth,<br />
                with a passion for results and creativity.
              </p>
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
              <div className="absolute -bottom-4 right-0 sm:-bottom-6 sm:-right-6 md:right-0 bg-white p-4 sm:p-6 shadow-xl rounded-2xl border border-gray-100">
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
      </div>

      {/* Experience Timeline */}
      <section id="experience" className="py-32 px-6 bg-[#fafafa] scroll-mt-32">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-5xl font-display font-bold mb-4">Work Experience</h2>
               <p className="text-gray-400">Charting my professional growth</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-12 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
               {experiences.map((item) => (
                 <div key={item.id} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#fafafa] bg-teal-500 shadow-sm" />
                    <div className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-widest">{item.year}</div>
                    <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm font-bold text-gray-300 mb-3">{item.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{item.description}</p>
                 </div>
               ))}
               {experiences.length === 0 && (
                 <div className="text-center py-10 text-gray-300 font-medium italic">
                    Career timeline is being updated...
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* Latest Works Carousel */}
      <section id="works" className="py-32 px-6 bg-white overflow-hidden scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-display font-bold mb-4">Latest Works</h2>
              <p className="text-gray-400">Perfect solution for digital experience</p>
            </div>
            
            <div className="flex gap-4">
               <button 
                onClick={() => setCurrentProjectIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1))}
                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm"
               >
                 <ChevronRight size={20} className="rotate-180" />
               </button>
               <button 
                onClick={() => setCurrentProjectIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1))}
                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm"
               >
                 <ChevronRight size={20} />
               </button>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {projects.length > 0 ? (
                <motion.div 
                  key={projects[currentProjectIndex].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="aspect-[4/5] sm:aspect-video lg:aspect-square bg-gray-50 rounded-[4rem] overflow-hidden relative border border-gray-100 shadow-2xl p-6 sm:p-12">
                     <div className="absolute top-8 left-8 z-10">
                        <div className="px-4 py-2 bg-teal-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest inline-block shadow-lg">
                          Project {currentProjectIndex + 1} of {projects.length}
                        </div>
                     </div>
                    {projects[currentProjectIndex].imageUrl ? (
                      <img src={projects[currentProjectIndex].imageUrl} alt={projects[currentProjectIndex].title} className="w-full h-full object-cover rounded-3xl" />
                    ) : (
                      <div className="w-full h-full bg-white rounded-3xl flex flex-col items-center justify-center text-gray-200">
                         <Cpu size={80} className="mb-6 opacity-20" />
                         <div className="text-sm font-bold uppercase tracking-widest opacity-20">No Image Preview</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl sm:text-6xl font-display font-bold mb-6 italic tracking-tight">{projects[currentProjectIndex].title}</h3>
                      <p className="text-gray-500 text-lg leading-relaxed font-medium">{projects[currentProjectIndex].description}</p>
                    </div>
                    {projects[currentProjectIndex].techStack && (
                      <div className="flex flex-wrap gap-2">
                        {projects[currentProjectIndex].techStack.map(tech => (
                          <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="pt-6">
                      <a 
                        href={projects[currentProjectIndex].liveUrl || "#"} 
                        target="_blank" 
                        rel="referrer"
                        className="inline-flex items-center gap-3 bg-[#141414] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-teal-600 transition-all shadow-xl shadow-gray-200"
                      >
                        Launch Project <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300 font-medium h-[400px] flex items-center justify-center">
                  No projects found. Add some in the Admin Panel!
                </div>
              )}
            </AnimatePresence>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-16">
              {projects.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentProjectIndex(i)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === currentProjectIndex ? "w-8 bg-teal-500" : "w-2 bg-gray-100 hover:bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Carousel */}
      <section id="certificates" className="py-32 px-6 bg-[#fafafa] scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-bold mb-4">Certifications</h2>
            <p className="text-gray-400 font-medium">Validating my expertise through global standards</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
             <AnimatePresence mode="wait">
              {certificates.length > 0 ? (
                <motion.div 
                  key={certificates[currentCertIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 sm:p-12 rounded-[4rem] border border-gray-100 shadow-2xl flex flex-col items-center text-center relative"
                >
                  <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600 mb-8">
                     <Settings size={40} />
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <h3 className="text-3xl sm:text-4xl font-display font-bold leading-tight">{certificates[currentCertIndex].title}</h3>
                    <div className="text-teal-600 text-sm font-bold uppercase tracking-[0.3em]">{certificates[currentCertIndex].provider}</div>
                    <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">{certificates[currentCertIndex].issueDate || "Credential Active"}</div>
                  </div>

                  <div className="w-full aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group mb-10">
                    {certificates[currentCertIndex].imageUrl ? (
                      <img src={certificates[currentCertIndex].imageUrl} alt={certificates[currentCertIndex].title} className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <ExternalLink size={60} className="opacity-20" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setCurrentCertIndex(prev => (prev === 0 ? certificates.length - 1 : prev - 1))}
                      className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <button 
                      onClick={() => setCurrentCertIndex(prev => (prev === certificates.length - 1 ? 0 : prev + 1))}
                      className="p-4 rounded-2xl bg-[#141414] text-white hover:bg-teal-600 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="absolute top-12 right-12 text-[10px] font-bold text-gray-200 uppercase tracking-widest">
                    {currentCertIndex + 1} / {certificates.length}
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-[3rem] text-gray-300 font-medium italic">
                  Certificates are being digitized. Please check back soon!
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Guestbook Hub */}
      <section id="guestbook" className="py-32 px-6 bg-[#fafafa] scroll-mt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-display font-bold mb-8 leading-tight">Digital Connections</h2>
          <p className="text-gray-400 mb-10 leading-relaxed font-medium mx-auto max-w-lg">
            Leave a message for the gallery. Let's start a conversation about Digital Marketing, Tech, or MBA life.
          </p>
          <div className="max-w-3xl mx-auto">
            <GuestbookForm />
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  const loginWithPopup = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      console.error("Login popup error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup was blocked by your browser. Please allow popups to sign in.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("Domain not authorized. Copy the URL from your browser address bar and add it to 'Authorized Domains' in your Firebase Console (Authentication > Settings).");
      } else {
        setError(err.message || "Failed to sign in.");
      }
    }
  };

  const logout = () => signOut(auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-gray-100 p-12 rounded-[2.5rem] text-center shadow-2xl shadow-gray-200"
        >
          <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-teal-100">
            <LogIn size={40} className="text-teal-500" />
          </div>
          <h2 className="text-4xl font-display font-bold text-[#141414] mb-4 italic tracking-tighter">Admin Portal</h2>
          <p className="text-gray-400 font-medium mb-10 leading-relaxed">Secure access to the professional portfolio management system.</p>
          
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold leading-relaxed shadow-sm">
              <span className="block uppercase tracking-widest mb-1 text-[10px] opacity-60">Authentication Error</span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={loginWithPopup}
              className="w-full bg-[#141414] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-teal-600 transition-all shadow-xl shadow-gray-200 group"
            >
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Mail size={18} />
              </div>
              Authorize with Google
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-6">
            <div className="w-10 h-0.5 bg-gray-100 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-200">Protected</span>
            <div className="w-10 h-0.5 bg-gray-100 rounded-full" />
          </div>
        </motion.div>
      </div>
    );
  }

  const isAdmin = user.email === 'krishnan989756@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-12 rounded-[2rem] text-center shadow-xl shadow-gray-200"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100">
             <LogOut size={24} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#141414] mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">
            Account <span className="text-[#141414] font-bold">{user.email}</span> is not authorized.
          </p>
          <button 
            onClick={logout} 
            className="w-full bg-gray-50 text-gray-400 font-bold py-4 rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest text-[10px]"
          >
            Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#141414] selection:bg-teal-100">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight italic">Admin</h1>
            <p className="text-gray-400 text-xs font-medium mt-1">Manage your professional hub</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>

        <div className="sticky top-[72px] z-20 bg-[#FAFAFA]/80 backdrop-blur-md py-2 mb-8 -mx-4 px-4 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-right">
            {["projects", "certificates", "experience", "settings", "messages", "setup"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                  activeTab === tab 
                    ? "bg-[#141414] text-white border-[#141414] shadow-lg shadow-gray-200" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white border border-gray-100 p-5 sm:p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden"
          >
            {activeTab === 'projects' && <AdminProjects />}
            {activeTab === 'certificates' && <AdminCertificates />}
            {activeTab === 'experience' && <AdminExperience />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'setup' && <AdminSetup />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminSetup() {
  const [openSection, setOpenSection] = useState<'rules' | 'photo' | null>(null);

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-2xl font-display font-bold mb-2 italic tracking-tight">Setup Assistant</h2>
        <p className="text-gray-400 text-xs leading-relaxed font-medium">Configure your portfolio backend connections.</p>
      </div>

      <div className="space-y-3">
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setOpenSection(openSection === 'rules' ? null : 'rules')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                <Settings size={16} />
              </div>
              <h3 className="text-sm font-bold">1. Fix "Permission Denied"</h3>
            </div>
            <Plus size={16} className={cn("text-gray-300 transition-transform", openSection === 'rules' && "rotate-45")} />
          </button>
          
          {openSection === 'rules' && (
            <div className="p-4 bg-white border-t border-gray-100 space-y-3">
              <p className="text-[10px] text-gray-500 leading-relaxed">Paste these rules in <b>Firebase Console &gt; Firestore &gt; Rules</b>.</p>
              <div className="bg-[#141414] p-3 rounded-xl relative group">
                <pre className="text-[8px] text-teal-400 font-mono overflow-x-auto max-h-48 no-scrollbar leading-tight">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'krishnan989756@gmail.com';
    }
    match /{document=**} { allow read, write: if false; }
    match /projects/{id} { allow read: if true; allow write: if isAdmin(); }
    match /certificates/{id} { allow read: if true; allow write: if isAdmin(); }
    match /experiences/{id} { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id} { allow read: if true; allow write: if isAdmin(); }
    match /guestbook/{id} { 
      allow read: if isAdmin();
      allow create: if request.resource.data.userName is string;
    }
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setOpenSection(openSection === 'photo' ? null : 'photo')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                <Plus size={16} />
              </div>
              <h3 className="text-sm font-bold">2. Enable Photo Uploads</h3>
            </div>
            <Plus size={16} className={cn("text-gray-300 transition-transform", openSection === 'photo' && "rotate-45")} />
          </button>
          
          {openSection === 'photo' && (
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="space-y-3">
                <p className="text-[10px] text-gray-500 leading-relaxed">Cloudinary setup for image hosting:</p>
                <ol className="text-[10px] text-gray-500 list-decimal pl-4 space-y-2">
                  <li>Create account at <a href="https://cloudinary.com" target="_blank" className="text-teal-600 underline">cloudinary.com</a></li>
                  <li>Find your <b>Cloud Name</b> and <b>Unsigned Upload Preset</b></li>
                  <li>In this editor: <b>Settings &gt; Environment</b></li>
                  <li>Add <code>VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code></li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [editing, setEditing] = useState<Partial<Certificate> | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, "certificates"), (snap) => {
      const c = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
      setCerts(c.sort((a, b) => (b.issueDate || "").localeCompare(a.issueDate || "")));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'));
  }, []);

  const save = async () => {
    if (!editing?.title || !editing?.provider) return;
    try {
      if (editing.id) {
        await updateDoc(doc(db, "certificates", editing.id), editing);
      } else {
        await addDoc(collection(db, "certificates"), { ...editing, createdAt: serverTimestamp() });
      }
      setEditing(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'certificates'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await deleteDoc(doc(db, "certificates", id)); } 
    catch (err) { handleFirestoreError(err, OperationType.DELETE, 'certificates'); }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setEditing({ title: "", provider: "", issueDate: "", imageUrl: "" })}
        className="w-full py-6 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-teal-500 hover:border-teal-100 transition-all group"
      >
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-teal-50">
          <Plus size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">New Certificate</span>
      </button>

      {editing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-gray-50/50 rounded-2xl space-y-5 border border-gray-100"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414] ml-1">Title</label>
              <input 
                placeholder="Certificate Title" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.title}
                onChange={e => setEditing({...editing, title: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414] ml-1">Provider</label>
              <input 
                placeholder="e.g. Google" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.provider}
                onChange={e => setEditing({...editing, provider: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414] ml-1">Date</label>
              <input 
                placeholder="May 2024" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.issueDate}
                onChange={e => setEditing({...editing, issueDate: e.target.value})}
              />
            </div>
            <FileUpload 
              label="Certificate Image" 
              currentUrl={editing.imageUrl} 
              onUpload={(url) => setEditing({...editing, imageUrl: url})} 
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button onClick={save} className="w-full bg-[#141414] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm text-sm">
              <Save size={16} /> Save Data
            </button>
            <button onClick={() => setEditing(null)} className="w-full bg-white text-gray-400 font-bold py-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-3">
        {certs.map(c => (
          <div key={c.id} className="p-4 bg-white rounded-2xl flex justify-between items-center border border-gray-100 group transition-all">
             <div className="flex items-center gap-3 min-w-0">
               <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-50 overflow-hidden shrink-0">
                 {c.imageUrl ? <img src={c.imageUrl} className="w-full h-full object-cover" /> : <Briefcase size={18} className="text-gray-200" />}
               </div>
               <div className="min-w-0 flex-1">
                 <h4 className="font-bold text-sm text-[#141414] truncate">{c.title}</h4>
                 <p className="text-[10px] text-teal-600 uppercase font-bold tracking-widest mt-0.5 truncate">{c.provider}</p>
               </div>
             </div>
             <div className="flex gap-1.5 shrink-0 ml-3">
               <button onClick={() => setEditing(c)} className="p-2.5 text-gray-300 hover:text-[#141414] hover:bg-gray-50 rounded-lg transition-all"><Edit size={14} /></button>
               <button onClick={() => remove(c.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, "projects"), (snap) => {
      const p = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      setProjects(p.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));
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
    <div className="space-y-6">
      <button 
        onClick={() => setEditing({ title: "", description: "", order: projects.length, imageUrl: "", liveUrl: "", githubUrl: "", techStack: [] })}
        className="w-full py-6 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#141414] hover:border-gray-300 transition-all group"
      >
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100">
          <Plus size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">New Project</span>
      </button>

      {editing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-gray-50/50 rounded-2xl space-y-6 border border-gray-100 shadow-sm"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Essentials</label>
              <div className="space-y-3">
                <input 
                  placeholder="Project Headline" 
                  className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                  value={editing.title}
                  onChange={e => setEditing({...editing, title: e.target.value})}
                />
                <textarea 
                  placeholder="The story behind this work..." 
                  rows={4}
                  className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm resize-none shadow-sm"
                  value={editing.description}
                  onChange={e => setEditing({...editing, description: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Assets & Links</label>
              <div className="space-y-4">
                <FileUpload 
                  label="Hero Image" 
                  currentUrl={editing.imageUrl} 
                  onUpload={(url) => setEditing({...editing, imageUrl: url})} 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    placeholder="Live URL" 
                    className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-xs shadow-sm"
                    value={editing.liveUrl || ""}
                    onChange={e => setEditing({...editing, liveUrl: e.target.value})}
                  />
                  <input 
                    placeholder="GitHub Repo" 
                    className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-xs shadow-sm"
                    value={editing.githubUrl || ""}
                    onChange={e => setEditing({...editing, githubUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
            <button onClick={save} className="flex-1 bg-[#141414] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
              <Save size={16} /> Update Project
            </button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-white text-gray-400 font-bold py-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-sm">Dismiss</button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p.id} className="p-4 bg-white rounded-2xl flex justify-between items-center border border-gray-100 group transition-all">
             <div className="flex items-center gap-4 min-w-0">
               <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-50 shrink-0">
                 {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <Cpu size={24} className="text-gray-200" />}
               </div>
               <div className="min-w-0 flex-1">
                 <h4 className="font-bold text-base text-[#141414] truncate">{p.title}</h4>
                 <div className="flex items-center gap-2">
                   <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Prio: {p.order}</span>
                 </div>
               </div>
             </div>
             <div className="flex flex-col gap-1.5 shrink-0 ml-4">
               <button onClick={() => setEditing(p)} className="p-2.5 text-gray-300 hover:text-[#141414] hover:bg-gray-50 rounded-lg transition-all"><Edit size={14} /></button>
               <button onClick={() => remove(p.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, "experiences"), (snap) => {
      const e = snap.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
      setExperiences(e.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'experiences'));
  }, []);

  const save = async () => {
    if (!editing?.title || !editing?.company) return;
    try {
      if (editing.id) {
        await updateDoc(doc(db, "experiences", editing.id), editing);
      } else {
        await addDoc(collection(db, "experiences"), { ...editing, order: experiences.length });
      }
      setEditing(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'experiences'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await deleteDoc(doc(db, "experiences", id)); } 
    catch (err) { handleFirestoreError(err, OperationType.DELETE, 'experiences'); }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setEditing({ title: "", company: "", year: "", description: "", order: experiences.length })}
        className="w-full py-6 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#141414] hover:border-gray-300 transition-all group"
      >
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100">
          <Plus size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">New Experience</span>
      </button>

      {editing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-gray-50/50 rounded-2xl space-y-5 border border-gray-100"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Role</label>
              <input 
                placeholder="Job Title" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.title}
                onChange={e => setEditing({...editing, title: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Org</label>
              <input 
                placeholder="Company Name" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.company}
                onChange={e => setEditing({...editing, company: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Time</label>
              <input 
                placeholder="2022 - Present" 
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                value={editing.year}
                onChange={e => setEditing({...editing, year: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea 
                placeholder="What did you achieve?" 
                rows={4}
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm resize-none shadow-sm"
                value={editing.description}
                onChange={e => setEditing({...editing, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100 mt-2">
            <button onClick={save} className="flex-1 bg-[#141414] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
              <Save size={16} /> Save Experience
            </button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-white text-gray-400 font-bold py-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {experiences.map(e => (
          <div key={e.id} className="p-5 bg-white rounded-2xl flex justify-between items-center border border-gray-100 group transition-all">
             <div className="min-w-0 flex-1">
               <h4 className="font-bold text-lg text-[#141414] truncate">{e.title}</h4>
               <p className="text-teal-600 text-[10px] font-bold uppercase tracking-[0.15em] mt-0.5 truncate">{e.company} • {e.year}</p>
             </div>
             <div className="flex gap-1.5 shrink-0 ml-4">
               <button onClick={() => setEditing(e)} className="p-2.5 text-gray-300 hover:text-[#141414] hover:bg-gray-50 rounded-lg transition-all"><Edit size={14} /></button>
               <button onClick={() => remove(e.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
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
    }).catch(err => handleFirestoreError(err, OperationType.GET, 'settings/global'));
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "global"), settings);
      alert('Portfolio core settings updated successfully!');
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'settings/global'); }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 border-b border-gray-50 pb-3">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h3 className="text-lg font-bold tracking-tight">Identity Details</h3>
          </div>
          <div className="grid gap-5">
            {['name', 'title', 'location', 'phone', 'email'].map(field => (
               <div key={field} className="space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{field}</label>
                 <input 
                   placeholder={field}
                   value={(settings as any)[field]} 
                   onChange={e => setSettings({...settings, [field]: e.target.value})}
                   className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm shadow-sm"
                 />
               </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 border-b border-gray-50 pb-3">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h3 className="text-lg font-bold tracking-tight">Bio & Visuals</h3>
          </div>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">About Me</label>
              <textarea 
                value={settings.bio} 
                onChange={e => setSettings({...settings, bio: e.target.value})}
                rows={6}
                className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 focus:border-[#141414] transition-all text-sm resize-none shadow-sm"
                placeholder="Brief professional intro..."
              />
            </div>
            <div className="space-y-4">
              <FileUpload 
                label="Profile Avatar" 
                currentUrl={settings.profileImageUrl} 
                onUpload={(url) => setSettings({...settings, profileImageUrl: url})} 
              />
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
                  <img src={settings.profileImageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Active photo <br/> circular preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-50">
        <button 
          onClick={save} 
          disabled={loading}
          className="w-full bg-[#141414] text-white font-bold py-5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
        >
          {loading ? "Saving Changes..." : <><Save size={18}/> Deploy Profile Updates</>}
        </button>
      </div>
    </div>
  );
}

function AdminMessages() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);

  useEffect(() => {
    return onSnapshot(query(collection(db, "guestbook"), orderBy("timestamp", "desc")), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as GuestMessage)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'guestbook'));
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Permanently remove this connection record?')) return;
    try {
      await deleteDoc(doc(db, "guestbook", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'guestbook');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {messages.map(m => (
          <div key={m.id} className="p-5 bg-white rounded-2xl flex justify-between items-start border border-gray-100 shadow-sm transition-all">
            <div className="space-y-2.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  {m.userName.charAt(0)}
                </div>
                <div className="text-[13px] font-bold text-[#141414] truncate">@{m.userName}</div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed break-words">{m.message}</p>
              {m.timestamp && (
                <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pt-1">
                  {m.timestamp.toDate ? formatDate(m.timestamp.toDate()) : "Recent"}
                </div>
              )}
            </div>
            <button onClick={() => remove(m.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-4 shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="py-16 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="text-gray-300 text-xs font-medium italic">Empty guestbook</div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- App Entry ---

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
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
