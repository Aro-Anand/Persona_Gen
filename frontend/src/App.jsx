import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import QuizView from './components/Quiz/QuizView';
import ResultView from './components/PersonaResult/ResultView';
import { Button } from './components/ui/Button';

// Default API URL (can be overridden by .env)
const API_URL = import.meta.env.VITE_API_URL || 'https://investor-dna-559078627637.asia-south1.run.app';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white font-sans selection:bg-indigo-500/30 selection:text-white flex flex-col">

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center min-h-[70vh] sm:min-h-[80vh] space-y-8 sm:space-y-12"
            >
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                    Investor DNA
                  </span>
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-300">
                  Demo App
                </h2>
              </div>

              {/* Start Analysis Button */}
              <div className="pt-4 sm:pt-8">
                <Button
                  size="lg"
                  className="rounded-full px-8 sm:px-12 text-base sm:text-lg h-12 sm:h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 border-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
                  onClick={startQuiz}
                >
                  Start Analysis
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
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
                <div className="max-w-4xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-500/30 text-sm sm:text-base">
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
    </div>
  );
}

export default App;
