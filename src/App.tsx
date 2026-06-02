/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, Activity, Play, Calendar, Cpu, GraduationCap, MessagesSquare, RefreshCw, Send, AlertTriangle, FileText } from 'lucide-react';
import SpeechPlayground from './components/SpeechPlayground';
import MetricsPanel from './components/MetricsPanel';
import ColabCurriculum from './components/ColabCurriculum';
import GanttChart from './components/GanttChart';
import ThesisChapters from './components/ThesisChapters';

interface ChatMessage {
  sender: 'student' | 'advisor';
  text: string;
  time: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'thesis' | 'colab' | 'training' | 'advisor' | 'governance'>('thesis');
  
  // Chat state helpers for Academic Advisor
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'advisor',
      text: "Selam! I am Dr. Yaregal Assabie, your academic thesis advisor. Ask me anything about CTC Joint decoders, morphologic NLP challenges in Amharic scripts, or how to design Cascaded vs. End-to-End Speech language pipelines. Let's make your Addis Ababa University defense outstanding!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Quick prompt questions selectors
  const promptSuggestions = [
    "What is the core trade-off between Cascaded and End-to-End Amharic Speech SLU?",
    "Explain standard character-level CTC Acoustic Decoding for low-resource languages.",
    "How to manage extreme data scarcity when training deep neural nets on Amharic conversational data?",
    "How are CER vs WER metrics calculated mathematically in continuous ASR systems?"
  ];

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    // Append student message
    const rawTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentMessage: ChatMessage = { sender: 'student', text: query, time: rawTime };
    setChatHistory((prev) => [...prev, studentMessage]);
    
    if (!textToSend) {
      setChatInput('');
    }
    
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/academic-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await response.json();
      
