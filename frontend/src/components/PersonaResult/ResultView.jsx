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
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-full mb-4 ring-1 ring-indigo-500/30">
                    <Target className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Your Investor Persona
                    </span>
                </h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Based on your unique profile, here is a professional analysis of your investment character.
                </p>
            </motion.div>

            {/* Top Section: Summary & Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Card */}
                <motion.div variants={item} className="md:col-span-2">
                    <Card className="h-full border-t-4 border-t-indigo-500 shadow-2xl bg-slate-900/60 backdrop-blur-md border-slate-700/50 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {data.persona_tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold text-sm border border-indigo-500/20 shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4">Executive Summary</h3>
                            <p className="text-lg leading-relaxed text-slate-300 mb-8">
                                {data.persona_summary}
                            </p>

                            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
                                <h4 className="flex items-center text-md font-bold text-white mb-3">
                                    <Lightbulb className="w-5 h-5 mr-2 text-indigo-400" />
                                    Investment Style
                                </h4>
                                <p className="text-slate-300 italic">
                                    "{data.investment_style}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Radar Chart */}
                <motion.div variants={item} className="md:col-span-1">
                    <Card className="h-full flex flex-col justify-center items-center p-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-2xl">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/30">Profile Matrix</h4>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Investor Profile"
                                        dataKey="A"
                                        stroke="#818cf8"
                                        fill="#6366f1"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-xs text-center text-slate-500 mt-2 font-medium">
                            Visual parameters from response
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <motion.div variants={item}>
                    <Card className="h-full border-l-4 border-l-emerald-500 bg-slate-900/60 backdrop-blur-md border-slate-700/50 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-400">
                                <CheckCircle className="w-6 h-6 mr-2" /> Key Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {data.strengths.map((str, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 mr-3 shrink-0" />
                                        <span className="text-slate-300">{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Considerations */}
                <motion.div variants={item}>
                    <Card className="h-full border-l-4 border-l-amber-500 bg-slate-900/60 backdrop-blur-md border-slate-700/50 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-amber-400">
                                <AlertTriangle className="w-6 h-6 mr-2" /> Considerations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {data.considerations.map((con, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-3 shrink-0" />
                                        <span className="text-slate-300">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recommendations */}
            <motion.div variants={item} className="pt-4">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    Suggested Opportunities
                    <span className="ml-3 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">AI Matches</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.recommended_opportunities.map((opp, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-indigo-500/10 transition-all border-b-4 border-b-indigo-500"
                        >
                            <div className="font-bold text-lg text-indigo-400 mb-2">#{i + 1}</div>
                            <p className="text-slate-300 leading-relaxed">{opp}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={item} className="flex justify-center gap-4 pt-12 border-t border-slate-800">
                <Button
                    variant="outline"
                    onClick={onReset}
                    size="lg"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    Start New Quiz
                </Button>
                <Button
                    variant="primary"
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 border-0"
                    onClick={() => window.print()}
                >
                    <Download className="w-4 h-4" /> Save Profile
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default ResultView;
