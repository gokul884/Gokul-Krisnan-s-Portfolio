/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Download, 
  Monitor, 
  Smartphone, 
  Briefcase, 
  Cpu, 
  MessageSquare,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import myPhoto from "./my photo.jpeg";

// Resume Data for Gokul Krisnan P
const DATA = {
  name: "Gokul Krisnan P",
  title: "HR Professional & MBA Scholar",
  phone: "+91 8667576957",
  email: "gokulkrisnan06@gmail.com",
  location: "Salem, TamilNadu",
  objective: "A detail-oriented and proactive individual seeking an opportunity to apply Technical skills in problem-solving and strong Softskills to contribute to the organization's growth, aim to continuously learn, collaborate effectively and deliver impactful results while advancing professional development.",
  experience: [
    {
      role: "HR Intern",
      company: "RND Private Limited",
      duration: "Sept 2025 - Nov 2025",
      tasks: [
        "Conducted initial candidate screening by reviewing resumes and shortlisting suitable applicants based on job requirements.",
        "Assisted in HR documentation processes, including maintaining employee records, organizing candidate files, and supporting recruitment documentation."
      ]
    }
  ],
  education: [
    {
      degree: "Master of Business Administration",
      status: "Pursuing",
      period: "2025-2027",
      institution: "Firebird Institution of Research in Management"
    },
    {
      degree: "Bachelor of Computer Application",
      institution: "Mahendra Arts and Science College"
    }
  ],
  technicalSkills: ["WordPress", "MS Office (Word, PowerPoint)", "Digital Marketing", "Mobile App Development"],
  softSkills: ["Time Management", "Adaptability", "Self-Motivation"],
  certifications: [
    { name: "Fundamentals of Digital Marketing", provider: "NPTEL", status: "Ongoing" },
    { name: "Mobile Application Development", provider: "FutoGen Academy" }
  ]
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#141414] font-sans selection:bg-teal-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdfdfd]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold italic tracking-tighter"
          >
            Gokul P.
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10 text-sm font-medium uppercase tracking-widest text-gray-500">
            {["Home", "Experience", "Skills", "Education"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="hover:text-teal-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Phone size={16} className="text-teal-600" />
            <span>{DATA.phone}</span>
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 ml-4">
              <Mail size={18} />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-4"
          >
            {["Home", "Experience", "Skills", "Education"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest hover:text-teal-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:grid md:grid-cols-2 items-center gap-12 relative">
          
          {/* Main Visual for Mobile (Image first) or Desktop (Image second) */}
          <div className="relative w-full order-1 md:order-2 overflow-visible">
            {/* Brushstroke effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-20 md:opacity-20 scale-125">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-teal-600 fill-current scale-150 rotate-12">
                <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,89.9,-16.3,88.5,-0.8C87.1,14.7,81.8,29.4,73.1,41.4C64.4,53.4,52.3,62.7,39.1,69.5C25.9,76.3,11.5,80.6,-2.8,85.5C-17.1,90.4,-31.2,95.9,-44.6,90.9C-57.9,85.9,-70.6,70.5,-78.4,54.2C-86.2,37.9,-89.1,20.7,-88.4,4.1C-87.7,-12.5,-83.4,-28.4,-74.6,-42.2C-65.8,-56.1,-52.5,-67.9,-38.3,-75C-24.1,-82.1,-9,-84.5,4.3,-91.9C17.6,-99.3,30.6,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] w-full max-w-sm md:max-w-md mx-auto overflow-hidden bg-gray-100 flex items-center justify-center border-b-8 border-teal-600 shadow-2xl"
            >
              <div className="absolute inset-0 bg-yellow-400 opacity-5 md:opacity-0"></div>
              <img 
                src={myPhoto} 
                alt="Gokul Krisnan P" 
                className="w-full h-full object-cover grayscale-[0.1]"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop";
                }}
                referrerPolicy="no-referrer"
              />
              
              {/* Heading overlay for Mobile - Bottom of Image */}
              <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/60 to-transparent md:hidden z-20">
                <h1 className="text-5xl font-bold leading-[0.9] tracking-tighter text-white drop-shadow-lg">
                  Hey There,<br />I'm Gokul
                </h1>
              </div>

              <div className="absolute bottom-6 right-6 bg-white p-4 shadow-xl text-center hidden md:block">
                <div className="text-xl font-bold tracking-tight text-[#141414]">HR INTERN</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Certified Professional</div>
              </div>
            </motion.div>
          </div>

          {/* Content Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full order-2 md:order-1 relative z-10"
          >
            {/* Heading for Desktop - Regular Flow */}
            <h1 className="hidden md:block text-8xl font-bold leading-[0.9] tracking-tighter mb-8 brightness-110 drop-shadow-sm">
              Hey There,<br />I'm Gokul
            </h1>

            {/* Paragraph follows heading */}
            <p className="text-lg text-gray-500 max-w-md mb-8 leading-relaxed font-medium">
              I'm a detail-oriented HR Professional and MBA Scholar focused on solving problems through technical skills and collaboration.
            </p>
            
            <div className="space-y-4">
              <div className="text-teal-600 font-bold text-lg">{DATA.email}</div>
              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold">2</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold leading-tight">
                    CURRENT<br />QUALIFICATIONS
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <Briefcase size={16} className="text-teal-600" />
                  TN, INDIA
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#fdfdfd] p-8 border border-gray-100 flex gap-6 items-center hover:shadow-lg transition-all cursor-default">
              <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center text-white shrink-0">
                <Monitor size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Web Management</h3>
                <p className="text-sm text-gray-400">WordPress & Digital Presence</p>
              </div>
            </div>
            <div className="bg-[#fdfdfd] p-8 border border-gray-100 flex gap-6 items-center hover:shadow-lg transition-all cursor-default translate-x-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white shrink-0">
                <Smartphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">App Development</h3>
                <p className="text-sm text-gray-400">Mobile Solutions (Ongoing)</p>
              </div>
            </div>
            <div className="bg-[#fdfdfd] p-8 border border-gray-100 flex gap-6 items-center hover:shadow-lg transition-all cursor-default">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white shrink-0">
                <Briefcase size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Human Resources</h3>
                <p className="text-sm text-gray-400">Management & Strategy</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-bold tracking-tight mb-8">What do I help?</h2>
            <p className="text-gray-500 leading-relaxed max-w-lg mb-10">
              {DATA.objective}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-10">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Skills Mastered</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2</div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Academic Degrees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Works Section */}
      <section id="works" className="py-24 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Latest Works</h2>
              <p className="text-gray-400 mt-2">Personal projects & certifications</p>
            </div>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-600 pb-1">Explore More Works</a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-orange-100 rounded-3xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2">
                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="mt-auto flex justify-between">
                       <div className="w-8 h-8 rounded-full bg-orange-200"></div>
                       <div className="w-8 h-8 rounded-full bg-orange-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold">App Development</h4>
              <p className="text-sm text-gray-400">Mobile Solution - FutoGen</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-teal-100 rounded-3xl overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2">
                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                    <div className="h-20 w-full bg-gray-50 rounded"></div>
                    <div className="mt-auto h-4 w-full bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold">Digital Marketing</h4>
              <p className="text-sm text-gray-400">Fundamentals - NPTEL</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-teal-900 rounded-3xl overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/20 flex flex-col gap-2">
                    <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                    <div className="h-4 w-full bg-white/20 rounded"></div>
                    <div className="mt-auto h-8 w-8 rounded-full bg-white/40 self-end"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold">WordPress Site</h4>
              <p className="text-sm text-gray-400">Personal Portfolio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">People talk about me</h2>
          <p className="text-gray-400 mb-16">Feedback from colleagues & mentors</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-[#fdfdfd] p-10 border border-gray-100 relative text-left">
                <div className="absolute -top-6 left-10 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white shrink-0">
                  <MessageSquare size={20} />
                </div>
                <p className="text-gray-500 italic mb-8 leading-relaxed">
                  "Gokul is extremely proactive and quick to grasp HR concepts. His technical background in BCA helps him streamline documentation tasks efficiently."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" alt="Mentor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-bold">Project Manager</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">RND Private Limited</div>
                  </div>
                </div>
             </div>

             <div className="bg-[#fdfdfd] p-10 border border-gray-100 relative text-left">
                <div className="absolute -top-6 left-10 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <MessageSquare size={20} />
                </div>
                <p className="text-gray-500 italic mb-8 leading-relaxed">
                  "A very detail-oriented individual. His adaptability during his internship was commendable, handling multiple records with ease."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" alt="Mentor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-bold">HR Lead</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">RND Private Limited</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Work Experience</h2>
              <p className="text-gray-400 mt-2">Professional journey & internships</p>
            </div>
          </div>

          <div className="space-y-12 max-w-2xl">
            {DATA.experience.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-12 border-l-2 border-dashed border-teal-600 pb-4"
              >
                <div className="absolute left-[-11px] top-0 w-5 h-5 bg-teal-600 rounded-full border-4 border-white shadow-sm"></div>
                <div className="mb-2 text-xs font-bold text-teal-600 bg-teal-50 inline-block px-3 py-1 rounded-full">{exp.duration}</div>
                <h3 className="text-2xl font-bold leading-tight">{exp.role}</h3>
                <p className="text-sm text-gray-400 font-medium mb-4">{exp.company}</p>
                <ul className="space-y-3">
                  {exp.tasks.map((task, tidx) => (
                    <li key={tidx} className="text-gray-500 text-sm leading-relaxed flex gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certs */}
      <section id="education" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-bold mb-12 tracking-tight">Education</h2>
            <div className="space-y-10">
              {DATA.education.map((edu, idx) => (
                <div key={idx} className="group">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-teal-600 transition-colors">
                    {edu.period || "Completed"}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                  <p className="text-gray-500 text-sm">{edu.institution}</p>
                  {edu.status && <span className="text-[10px] bg-yellow-100 px-2 py-0.5 rounded text-yellow-700 font-bold uppercase mt-2 inline-block">{edu.status}</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-12 tracking-tight">Certifications</h2>
            <div className="space-y-6">
              {DATA.certifications.map((cert, idx) => (
                <div key={idx} className="p-6 bg-gray-50 flex justify-between items-center group hover:bg-teal-600 hover:text-white transition-all cursor-default">
                  <div>
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className="text-sm opacity-60">{cert.provider}</p>
                  </div>
                  {cert.status ? (
                    <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{cert.status}</span>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section id="skills" className="py-24 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Skills & Tools</h2>
            <p className="text-gray-400">Technical and soft skills summary</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...DATA.technicalSkills, ...DATA.softSkills].map((skill, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 border border-gray-100 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-sm font-bold text-gray-700">{skill}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-24 bg-teal-600 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10">
            Let's make something<br />amazing together.
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <a href={`mailto:${DATA.email}`} className="text-xl font-bold underline underline-offset-8 hover:opacity-80 transition-opacity">
              Start by saying hi
            </a>
            <div className="hidden md:block w-px h-12 bg-white/30"></div>
            <div className="text-sm text-white/70 flex items-center gap-2">
              <MapPin size={16} />
              {DATA.location}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <MessageSquare size={300} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-400 font-medium">
          <div>© {new Date().getFullYear()} {DATA.name}. All Rights Reserved</div>
          <div className="flex gap-8 uppercase tracking-widest">
            <a href="#" className="hover:text-teal-600">LinkedIn</a>
            <a href="#" className="hover:text-teal-600">Github</a>
            <a href="#" className="hover:text-teal-600">Twitter</a>
          </div>
          <div className="text-gray-300">Design by AI Studio</div>
        </div>
      </footer>
    </div>
  );
}
