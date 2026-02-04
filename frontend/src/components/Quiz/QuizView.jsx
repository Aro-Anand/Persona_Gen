import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { QUESTIONS, MULTI_OPTIONS } from '../../data/questions';
import { OptionCard } from '../ui/OptionCard';
import { cn } from '../../lib/utils'; // Assuming this utility exists

const STEPS = [
    { id: 'goals', title: 'Goals & Prefs', description: 'Define your investment objectives' },
    { id: 'style', title: 'Style & Exp', description: 'Your approach to business' },
    { id: 'sectors', title: 'Market Focus', description: 'Where you want to play' },
    { id: 'structures', title: 'Final Details', description: 'Deal types and unique insights' }
];

const QuizView = ({ onSubmit, isLoading }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({
        risk_tolerance: 3,
        sectors: [],
        geo_scope: [],
        deal_structures: [],
        non_negotiables: []
    });

    const handleSelect = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleMultiSelect = (key, value) => {
        setAnswers(prev => {
            const current = prev[key] || [];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [key]: [...current, value] };
            }
        });
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
        else onSubmit(answers);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const renderSingleSelect = (key, question) => (
        <div key={key} className="mb-6">
            <h3 className="text-base font-semibold text-white mb-3">{question.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map(opt => (
                    <OptionCard
                        key={opt}
                        title={opt}
                        selected={answers[key] === opt}
                        onClick={() => handleSelect(key, opt)}
                    />
                ))}
            </div>
        </div>
    );

    const renderSlider = (key, question) => (
        <div key={key} className="mb-6 p-5 bg-slate-800/60 rounded-xl border border-slate-700">
            <h3 className="text-base font-semibold text-white mb-1">{question.label}</h3>
            <p className="text-sm text-slate-400 mb-4">{question.help}</p>

            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-400 whitespace-nowrap">Stable</span>
                <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={answers[key]}
                    onChange={(e) => handleSelect(key, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-sm font-medium text-slate-400 whitespace-nowrap">High Risk</span>
            </div>
            <div className="mt-3 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold">
                    Level: {answers[key]} / 5
                </span>
            </div>
        </div>
    );

    const renderMultiSelect = (key, question) => (
        <div key={key} className="mb-6">
            <h3 className="text-base font-semibold text-white mb-3">{question.label}</h3>
            <div className="flex flex-wrap gap-2">
                {question.options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleMultiSelect(key, opt)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                            answers[key]?.includes(opt)
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25"
                                : "bg-slate-800/50 text-slate-300 border-slate-600 hover:border-indigo-400 hover:bg-slate-700/50"
                        )}
                    >
                        {answers[key]?.includes(opt) && <span className="mr-2">✓</span>}
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-8">
            {/* Progress Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative z-10">
                    {STEPS.map((step, idx) => {
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 border-2",
                                    isActive ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/50 scale-110" :
                                        isCompleted ? "bg-emerald-500 text-white border-emerald-400" : "bg-slate-800 text-slate-400 border-slate-600"
                                )}>
                                    {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold uppercase tracking-wide hidden sm:block",
                                    isActive ? "text-indigo-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-700 -z-10" />

                    {/* Active Progress Bar */}
                    <motion.div
                        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 -z-10"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="shadow-2xl border-slate-700/50 bg-slate-900/80 backdrop-blur-md overflow-hidden">
                <CardContent className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-6 pb-4 border-b border-slate-700/50">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">{STEPS[currentStep].title}</h2>
                                <p className="text-slate-400 mt-1">{STEPS[currentStep].description}</p>
                            </div>

                            {/* Step 1: Goals */}
                            {currentStep === 0 && (
                                <>
                                    {renderSingleSelect("goal_primary", QUESTIONS.goal_primary)}
                                    {renderSingleSelect("time_horizon", QUESTIONS.time_horizon)}
                                    {renderSingleSelect("ticket_size", QUESTIONS.ticket_size)}
                                    {renderSlider("risk_tolerance", QUESTIONS.risk_tolerance)}
                                    {renderSingleSelect("involvement_level", QUESTIONS.involvement_level)}
                                    {renderSingleSelect("time_per_week", QUESTIONS.time_per_week)}
                                </>
                            )}

                            {/* Step 2: Style */}
                            {currentStep === 1 && (
                                <>
                                    {renderSingleSelect("reaction_style", QUESTIONS.reaction_style)}
                                    {renderSingleSelect("decision_style", QUESTIONS.decision_style)}
                                    {renderSingleSelect("partner_preference", QUESTIONS.partner_preference)}
                                    {renderSingleSelect("customer_segment", QUESTIONS.customer_segment)}
                                    {renderSingleSelect("brand_preference", QUESTIONS.brand_preference)}
                                    {renderSingleSelect("experience_level", QUESTIONS.experience_level)}
                                    {renderSingleSelect("priority_focus", QUESTIONS.priority_focus)}
                                </>
                            )}

                            {/* Step 3: Sectors */}
                            {currentStep === 2 && (
                                <>
                                    {renderMultiSelect("sectors", MULTI_OPTIONS.sectors)}
                                    {renderMultiSelect("geo_scope", MULTI_OPTIONS.geo_scope)}
                                </>
                            )}

                            {/* Step 4: Final */}
                            {currentStep === 3 && (
                                <>
                                    {renderMultiSelect("deal_structures", MULTI_OPTIONS.deal_structures)}
                                    {renderMultiSelect("non_negotiables", MULTI_OPTIONS.non_negotiables)}

                                    <div className="mb-6">
                                        <h3 className="text-base font-semibold text-white mb-2">Your Unique Insights</h3>
                                        <p className="text-sm text-slate-400 mb-3">What is one lesson you never want to forget?</p>
                                        <textarea
                                            className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl text-base text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                                            placeholder="Example: Never enter a business where I do not trust the numbers..."
                                            value={answers.key_lesson || ''}
                                            onChange={(e) => handleSelect("key_lesson", e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center mt-6 pt-4">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isLoading}
                    className={cn(
                        "text-slate-300 hover:text-white hover:bg-slate-800/80 px-6 py-2",
                        currentStep === 0 ? "opacity-0 pointer-events-none" : ""
                    )}
                >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>

                <Button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : currentStep === STEPS.length - 1 ? (
                        "Generate Persona"
                    ) : (
                        <>Next <ChevronRight className="w-5 h-5 ml-2" /></>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default QuizView;
