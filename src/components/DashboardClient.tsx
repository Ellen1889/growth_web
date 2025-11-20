'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, FlaskConical, Library, Menu, X, Github, Linkedin, Twitter,
  ExternalLink, GraduationCap, Package, PlayCircle, Book, Mic, ChevronRight, ArrowUpRight, ArrowLeft
} from 'lucide-react';
import { Experiment, Reflection, Review, Term, Tool, ContentType } from '@/types';
import ExperimentGenerator from './ExperimentGenerator';

enum View {
  DASHBOARD = 'dashboard',
  NEWSLETTER = 'newsletter',
  REVIEWS = 'reviews',
  EXPERIMENTS = 'experiments',
  KNOWLEDGE = 'knowledge',
  TOOLS = 'tools'
}

interface DashboardProps {
  initialExperiments: Experiment[];
  initialReviews: Review[];
  initialNewsletter: Reflection[];
  initialTerms: Term[];
  initialTools: Tool[];
}

// --- Sub-Components ---

const SidebarItem: React.FC<{ 
  icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void 
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
      isActive 
        ? 'bg-green-50 text-green-900 font-medium' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className={`${isActive ? 'text-green-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

const Card: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm ${className}`}>
    <h3 className="font-display font-bold text-lg text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'Running': 'bg-blue-50 text-blue-700 border-blue-100',
    'Success': 'bg-green-50 text-green-700 border-green-100',
    'Failed': 'bg-red-50 text-red-700 border-red-100',
    'Inconclusive': 'bg-gray-50 text-gray-700 border-gray-100'
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors[status] || colors['Inconclusive']}`}>
      {status}
    </span>
  );
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex text-yellow-400 text-sm">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "fill-current" : "text-gray-200"}>★</span>
    ))}
  </div>
);

const ContentIcon: React.FC<{ type: ContentType }> = ({ type }) => {
  switch (type) {
    case ContentType.VIDEO: return <PlayCircle className="w-4 h-4" />;
    case ContentType.PODCAST: return <Mic className="w-4 h-4" />;
    case ContentType.BOOK: return <Book className="w-4 h-4" />;
    default: return <Library className="w-4 h-4" />;
  }
};

// --- Main Component ---

const DashboardClient: React.FC<DashboardProps> = ({ 
  initialExperiments, initialReviews, initialNewsletter, initialTerms, initialTools 
}) => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [selectedKnowledgeTerm, setSelectedKnowledgeTerm] = useState<Term | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (v: View) => {
    setView(v);
    setSelectedKnowledgeTerm(null);
    setMobileMenuOpen(false);
    window.scrollTo(0,0);
  };

  // Render Helpers
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="font-display text-3xl font-bold mb-2">Hello, I'm Ellen.</h1>
              <p className="text-green-100 text-lg max-w-lg mb-6">
                Growth Marketing Manager. This is my digital garden where I cultivate experiments, reviews, and marketing knowledge.
              </p>
              <div className="flex gap-3">
                 <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Linkedin className="w-5 h-5" /></a>
                 <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Twitter className="w-5 h-5" /></a>
                 <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FlaskConical size={200} />
            </div>
          </div>
        </div>
        
        <Card title="Current Experiment">
          {initialExperiments.filter(e => e.status === 'Running').length > 0 ? (
             initialExperiments.filter(e => e.status === 'Running').slice(0, 1).map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800 line-clamp-1">{e.title}</span>
                  <StatusBadge status={e.status} />
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{e.hypothesis}</p>
                <button onClick={() => navigate(View.EXPERIMENTS)} className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
                  View Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No active experiments running.</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Latest Newsletter">
          <div className="space-y-4">
            {initialNewsletter.slice(0, 2).map(post => (
              <div key={post.id} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-1 flex-wrap">
                    {post.categories.map((cat, idx) => (
                      <span key={idx} className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-50 px-1.5 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition">{post.title}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate(View.NEWSLETTER)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:bg-gray-50 rounded border border-dashed border-gray-300">
            Read all posts
          </button>
        </Card>

        <Card title="Recent Reviews">
           <div className="space-y-3">
             {initialReviews.slice(0, 3).map(review => (
               <div key={review.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                 <div className="flex items-center gap-3">
                   <img src={review.coverImage || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                   <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{review.title}</p>
                      <p className="text-xs text-gray-500">{review.author}</p>
                   </div>
                 </div>
                 <RatingStars rating={review.rating} />
               </div>
             ))}
           </div>
           <button onClick={() => navigate(View.REVIEWS)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:bg-gray-50 rounded border border-dashed border-gray-300">
            Browse Library
          </button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-800">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
           <h1 className="font-display font-bold text-xl tracking-tight text-gray-900">
             <span className="text-green-600">Ellen's</span> Growth.
           </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" isActive={view === View.DASHBOARD} onClick={() => navigate(View.DASHBOARD)} />
          <SidebarItem icon={<BookOpen size={20}/>} label="My Newsletter" isActive={view === View.NEWSLETTER} onClick={() => navigate(View.NEWSLETTER)} />
          <SidebarItem icon={<Library size={20}/>} label="Reviews" isActive={view === View.REVIEWS} onClick={() => navigate(View.REVIEWS)} />
          <SidebarItem icon={<GraduationCap size={20}/>} label="Knowledge" isActive={view === View.KNOWLEDGE} onClick={() => navigate(View.KNOWLEDGE)} />
          <SidebarItem icon={<FlaskConical size={20}/>} label="Experiments" isActive={view === View.EXPERIMENTS} onClick={() => navigate(View.EXPERIMENTS)} />
          <SidebarItem icon={<Package size={20}/>} label="Tools & Stack" isActive={view === View.TOOLS} onClick={() => navigate(View.TOOLS)} />
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 className="font-display font-bold text-lg text-gray-900">
             <span className="text-green-600">Ellen's</span> Growth.
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 px-4 md:hidden">
          <nav className="space-y-2">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" isActive={view === View.DASHBOARD} onClick={() => navigate(View.DASHBOARD)} />
            <SidebarItem icon={<BookOpen size={20}/>} label="My Newsletter" isActive={view === View.NEWSLETTER} onClick={() => navigate(View.NEWSLETTER)} />
            <SidebarItem icon={<Library size={20}/>} label="Reviews" isActive={view === View.REVIEWS} onClick={() => navigate(View.REVIEWS)} />
            <SidebarItem icon={<GraduationCap size={20}/>} label="Knowledge" isActive={view === View.KNOWLEDGE} onClick={() => navigate(View.KNOWLEDGE)} />
            <SidebarItem icon={<FlaskConical size={20}/>} label="Experiments" isActive={view === View.EXPERIMENTS} onClick={() => navigate(View.EXPERIMENTS)} />
            <SidebarItem icon={<Package size={20}/>} label="Tools & Stack" isActive={view === View.TOOLS} onClick={() => navigate(View.TOOLS)} />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-0 mt-14 md:mt-0 max-w-7xl mx-auto w-full">
        
        {view === View.DASHBOARD && renderDashboard()}

        {view === View.EXPERIMENTS && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-900">Experiment Log</h2>
            <ExperimentGenerator />
            <div className="grid gap-6">
              {initialExperiments.map(exp => (
                <div key={exp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900">{exp.title}</h3>
                      <span className="text-xs text-gray-400 font-mono">{exp.date}</span>
                    </div>
                    <StatusBadge status={exp.status} />
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Problem</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{exp.problem}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-2">Hypothesis</span>
                      <p className="text-sm text-gray-700 leading-relaxed bg-green-50 p-3 rounded-lg border border-green-100 italic">
                        "{exp.hypothesis}"
                      </p>
                    </div>
                     <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Results</span>
                      <p className="text-sm font-medium text-gray-900 mb-1">{exp.metric}</p>
                      <p className="text-sm text-gray-600">{exp.resultSummary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === View.REVIEWS && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-900">Content Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialReviews.map(review => (
                <a key={review.id} href={review.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md hover:border-green-200 transition-all group">
                  <div className="h-48 overflow-hidden rounded-t-xl relative">
                     <img src={review.coverImage || 'https://via.placeholder.com/300'} alt={review.title} className="w-full h-full object-cover" />
                     <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                       <ContentIcon type={review.type} />
                       {review.type}
                     </div>
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ArrowUpRight className="text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all drop-shadow-md" size={32} />
                     </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors mb-1">{review.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500">by {review.author}</p>
                      <RatingStars rating={review.rating} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Key Takeaways</p>
                      <ul className="space-y-1">
                        {review.takeaways.map((t, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {view === View.NEWSLETTER && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">My Newsletter</h2>
            {initialNewsletter.map(post => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                  <img src={post.imageUrl || 'https://via.placeholder.com/800x400'} alt={post.title} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500 mb-3">
                    {post.categories.map((cat, idx) => (
                      <span key={idx} className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">{cat}</span>
                    ))}
                    {post.categories.length > 0 && <span>•</span>}
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium text-sm hover:underline inline-flex items-center gap-1">
                      Read Full Article →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {view === View.KNOWLEDGE && !selectedKnowledgeTerm && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-900">Knowledge Base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialTerms.map(term => (
                <div key={term.id} onClick={() => { setSelectedKnowledgeTerm(term); window.scrollTo(0,0); }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                       <span className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1 block">{term.category}</span>
                       <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">{term.term}</h3>
                     </div>
                     <ChevronRight className="text-gray-300 group-hover:text-green-500" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === View.KNOWLEDGE && selectedKnowledgeTerm && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <button onClick={() => setSelectedKnowledgeTerm(null)} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Knowledge Base
            </button>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white p-8 border-b border-gray-100">
                 <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-100 inline-block mb-4">
                   {selectedKnowledgeTerm.category}
                 </span>
                 <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{selectedKnowledgeTerm.term}</h1>
                 <p className="text-xl text-gray-600 leading-relaxed font-light">{selectedKnowledgeTerm.definition}</p>
              </div>
              <div className="p-8 space-y-8">
                {selectedKnowledgeTerm.formula && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Formula</h3>
                    <div className="bg-slate-900 text-slate-50 p-6 rounded-xl font-mono text-lg text-center shadow-inner">
                      {selectedKnowledgeTerm.formula}
                    </div>
                  </div>
                )}
                {selectedKnowledgeTerm.longDescription && (
                  <div>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Deep Dive</h3>
                     <div className="prose prose-slate max-w-none">
                       <p className="text-gray-700 leading-8 whitespace-pre-line">{selectedKnowledgeTerm.longDescription}</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === View.TOOLS && (
          <div className="space-y-6 animate-fade-in">
             <div>
                <h2 className="text-2xl font-display font-bold text-gray-900">Tools & Stack</h2>
                <p className="text-gray-500">The software powering my growth machine.</p>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialTools.map(tool => (
                <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex-shrink-0">
                    <img src={tool.iconUrl || 'https://via.placeholder.com/48'} alt={tool.name} className="w-full h-full object-contain rounded" />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{tool.name}</h3>
                       <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-green-400" />
                     </div>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-xs text-gray-500">{tool.category}</span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tool.price === 'Paid' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                         {tool.price}
                       </span>
                     </div>
                     <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardClient;