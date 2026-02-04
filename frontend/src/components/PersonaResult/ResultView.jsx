import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const ResultView = ({ data, inputData, onReset }) => {
    // Calculate chart data from inputs
    const chartData = [
        { subject: 'Risk', A: inputData.risk_tolerance || 3, fullMark: 5 },
        { subject: 'Time', A: inputData.time_horizon?.includes('7') ? 5 : inputData.time_horizon?.includes('4') ? 4 : 2, fullMark: 5 },
        { subject: 'Active', A: inputData.involvement_level?.includes('Operator') ? 5 : inputData.involvement_level?.includes('Co pilot') ? 3 : 1, fullMark: 5 },
        { subject: 'Capital', A: inputData.ticket_size?.includes('Above') ? 5 : inputData.ticket_size?.includes('50') ? 4 : inputData.ticket_size?.includes('15') ? 3 : 2, fullMark: 5 },
        { subject: 'Exp.', A: inputData.experience_level?.includes('seasoned') ? 5 : inputData.experience_level?.includes('invested') ? 4 : inputData.experience_level?.includes('small') ? 3 : 1, fullMark: 5 },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-8 pb-12"
        >
            {/* Header Section */}
            <motion.div variants={item} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Your Investor Persona</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Based on your unique profile, here is a professional analysis of your investment character.
                </p>
            </motion.div>

            {/* Top Section: Summary & Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Card */}
                <motion.div variants={item} className="md:col-span-2">
                    <Card className="h-full border-t-4 border-t-primary shadow-lg overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {data.persona_tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-1.5 rounded-full bg-indigo-50 text-primary font-semibold text-sm border border-indigo-100 shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Executive Summary</h3>
                            <p className="text-lg leading-relaxed text-slate-600 mb-8">
                                {data.persona_summary}
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h4 className="flex items-center text-md font-bold text-slate-900 mb-3">
                                    <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                                    Investment Style
                                </h4>
                                <p className="text-slate-700 italic">
                                    "{data.investment_style}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Radar Chart */}
                <motion.div variants={item} className="md:col-span-1">
                    <Card className="h-full flex flex-col justify-center items-center p-4 bg-white shadow-md">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Profile Matrix</h4>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Investor Profile"
                                        dataKey="A"
                                        stroke="#4f46e5"
                                        fill="#4f46e5"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-xs text-center text-slate-400 mt-2">
                            Visual representation of your quiz parameters
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <motion.div variants={item}>
                    <Card className="h-full border-l-4 border-l-emerald-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-700">
                                <CheckCircle className="w-6 h-6 mr-2" /> Key Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {data.strengths.map((str, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 mr-3 shrink-0" />
                                        <span className="text-slate-700">{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Considerations */}
                <motion.div variants={item}>
                    <Card className="h-full border-l-4 border-l-amber-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-amber-700">
                                <AlertTriangle className="w-6 h-6 mr-2" /> Considerations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {data.considerations.map((con, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-3 shrink-0" />
                                        <span className="text-slate-700">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recommendations */}
            <motion.div variants={item} className="pt-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    Suggested Opportunities
                    <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">AI Matches</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.recommended_opportunities.map((opp, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all border-b-4 border-b-primary"
                        >
                            <div className="font-bold text-lg text-slate-800 mb-2">#{i + 1}</div>
                            <p className="text-slate-600">{opp}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={item} className="flex justify-center gap-4 pt-8 border-t border-slate-200">
                <Button variant="outline" onClick={onReset} size="lg">
                    Start New Quiz
                </Button>
                <Button variant="primary" size="lg" className="gap-2" onClick={() => window.print()}>
                    <Download className="w-4 h-4" /> Save Profile
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default ResultView;
