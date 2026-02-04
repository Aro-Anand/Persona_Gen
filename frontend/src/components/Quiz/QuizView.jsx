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
        <div key={key} className="mb-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 block">{question.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map(opt => (
                    <OptionCard
                        key={opt}
                        title={opt}
                        selected={answers[key] === opt}
                        onClick={() => handleSelect(key, opt)}
                        className="h-full"
                    />
                ))}
            </div>
        </div>
    );

    const renderSlider = (key, question) => (
        <div key={key} className="mb-10 p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{question.label}</h3>
            <p className="text-sm text-slate-500 mb-6">{question.help}</p>

            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-500">Stable</span>
                <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={answers[key]}
                    onChange={(e) => handleSelect(key, parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-medium text-slate-500">High Risk</span>
            </div>
            <div className="mt-4 text-center">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold">
                    Level: {answers[key]} / 5
                </span>
            </div>
        </div>
    );

    const renderMultiSelect = (key, question) => (
        <div key={key} className="mb-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">{question.label}</h3>
            <div className="flex flex-wrap gap-2">
                {question.options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleMultiSelect(key, opt)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            answers[key]?.includes(opt)
                                ? "bg-primary text-white border-primary shadow-md transform scale-105"
                                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50"
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
        <div className="max-w-4xl mx-auto pb-20">
            {/* Progress Stepper */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative z-10">
                    {STEPS.map((step, idx) => {
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-300 border-2",
                                    isActive ? "bg-primary text-white border-primary shadow-lg scale-110" :
                                        isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-400 border-slate-200"
                                )}>
                                    {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span className={cn("text-xs font-semibold uppercase tracking-wider hidden md:block", isActive ? "text-primary" : "text-slate-400")}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-10" />

                    {/* Active Progress Bar */}
                    <motion.div
                        className="absolute top-5 left-0 h-1 bg-primary -z-10"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="shadow-xl border-slate-200/60 min-h-[500px]">
                <CardContent className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">{STEPS[currentStep].title}</h2>
                                <p className="text-slate-500">{STEPS[currentStep].description}</p>
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

                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Unique Insights</h3>
                                        <p className="text-sm text-slate-500 mb-3">What is one lesson you never want to forget?</p>
                                        <textarea
                                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
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
            <div className="flex justify-between items-center mt-8">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isLoading}
                    className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="flex gap-2">
                    {/* Button Debugging/Next */}
                    <Button onClick={nextStep} disabled={isLoading} className="w-32">
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : currentStep === STEPS.length - 1 ? (
                            "Generate"
                        ) : (
                            <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuizView;
