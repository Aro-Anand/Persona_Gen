import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import QuizView from './components/Quiz/QuizView';
import ResultView from './components/PersonaResult/ResultView';
import { Button } from './components/ui/Button';

// Default API URL (can be overridden by .env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [view, setView] = useState('intro'); // intro, quiz, result
  const [isLoading, setIsLoading] = useState(false);
  const [personaResult, setPersonaResult] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [error, setError] = useState(null);

  const startQuiz = () => setView('quiz');

  const handleQuizSubmit = async (answers) => {
    setIsLoading(true);
    setInputData(answers);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/generate-persona`, answers);
      setPersonaResult(response.data);
      setView('result');
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to generate persona. Please ensure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setPersonaResult(null);
    setInputData(null);
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('intro')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Frantiger
            </span>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://frantiger.com', '_blank')}>
              Platform
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-20 space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                ✨ AI-Powered Investment Analysis
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
                Discover Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">
                  Investor Persona
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Take our comprehensive quiz to uncover your investment style, strengths, and ideal opportunities using advanced AI analysis.
              </p>

              <div className="flex gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-indigo-200 shadow-xl" onClick={startQuiz}>
                  Start Analysis
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14">
                  View Sample
                </Button>
              </div>

              <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl opacity-80">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="font-bold mb-2">AI Analysis</h3>
                  <p className="text-slate-500 text-sm">Powered by GPT-4 and Claude for nuanced insights.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-bold mb-2">Data Driven</h3>
                  <p className="text-slate-500 text-sm">Based on 20+ data points from your preferences.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold mb-2">Tailored Matches</h3>
                  <p className="text-slate-500 text-sm">Get specific opportunity recommendations.</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error && (
                <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {error}
                </div>
              )}
              <QuizView onSubmit={handleQuizSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {view === 'result' && personaResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultView
                data={personaResult}
                inputData={inputData}
                onReset={resetQuiz}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>© 2024 Frantiger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