      const advisorMessage: ChatMessage = {
        sender: 'advisor',
        text: data.text || "I was unable to compile the advice. Let's adjust our model framework parameters.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, advisorMessage]);
    } catch (err) {
      console.error('Advisor query execution failed:', err);
      // Fail gracefully with simulated response if server connection fails or is offline
      const genericBackup = "I am currently adjusting the computing layers. To configure live evaluations, verify process.env.GEMINI_API_KEY in your cloud secrets. Let's outline the Wav2Vec transformer encoder maps in our next session!";
      const advisorMessage: ChatMessage = {
        sender: 'advisor',
        text: genericBackup,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, advisorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col antialiased font-sans" id="app-root">
      
      {/* Top Academic Institution Header Banner */}
      <header className="bg-indigo-950 text-white border-b-4 border-amber-500 py-6 px-4 md:px-8 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            {/* Custom styled emblem matching Addis Ababa University colors */}
            <div className="w-16 h-16 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              <span className="font-bold text-lg text-indigo-900 font-mono flex flex-col items-center justify-center leading-none">
                <GraduationCap className="w-8 h-8 text-indigo-900" />
                <span className="text-[7px] font-bold mt-1 text-center">AAU • 1950</span>
              </span>
            </div>

            <div>
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                Addis Ababa University • Department of Computer Science
              </span>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white mt-1 leading-tight font-sans">
                Amharic SLU Research Lab & Colab Curriculum
              </h1>
              <p className="text-xs text-indigo-200 mt-1 uppercase font-semibold font-mono">
                Thesis: "Speech-Based Amharic Conversational Agent for Customer Service in Financial Institutions"
              </p>
            </div>
          </div>

          {/* Student / Author signature board */}
          <div className="bg-indigo-900/40 border border-indigo-800 p-3 rounded-xl text-center md:text-right text-[11px] font-mono leading-relaxed max-w-xs text-indigo-100/90 shadow-sm shrink-0">
            <div><span className="text-amber-400 font-bold font-sans">Student:</span> Dagem Kasahun Zewdie</div>
            <div><span className="text-indigo-300 font-sans">ID:</span> GSE/6437/16</div>
            <div><span className="text-amber-400 font-bold font-sans">Advisor:</span> Dr. Yaregal Assabie</div>
          </div>
        </div>
      </header>

      {/* Primary Navigation Tabs Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-1 py-2 font-sans">
          <button
            id="nav-tab-playground"
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Amharic Voice Sandbox
          </button>

          <button
            id="nav-tab-thesis"
            onClick={() => setActiveTab('thesis')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'thesis'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Thesis Draft & Contribution Diagram
          </button>

          <button
            id="nav-tab-colab"
            onClick={() => setActiveTab('colab')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'colab'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Jupyter Colab Modules
          </button>

          <button
            id="nav-tab-training"
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'training'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Hyperparameter Training
          </button>

          <button
            id="nav-tab-advisor"
            onClick={() => setActiveTab('advisor')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <MessagesSquare className="w-3.5 h-3.5" />
            AI Thesis Advisor
          </button>

          <button
            id="nav-tab-governance"
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none cursor-pointer ${
              activeTab === 'governance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Governance Timeline
          </button>
        </div>
      </section>

      {/* Main Container Render Dashboard Slots */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300">
        
        {activeTab === 'playground' && (
          <div className="space-y-6 animate-fade-in-up">
            <SpeechPlayground />
          </div>
        )}

        {activeTab === 'thesis' && (
          <div className="space-y-6 animate-fade-in-up">
            <ThesisChapters />
          </div>
        )}

        {activeTab === 'colab' && (
          <div className="space-y-6 animate-fade-in-up">
            <ColabCurriculum />
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6 animate-fade-in-up">
            <MetricsPanel />
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="space-y-6 animate-fade-in-up">
            <GanttChart />
          </div>
        )}

        {activeTab === 'advisor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up id-advisor-tab">
            
            {/* Advice panel layout triggers */}
            <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px] justify-between">
              
              {/* Chat log header information */}
              <div className="bg-indigo-950/5 border-b border-gray-150 p-4 shrink-0">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                  Thesis Defense Advisor • Real-time Consultation Console
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Dual NLP Track Evaluators (Cascaded vs. E2E SLU)</p>
              </div>

              {/* Chat log messages list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] bg-gray-50/20">
                {chatHistory.map((msg, index) => {
                  const isAdvisor = msg.sender === 'advisor';
                  return (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[85%] ${isAdvisor ? 'self-start' : 'self-end ml-auto'}`}
                    >
                      <span className="text-[9px] text-gray-400 font-mono mb-1 px-1 block self-start">
                        {isAdvisor ? "Dr. Yaregal Assabie • Advisor" : "Dagem (Student)"} • {msg.time}
                      </span>
                      <div
                        className={`rounded-xl px-4 py-2.5 text-xs leading-relaxed font-sans shadow-xs border whitespace-pre-line ${
                          isAdvisor
                            ? 'bg-white border-gray-200 text-gray-800'
                            : 'bg-indigo-600 border-indigo-700 text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-mono bg-indigo-50 border border-indigo-150 py-1.5 px-3 rounded-lg w-max animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Advisor reviewing mathematical gradients...
                  </div>
                )}
              </div>

              {/* Chat inputs footer */}
              <div className="p-4 border-t border-gray-150 bg-white flex gap-3.5 items-center shrink-0">
                <input
                  type="text"
                  placeholder="Ask a technical computer science speech question..."
                  className="flex-1 border border-gray-200/80 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
                  value={chatInput}
                  disabled={isChatLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                  id="advisor-chat-input-box"
                />
                
                <button
                  id="btn-send-advisor-chat"
                  onClick={() => handleSendChat()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 inline-flex items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick selectors card sidebar */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-5">
                <h4 className="text-xs font-bold text-indigo-950 font-sans tracking-wide uppercase mb-3 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                  <MessagesSquare className="w-4 h-4 text-indigo-500" />
                  Advisor Prompt Recommendations
                </h4>

                <div className="space-y-2.5">
                  {promptSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      id={`advisor-suggestion-btn-${i}`}
                      onClick={() => handleSendChat(suggestion)}
                      disabled={isChatLoading}
                      className="w-full text-left p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 bg-gray-50/50 hover:bg-indigo-50/25 text-[11px] text-gray-600 hover:text-indigo-950 transition-all leading-normal text-wrap select-none cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-150 rounded-2xl text-xs text-amber-950 flex gap-3.5 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block text-amber-900 mb-0.5">Low-Resource Accent Bias Warning</span>
                  Continuous customer utterances recorded over physical cell phone networks introduce massive noise patterns. Acoustic models must include robust <strong>specaugment regularization masks</strong>.
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding copyright */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-[10px] text-gray-500 font-mono mt-auto select-none shrink-0">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Addis Ababa University • Department of Computer Science • Master is Thesis Lab Portal</p>
          <p className="mt-1 text-gray-400">
            Authored by Dagem Kasahun Zewdie under supervision of Advisor Dr. Yaregal Assabie
          </p>
        </div>
      </footer>

    </div>
  );
}
