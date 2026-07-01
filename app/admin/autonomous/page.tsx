"use client";

import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Play, 
  FileText, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Database,
  Code,
  Layout,
  MessageSquare,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { handleRegeneration, getProjectsWithStats, handleCreateDemo } from "./actions";

type ProjectWithStats = any;

export default function AutonomousAdminPage() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const data = await getProjectsWithStats();
    setProjects(data);
    setLoading(false);
  }

  async function onCreateDemo() {
    setLoading(true);
    await handleCreateDemo();
    await fetchProjects();
  }

  async function onAction(projectId: string, type: any, path?: string) {
    setProcessingId(`${projectId}-${type}`);
    const res = await handleRegeneration(projectId, type, path);
    if (res.success) {
      await fetchProjects();
    } else {
      alert(`Error: ${res.error}`);
    }
    setProcessingId(null);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "text-emerald-500 bg-emerald-500/10";
      case "generated": return "text-blue-500 bg-blue-500/10";
      case "regenerated": return "text-indigo-500 bg-indigo-500/10";
      case "fallback-generated": return "text-amber-500 bg-amber-500/10";
      case "incomplete": return "text-orange-500 bg-cyan-500/10";
      case "failed": return "text-red-500 bg-red-500/10";
      case "pending": return "text-slate-400 bg-slate-500/5";
      default: return "text-slate-400 bg-slate-500/5";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Autonomous Engine Control</h1>
            <p className="text-slate-500 font-medium">Manage project generation, resilience, and AI regeneration flows.</p>
          </div>
          <div className="flex items-center gap-4">
             {projects.length === 0 && !loading && (
               <button 
                 onClick={onCreateDemo}
                 className="px-6 py-2 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
               >
                 Initialize Project
               </button>
             )}
             <button 
               onClick={fetchProjects}
               className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 transition-colors shadow-sm"
             >
               <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
             </button>
          </div>
        </header>

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {projects.map(project => (
              <motion.div 
                key={project.id}
                layout
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm"
              >
                {/* Project Banner Status */}
                <div className={`px-8 py-4 flex items-center justify-between border-b ${project.isComplete ? "bg-emerald-500/5 border-emerald-500/10" : "bg-amber-500/5 border-amber-500/10"}`}>
                  <div className="flex items-center gap-3">
                    {project.isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <span className={`text-xs font-black uppercase tracking-widest ${project.isComplete ? "text-emerald-600" : "text-amber-600"}`}>
                      {project.isComplete ? "Health: Optimal" : `Health Warning: ${project.missingCount} Files Missing`}
                    </span>
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    Latest Run Status: 
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600">
                      {project.runs[0]?.status || "NO DATA"}
                    </span>
                  </div>
                </div>

                <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Info & Stats */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{project.name}</h2>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{project.files.length}</div>
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Files</div>
                      </div>
                      <div className="p-5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-2xl font-black text-amber-600">{project.missingCount}</div>
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Missing</div>
                      </div>
                    </div>

                    {project.missingNames.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          Missing Index
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.missingNames.map((name: string) => (
                            <span key={name} className="px-2 py-1 bg-red-500/5 text-red-500 border border-red-500/10 rounded-lg text-[9px] font-bold">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.validationErrors.length > 0 && (
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-2">
                         <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Validation Failures</span>
                         </div>
                         <ul className="space-y-1">
                            {project.validationErrors.map((err: string, idx: number) => (
                              <li key={idx} className="text-[9px] text-red-400 leading-tight">• {err}</li>
                            ))}
                         </ul>
                      </div>
                    )}
                  </div>

                  {/* Execution Matrix (The Buttons) */}
                  <div className="lg:col-span-8 space-y-10">
                    
                    {/* Primary Resilience Actions */}
                    <div className="space-y-6">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        Infrastructure Resilience
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActionButton 
                          icon={<RefreshCw className="h-4 w-4" />}
                          label="Regenerate Full Project"
                          desc="Flush all files and start deep rebuild"
                          onClick={() => onAction(project.id, "FULL_PROJECT")}
                          loading={processingId === `${project.id}-FULL_PROJECT`}
                          variant="danger"
                        />
                        <ActionButton 
                          icon={<Play className="h-4 w-4" />}
                          label="Resume Generation"
                          desc="Identify missing pieces and fulfill"
                          onClick={() => onAction(project.id, "MISSING_FILES")}
                          loading={processingId === `${project.id}-MISSING_FILES`}
                          variant="primary"
                          highlight={!project.isComplete}
                        />
                      </div>
                    </div>

                    {/* Granular Module Regeneration */}
                    <div className="space-y-6">
                       <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        Granular Module Rebuild
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ModuleAction 
                          icon={<Database className="h-4 w-4" />} 
                          label="Master Blueprint" 
                          onClick={() => onAction(project.id, "BLUEPRINT")}
                          loading={processingId === `${project.id}-BLUEPRINT`}
                        />
                        <ModuleAction 
                          icon={<Code className="h-4 w-4" />} 
                          label="Framework Pack" 
                          onClick={() => onAction(project.id, "FRAMEWORK")}
                          loading={processingId === `${project.id}-FRAMEWORK`}
                        />
                        <ModuleAction 
                          icon={<Settings className="h-4 w-4" />} 
                          label="IDE Configs" 
                          onClick={() => onAction(project.id, "IDE")}
                          loading={processingId === `${project.id}-IDE`}
                        />
                        <ModuleAction 
                          icon={<FileText className="h-4 w-4" />} 
                          label="Documents" 
                          onClick={() => onAction(project.id, "DOCUMENT")}
                          loading={processingId === `${project.id}-DOCUMENT`}
                        />
                        <ModuleAction 
                          icon={<Settings className="h-4 w-4" />} 
                          label="Agent Engine" 
                          onClick={() => onAction(project.id, "AGENT")}
                          loading={processingId === `${project.id}-AGENT`}
                        />
                        <ModuleAction 
                          icon={<ClipboardList className="h-4 w-4" />} 
                          label="Task Board" 
                          onClick={() => onAction(project.id, "TASKBOARD")}
                          loading={processingId === `${project.id}-TASKBOARD`}
                        />
                        <ModuleAction 
                          icon={<MessageSquare className="h-4 w-4" />} 
                          label="Messages" 
                          onClick={() => onAction(project.id, "MESSAGES")}
                          loading={processingId === `${project.id}-MESSAGES`}
                        />
                      </div>
                    </div>

                    {/* File Status Track */}
                    <div className="pt-6">
                       <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] space-y-4">
                          <header className="flex items-center justify-between px-2">
                             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Artifact Status</h4>
                             <div className="text-[9px] font-bold text-slate-400">Total: {project.files.length}</div>
                          </header>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                             {project.files.map((file: any) => (
                               <div key={file.id} className="group relative flex items-center justify-between p-2 pl-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-all hover:border-blue-500/40">
                                  <div className="flex flex-col gap-0.5 truncate pr-2">
                                     <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{file.path.split('/').pop()}</span>
                                     <span className="text-[8px] uppercase font-black text-slate-400">{file.type}</span>
                                  </div>
                                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(file.status).split(' ')[0].replace('text-', 'bg-')}`} />
                                  
                                  {/* Tooltip on hover */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity">
                                     Status: {file.status}
                                  </div>
                               </div>
                             ))}
                             {project.files.length === 0 && (
                               <div className="col-span-full py-8 text-center text-[10px] font-black uppercase text-slate-300">
                                  No generated artifacts indexed
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, desc, onClick, loading, variant = "primary", highlight = false }: any) {
  const getStyles = () => {
    if (variant === "danger") return "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-500/20";
    if (highlight) return "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20";
    return "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-500 shadow-sm";
  };

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`group flex items-center gap-5 p-6 rounded-[2rem] transition-all active:scale-95 disabled:opacity-50 text-left ${getStyles()}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${variant === "primary" && !highlight ? "bg-slate-50 dark:bg-slate-800 text-blue-600" : "bg-white/10 text-white"}`}>
        {loading ? <RefreshCw className="h-6 w-6 animate-spin" /> : icon}
      </div>
      <div className="space-y-1">
        <div className="text-sm font-black uppercase tracking-widest">{label}</div>
        <div className={`text-[10px] font-medium leading-tight ${variant === "primary" && !highlight ? "text-slate-500" : "text-white/60"}`}>{desc}</div>
      </div>
    </button>
  );
}

function ModuleAction({ icon, label, onClick, loading }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] transition-all hover:border-blue-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 shadow-sm group"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 transition-colors flex items-center justify-center">
        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-center leading-tight">
        {label}
      </span>
    </button>
  );
}
