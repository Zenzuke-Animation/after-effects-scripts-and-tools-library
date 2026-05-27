"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Key, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  Search, 
  AlertTriangle, 
  Layers, 
  HelpCircle, 
  Lightbulb, 
  ExternalLink, 
  X, 
  Cpu, 
  Workflow
} from "lucide-react";

interface ScriptItem {
  id: string;
  name: string;
  version: string;
  description: string;
  instructions: string;
  timelineCreation: string;
  limitations: string;
  typicalUses: string;
  downloadUrl: string;
  category: string;
}

export default function Home() {
  // --- States ---
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  
  // Admin & Secrets Authentication
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ae_admin_password") === "ae-admin-123";
    }
    return false;
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ae_admin_password");
      return saved === "ae-admin-123" ? saved : "";
    }
    return "";
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Script Editor Modal (Add & Edit)
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<ScriptItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formVersion, setFormVersion] = useState("1.0");
  const [formDescription, setFormDescription] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [formTimelineCreation, setFormTimelineCreation] = useState("");
  const [formLimitations, setFormLimitations] = useState("");
  const [formTypicalUses, setFormTypicalUses] = useState("");
  const [formDownloadUrl, setFormDownloadUrl] = useState("");
  const [formCategory, setFormCategory] = useState("Workflow");

  // Deployment Guides/Export Modal
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // --- Utility Functions ---
  const fetchScripts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Auto-detect environments
      // On development (running Next), we call /api/scripts
      // On cPanel/PHP host, we call api.php or absolute ./data/scripts.json
      // For static export (no Next.js server), default to api.php
      const isNextDev = window.location.port === '3500' || window.location.port === '3000' || window.location.hostname.includes('europe-west2.run.app');
      let url = "./api.php";
      
      if (isNextDev) {
        url = "/api/scripts";
      }

      const res = await fetch(url);
      if (!res.ok) {
        // Fallback search in public scripts JSON directly
        const fallbackRes = await fetch("./data/scripts.json");
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setScripts(data);
          if (data.length > 0) {
            setSelectedScriptId(data[0].id);
          }
          return;
        }
        throw new Error("Failed to compile script index.");
      }
      
      const data = await res.json();
      setScripts(data);
      if (data.length > 0) {
        setSelectedScriptId(data[0].id);
      }
    } catch (err: any) {
      console.error("Fetch failure:", err);
      setError("Unable to sync script database list.");
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Loading ---
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchScripts();
    });
  }, []);

  // --- Database Persistence Update Trigger ---
  const saveScriptsCatalog = async (updatedList: ScriptItem[]) => {
    try {
      // For static export, default to api.php; only use /api/scripts if running Next.js dev
      const isNextDev = window.location.port === '3000' || window.location.hostname.includes('europe-west2.run.app');
      let url = isNextDev ? "/api/scripts" : "./api.php";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": adminPassword
        },
        body: JSON.stringify({
          password: adminPassword,
          scripts: updatedList
        })
      });

      const resJson = await res.json();
      if (!res.ok || resJson.success === false) {
        throw new Error(resJson.error || "Execution failed");
      }

      setScripts(updatedList);
      return true;
    } catch (err: any) {
      alert("Error saving: " + err.message);
      return false;
    }
  };

  // --- Admin Authentication Logic ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    // Simple robust authorization check
    if (loginPasswordInput === "ae-admin-123") {
      setIsAdmin(true);
      setAdminPassword(loginPasswordInput);
      localStorage.setItem("ae_admin_password", loginPasswordInput);
      setLoginModalOpen(false);
      setLoginPasswordInput("");
    } else {
      setLoginError("Invalid administrator passcode. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword("");
    localStorage.removeItem("ae_admin_password");
  };

  // --- Interactive Sorting / Reordering ---
  const moveItem = async (index: number, direction: "up" | "down") => {
    if (!isAdmin) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scripts.length) return;
    
    const reordered = [...scripts];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    
    await saveScriptsCatalog(reordered);
  };

  // -- Delete Script Handler ---
  const handleDeleteScript = async (id: string, name: string) => {
    if (!isAdmin) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}" from your catalog?`);
    if (!confirmDelete) return;

    const filtered = scripts.filter(s => s.id !== id);
    const success = await saveScriptsCatalog(filtered);
    if (success && selectedScriptId === id) {
      setSelectedScriptId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  // --- Form Editor Submission (Add & Edit) ---
  const openEditor = (script: ScriptItem | null) => {
    setEditingScript(script);
    if (script) {
      setFormName(script.name);
      setFormVersion(script.version);
      setFormDescription(script.description);
      setFormInstructions(script.instructions);
      setFormTimelineCreation(script.timelineCreation);
      setFormLimitations(script.limitations);
      setFormTypicalUses(script.typicalUses);
      setFormDownloadUrl(script.downloadUrl);
      setFormCategory(script.category);
    } else {
      // Clear for new entry
      setFormName("");
      setFormVersion("1.0");
      setFormDescription("");
      setFormInstructions("");
      setFormTimelineCreation("");
      setFormLimitations("");
      setFormTypicalUses("");
      setFormDownloadUrl("");
      setFormCategory("Workflow");
    }
    setEditorModalOpen(true);
  };

  const handleEditorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Script name is required.");
      return;
    }

    const scriptPayload: ScriptItem = {
      id: editingScript ? editingScript.id : formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: formName.trim(),
      version: formVersion.trim() || "1.0",
      description: formDescription.trim(),
      instructions: formInstructions.trim(),
      timelineCreation: formTimelineCreation.trim(),
      limitations: formLimitations.trim(),
      typicalUses: formTypicalUses.trim(),
      downloadUrl: formDownloadUrl.trim() || "#",
      category: formCategory.trim() || "Workflow"
    };

    let updatedList: ScriptItem[] = [];
    if (editingScript) {
      // Edit
      updatedList = scripts.map(s => s.id === editingScript.id ? scriptPayload : s);
    } else {
      // Add new
      // Check for duplicates
      if (scripts.some(s => s.id === scriptPayload.id)) {
        alert("A tool with this name or ID already exists!");
        return;
      }
      updatedList = [...scripts, scriptPayload];
    }

    const success = await saveScriptsCatalog(updatedList);
    if (success) {
      setEditorModalOpen(false);
      setSelectedScriptId(scriptPayload.id);
    }
  };

  // --- Copy Clipboard Helpers ---
  const triggerCopyNotification = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // --- Computed Variables ---
  const activeScript = scripts.find(s => s.id === selectedScriptId) || null;

  // Derive categories list dynamically
  const categoriesList = ["All", ...Array.from(new Set(scripts.map(s => s.category)))];

  // Filter scripts by Search and Tags
  const filteredScripts = scripts.filter(script => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      script.name.toLowerCase().includes(term) ||
      script.description.toLowerCase().includes(term) ||
      script.category.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === "All" || script.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // --- PHP Code Generation for cPanel Export ---
  const phpInstructionsCode = `<?php
// Secure After Effects Script Catalog - api.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Password");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

define('ADMIN_PASSWORD', 'ae-admin-123'); // UPDATE THIS
$jsonFile = './scripts.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Content-Type: application/json; charset=UTF-8");
    echo file_exists($jsonFile) ? file_get_contents($jsonFile) : json_encode([]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Content-Type: application/json; charset=UTF-8");
    $headers = getallheaders();
    $pwd = isset($headers['X-Admin-Password']) ? $headers['X-Admin-Password'] : '';
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($pwd) && isset($input['password'])) { $pwd = $input['password']; }

    if ($pwd !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Unauthorized"]);
        exit;
    }
    
    $scripts = isset($input['scripts']) ? $input['scripts'] : $input;
    if (file_put_contents($jsonFile, json_encode($scripts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Disk write failure"]);
    }
    exit;
}
?>`;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#D1D5DB] font-sans antialiased selection:bg-[#6366F1] selection:text-white pb-10" id="ae-workspace-root">
      
      {/* 1. After Effects Styled Action bar */}
      <header className="bg-[#1A1D23] border-b border-[#2D333D] px-8 py-4 flex items-center justify-between shadow-md" id="ae-header-bar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#312E81] rounded flex items-center justify-center font-bold text-white font-mono shadow-inner border border-[#6366F1]/20">
            Ae
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
            AE Scripts & Rigging Directory <span className="text-[#6366F1] font-mono text-xs ml-2 uppercase tracking-widest opacity-80 font-bold">Workspace_v3</span>
          </h1>
          <span className="h-4 w-[1px] bg-[#2D333D] hidden sm:block"></span>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Database Connection: locked_db_v3
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></span>
            <span className="text-slate-400 font-mono text-[11px]">System Active</span>
          </div>

          {/* Export guide for artists */}
          <button
            onClick={() => setDeployModalOpen(true)}
            className="bg-[#14171C] hover:bg-[#1A1D23] border border-[#2D333D] text-slate-300 px-3 py-1.5 rounded text-xs font-mono transition-colors duration-150 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            title="cPanel PHP Export Configuration Guide"
            id="deploy-button"
          >
            <Settings className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="hidden md:inline">cPanel Deployment</span>
          </button>

          {/* Secure lock authentication trigger */}
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/30 px-3 py-1.5 rounded" id="admin-status-bar">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-[#6366F1] font-mono font-bold">Admin Active</span>
              <button 
                onClick={handleAdminLogout} 
                className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wider font-bold ml-2 underline focus:outline-none cursor-pointer"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-4 py-1.5 rounded text-xs font-medium transition duration-150 flex items-center gap-1.5 focus:outline-none cursor-pointer"
              id="admin-login-trigger"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="ae-main-grid">
        
        {/* Left Side: Script List Container */}
        <section className="lg:col-span-4 flex flex-col gap-5" id="script-list-container">
          
          {/* Search bar & Category select */}
          <div className="bg-[#1A1D23] border border-[#2D333D] p-5 rounded-xl shadow-lg">
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AE actions, tags, metadata..."
                className="w-full bg-[#14171C] border border-[#2D333D] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#D1D5DB] placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition duration-150 font-mono shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Layout tabs representing dynamic groups */}
            <div className="flex flex-wrap gap-1.5 border-t border-[#2D333D] pt-4" id="categories-filter-rail">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-3 py-1.5 rounded font-mono uppercase tracking-[0.1em] font-medium transition duration-150 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/35 shadow-sm"
                      : "bg-[#14171C] text-slate-400 hover:text-slate-200 border border-[#2D333D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-mono">
              Timeline Tools ({filteredScripts.length})
            </h3>
            {isAdmin && (
              <button
                onClick={() => openEditor(null)}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg px-3 py-1.5 text-xs font-mono font-medium flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tool</span>
              </button>
            )}
          </div>

          {/* Scripts List Scroll Box */}
          <div className="flex flex-col gap-3.5 max-h-[640px] overflow-y-auto pr-1" id="scripts-catalog-scroller">
            {loading ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Analyzing directory metadata...
              </div>
            ) : error ? (
              <div className="py-8 text-center text-amber-500/80 border border-amber-500/20 bg-amber-500/5 rounded-lg text-xs font-mono p-4">
                <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                <p>{error}</p>
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs border border-[#2D333D] rounded-lg bg-[#1A1D23]/50">
                No scripts matched search query.
              </div>
            ) : (
              filteredScripts.map((script, idx) => {
                const isActive = script.id === selectedScriptId;
                return (
                  <div
                    key={script.id}
                    onClick={() => setSelectedScriptId(script.id)}
                    className={`group relative bg-[#1A1D23] border rounded-lg p-4 transition duration-150 cursor-pointer text-left ${
                      isActive 
                        ? "border-[#6366F1] bg-[#6366F1]/5 shadow-lg shadow-[#6366F1]/5" 
                        : "border-[#2D333D] hover:border-slate-500 hover:bg-[#1A1D23]/80"
                    }`}
                  >
                    {/* Selected highlighting indicator similar to AE layout selections */}
                    {isActive && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#6366F1] rounded-l-lg"></div>
                    )}
 
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-xs text-white group-hover:text-[#6366F1] flex items-center gap-1.5 transition-colors">
                          {script.name}
                          <span className="text-[9px] text-[#D1D5DB] font-mono bg-[#2D333D] px-1.5 py-0.5 rounded font-bold">
                            v{script.version}
                          </span>
                        </h4>
                        <span className="inline-block mt-1.5 text-[9px] text-[#6366F1] font-mono uppercase bg-[#6366F1]/10 border border-[#6366F1]/20 px-2 py-0.5 rounded tracking-wider">
                          {script.category}
                        </span>
                      </div>
                      
                      {/* Admin inline controls */}
                      {isAdmin && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveItem(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveItem(idx, "down")}
                            disabled={idx === scripts.length - 1}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditor(script)}
                            className="p-1 text-slate-500 hover:text-[#6366F1] transition cursor-pointer"
                            title="Edit Tool"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteScript(script.id, script.name)}
                            className="p-1 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                            title="Remove Tool"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
 
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {script.description}
                    </p>
 
                    {/* Footer tags */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-4 border-t border-[#2D333D] pt-2 font-mono">
                      <span>Timeline: {script.timelineCreation ? "Creates Items" : "Modifies Layers"}</span>
                      {script.downloadUrl && script.downloadUrl !== "#" && (
                        <span className="text-slate-400 flex items-center gap-0.5 group-hover:text-[#6366F1] transition-colors font-medium">
                          Active DL <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Side: Active Tool Deep Profile (Effect Controls panel visual paradigm) */}
        <section className="lg:col-span-8" id="script-profile-container">
          <AnimatePresence mode="wait">
            {activeScript ? (
              <motion.div
                key={activeScript.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-[#1A1D23] border border-[#2D333D] rounded-xl shadow-xl overflow-hidden flex flex-col h-full"
                id={`panel-${activeScript.id}`}
              >
                {/* Visual Header of the Profile */}
                <div className="bg-[#1A1D23] border-b border-[#2D333D] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-[9px] text-[#6366F1] font-mono uppercase bg-[#6366F1]/10 border border-[#6366F1]/20 px-2 py-0.5 rounded tracking-wider font-bold">
                        {activeScript.category}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono font-bold bg-[#2D333D] px-2 py-0.5 rounded">
                        v{activeScript.version}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {activeScript.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => triggerCopyNotification(activeScript.id, activeScript.downloadUrl)}
                      className="bg-[#2D333D] hover:bg-[#2D333D]/80 border border-[#2D333D] px-4 py-2.5 rounded text-xs transition duration-150 text-slate-300 font-mono flex items-center gap-1.5 focus:outline-none cursor-pointer"
                      title="Copy Direct Download Link"
                    >
                      {copiedText === activeScript.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={activeScript.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-5 py-2.5 rounded text-xs font-semibold tracking-wide transition duration-150 inline-flex items-center gap-2 shadow-md border border-[#6366F1]/50 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Tool</span>
                    </a>
                  </div>
                </div>

                {/* Body Content Blocks with custom typographic rhythm */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[640px]">
                  
                  {/* DESCRIPTION block */}
                  <div id="section-description">
                    <h4 className="text-[10px] font-bold text-[#6366F1] tracking-[0.2em] uppercase mb-2.5 font-mono flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5" />
                      What it does
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-[#14171C] p-5 rounded-xl border border-[#2D333D]">
                      {activeScript.description}
                    </p>
                  </div>

                  {/* HOW TO USE step-by-step instructions */}
                  <div id="section-instructions">
                    <h4 className="text-[10px] font-bold text-[#6366F1] tracking-[0.2em] uppercase mb-2.5 font-mono flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      How to use it
                    </h4>
                    <div className="bg-[#14171C] p-6 rounded-xl border border-[#2D333D] flex flex-col gap-4">
                      {activeScript.instructions ? (
                        activeScript.instructions.split("\n").map((line, idx) => {
                          // Clean number format if present
                          const cleanText = line.replace(/^\d+[\.\s]*/, "");
                          if (!line.trim()) return null;
                          return (
                            <div key={idx} className="flex gap-3.5 text-sm text-slate-300">
                              <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-[11px] font-mono font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <p className="mt-0.5 leading-relaxed">{cleanText}</p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">No usage instructions supplied for this tool.</p>
                      )}
                    </div>
                  </div>

                  {/* TIMELINE CREATION Details */}
                  <div id="section-creation">
                    <h4 className="text-[10px] font-bold text-[#6366F1] tracking-[0.2em] uppercase mb-2.5 font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      What does it create on timeline?
                    </h4>
                    <div className="bg-[#14171C] border border-[#2D333D] p-5 rounded-xl flex items-start gap-3.5">
                      <Cpu className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeScript.timelineCreation || "Modifies properties and transformations on selected target layers without adding new active nodes."}
                      </p>
                    </div>
                  </div>

                  {/* LIMITATIONS / COMPATIBILITY WARNINGS */}
                  <div id="section-limitations">
                    <h4 className="text-[10px] font-bold text-[#6366F1] tracking-[0.2em] uppercase mb-2.5 font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Limitations & Compatibility
                    </h4>
                    <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl flex items-start gap-3.5">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-200/90 leading-relaxed">
                        {activeScript.limitations || "Requires CC 2020 or above. Ensure scripting and expression writes are permitted in Preferences > Scripting & Expressions."}
                      </p>
                    </div>
                  </div>

                  {/* TYPICAL USE CASES LIST */}
                  <div id="section-uses">
                    <h4 className="text-[10px] font-bold text-[#6366F1] tracking-[0.2em] uppercase mb-2.5 font-mono flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Typical Use Cases
                    </h4>
                    <div className="bg-[#14171C] p-5 rounded-xl border border-[#2D333D]">
                      {activeScript.typicalUses ? (
                        <div className="flex flex-col gap-2.5">
                          {activeScript.typicalUses.split(",").map((use, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
                              <span>{use.trim()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No use cases listed yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="bg-[#1A1D23]/40 border border-dashed border-[#2D333D] rounded-xl h-[400px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Workflow className="w-12 h-12 text-[#2D333D] mb-3" />
                <p className="font-mono text-xs">No active tool selected.</p>
                <p className="text-xs text-slate-500 mt-1">Select an After Effects Action to explore installation & instructions</p>
              </div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* --- Footer with credits and direct link --- */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 text-center text-slate-500 font-mono text-[10px] border-t border-[#2D333D] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span>Persist backend: </span>
          <code className="bg-[#1A1D23] text-slate-300 px-1.5 py-0.5 rounded border border-[#2D333D]">scripts.json</code> <span>&bull; Powered by cPanel deployment ready structure</span>
        </div>
        <div>
          <span>Default admin password: </span>
          <code className="bg-[#1A1D23] text-[#6366F1] px-1.5 py-0.5 rounded border border-[#2D333D] font-mono select-all">ae-admin-123</code>
        </div>
      </footer>

      {/* --- MODAL 1: ADMIN PASSWORD ACCESS MODAL --- */}
      <AnimatePresence>
        {loginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#1A1D23] border border-[#2D333D] p-6 rounded-xl w-full max-w-sm shadow-2xl"
              id="admin-auth-modal"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] font-mono text-slate-200">
                  Authentication Lock
                </h3>
                <button 
                  onClick={() => { setLoginModalOpen(false); setLoginError(""); }}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin}>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Enter your administrator passcode to enable writing additions, editing entries, or changing sequencing coordinates.
                </p>

                <div className="mb-4">
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 tracking-wider">
                    Passcode Key
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="••••••••••••"
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#6366F1]"
                  />
                  {loginError && (
                    <p className="text-rose-450 text-[11px] mt-2 font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span>{loginError}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setLoginModalOpen(false); setLoginError(""); }}
                    className="w-1/2 bg-[#2D333D] hover:bg-[#2D333D]/70 text-slate-300 font-mono text-[11px] rounded-lg py-2.5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-[11px] font-semibold rounded-lg py-2.5 transition cursor-pointer"
                  >
                    Access Keys
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: SCRIPT EDITOR (ADD & EDIT) --- */}
      <AnimatePresence>
        {editorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="bg-[#1A1D23] border border-[#2D333D] rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden"
              id="script-editor-form-modal"
            >
              {/* Form Header */}
              <div className="bg-[#1A1D23] border-b border-[#2D333D] px-6 py-4 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] font-mono text-slate-200">
                  {editingScript ? "Configure Tool Coordinates" : "Register New AE Tool"}
                </h3>
                <button
                  onClick={() => setEditorModalOpen(false)}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditorSubmit} className="p-6 flex flex-col gap-5">
                
                {/* Visual Row: Name & Version & Category */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                      Script Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Layer Pre-comper Master"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                      Version String
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1.0"
                      value={formVersion}
                      onChange={(e) => setFormVersion(e.target.value)}
                      className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rigging, Keyframes"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>
                </div>

                {/* Description Text block */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                    What it does (Brief Description)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of functional outcomes for the rendering stack or client interaction."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                {/* Step-by-Step Instructions */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">
                      How to use it (Line per step)
                    </label>
                    <span className="text-[9px] text-slate-600 font-mono">Use a new line for each consecutive step</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="1. Select elements in active timeline&#10;2. Launch controller panel&#10;3. Set keyframe bake parameters"
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] font-mono transition-colors"
                  />
                </div>

                {/* Timeline item Creation output */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                    What does it create on the timeline?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creates a Null Object layer named 'Null Controller' linked as a parent tag."
                    value={formTimelineCreation}
                    onChange={(e) => setFormTimelineCreation(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                {/* Performance Limitations / System Constraints */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                    Known performance limitations & warnings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Only CC 2021+. Pre-existing position calculations will be contextually overwritten."
                    value={formLimitations}
                    onChange={(e) => setFormLimitations(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                {/* Typical Uses (Comma separated) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">
                      Typical Use cases (comma separated)
                    </label>
                    <span className="text-[9px] text-slate-600 font-mono">Separate items with commas</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Preparing complex compositions for Lottie export, Quick rigging setups, Layer automation workflow"
                    value={formTypicalUses}
                    onChange={(e) => setFormTypicalUses(e.target.value)}
                    className="w-full bg-[#14171C] text-[#D1D5DB] border border-[#2D333D] rounded-lg p-3 text-xs focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                {/* Storage download location URL */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 tracking-wider font-bold">
                    Download location URL (Dropbox or Github link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.dropbox.com/scl/fi/... or https://github.com/..."
                    value={formDownloadUrl}
                    onChange={(e) => setFormDownloadUrl(e.target.value)}
                    className="w-full bg-[#14171C] text-[#6366F1] border border-[#2D333D] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 border-t border-[#2D333D] pt-4">
                  <button
                    type="button"
                    onClick={() => setEditorModalOpen(false)}
                    className="w-1/2 bg-[#2D333D] hover:bg-[#2D333D]/70 text-slate-300 font-mono text-xs rounded-lg py-2.5 transition cursor-pointer"
                  >
                    Cancel Parameters
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs font-bold rounded-lg py-2.5 transition cursor-pointer"
                  >
                    Commit Configuration
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: CPANEL PHP DEPLOYMENT CENTER --- */}
      <AnimatePresence>
        {deployModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#1A1D23] border border-[#2D333D] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden my-6"
              id="cpanel-deployment-modal"
            >
              {/* Header */}
              <div className="bg-[#1A1D23] border-b border-[#2D333D] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#6366F1]" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] font-mono text-slate-200">
                    cPanel PHP Server Export Center
                  </h3>
                </div>
                <button
                  onClick={() => setDeployModalOpen(false)}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* content */}
              <div className="p-6 overflow-y-auto max-h-[580px] flex flex-col gap-6">
                
                <div className="bg-[#6366F1]/15 border border-[#6366F1]/30 p-5 rounded-xl">
                  <h4 className="text-xs font-bold text-[#6366F1] font-mono uppercase mb-1.5 tracking-wider">
                    How This Server Paradigm Works
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300">
                    To satisfy cPanel deployment without heavy node architectures or dynamic databases, this application generates standard static web properties. The admin actions sync natively by querying a tiny serverless handler, <code className="text-white bg-[#14171C] border border-[#2D333D] px-1.5 py-0.5 rounded">api.php</code>, which writes metadata directly into <code className="text-white bg-[#14171C] border border-[#2D333D] px-1.5 py-0.5 rounded">scripts.json</code>.
                  </p>
                </div>

                {/* Steps Section */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-3.5">
                    Simple 3-Step cPanel Upload Deployment
                  </h4>

                  <div className="flex flex-col gap-4 text-xs text-slate-300">
                    <div className="flex gap-3">
                      <span className="font-mono bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] font-bold rounded-lg w-6 h-6 flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">Generate Your Static Build</p>
                        <p className="text-slate-400 mt-1">
                          Open the terminal in this directory and execute <code className="bg-[#14171C] text-[#6366F1] border border-[#2D333D] px-2 py-0.5 rounded font-mono text-[10px]">npm run build</code>. This generates highly optimized static assets inside the <code className="bg-[#14171C] text-white px-2 py-0.5 border border-[#2D333D] rounded font-mono text-[10px]">out/</code> directory.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-mono bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] font-bold rounded-lg w-6 h-6 flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">Upload to File Manager</p>
                        <p className="text-slate-400 mt-1">
                          Upload the contents of the <code className="bg-[#14171C] text-white px-2 py-0.5 border border-[#2D333D] rounded font-mono text-[10px]">out/</code> directory directly to your public folder inside cPanel File Manager (e.g. <code className="bg-[#14171C] text-white px-2 py-0.5 border border-[#2D333D] rounded font-mono text-[10px]">public_html/scripts/</code>).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-mono bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] font-bold rounded-lg w-6 h-6 flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">Place API Scripts</p>
                        <p className="text-slate-400 mt-1 leading-relaxed">
                          Ensure <strong className="text-slate-200 font-semibold">api.php</strong> and <strong className="text-slate-200 font-semibold">scripts.json</strong> (provided below) are uploaded to the exact same folder level. Double check permissions: scripts.json requires write permission (usually <strong className="text-[#6366F1] font-mono">0644</strong> or <strong className="text-[#6366F1] font-mono">0775</strong> on cPanel).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* php script file copybox */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h5 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                      api.php (The PHP Controller)
                    </h5>
                    <button
                      onClick={() => triggerCopyNotification("apiphp", phpInstructionsCode)}
                      className="text-[10px] text-[#6366F1] hover:text-[#6366F1]/80 font-mono font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      {copiedText === "apiphp" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy PHP Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#14171C] text-slate-400 p-4 rounded-xl border border-[#2D333D] text-[11px] overflow-x-auto max-h-[160px] font-mono leading-relaxed">
                    {phpInstructionsCode}
                  </pre>
                </div>

                {/* json script file copybox */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h5 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                      scripts.json (Current Live Data File)
                    </h5>
                    <button
                      onClick={() => triggerCopyNotification("scriptsdb", JSON.stringify(scripts, null, 2))}
                      className="text-[10px] text-[#6366F1] hover:text-[#6366F1]/80 font-mono font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      {copiedText === "scriptsdb" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy raw scripts.json</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#14171C] text-slate-400 p-4 rounded-xl border border-[#2D333D] text-[11px] overflow-x-auto max-h-[165px] font-mono leading-relaxed font-bold">
                    {JSON.stringify(scripts, null, 2)}
                  </pre>
                </div>

                {/* Actions */}
                <div className="border-t border-[#2D333D] pt-5 flex gap-3">
                  <a
                    href="./api.php"
                    download="api.php"
                    className="w-1/2 bg-[#14171C] hover:bg-[#1A1D23] border border-[#2D333D] text-slate-200 font-mono text-[11px] font-semibold text-center rounded-lg py-2.5 transition cursor-pointer"
                  >
                    Download api.php
                  </a>
                  <a
                    href="./data/scripts.json"
                    download="scripts.json"
                    className="w-1/2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-[11px] font-semibold text-center rounded-lg py-2.5 transition border border-[#6366F1]/50 shadow-md cursor-pointer"
                  >
                    Download scripts.json
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
