import { GraduationCap, BookOpen, Zap, FileText, Code, Clock } from 'lucide-react';

export const ACADEMIC_LEVELS = [
    { label: 'High School', multiplier: 1.0 },
    { label: 'Undergraduate', multiplier: 1.3 },
    { label: 'Graduate (Master)', multiplier: 1.6 },
    { label: 'Doctorate (PhD)', multiplier: 2.0 },
];

export const ASSIGNMENT_TYPES = [
    { label: 'Essay / General', multiplier: 1.0, icon: FileText, unit: 'words' },
    { label: 'STEM Problems', multiplier: 1.2, icon: Zap, unit: 'problems' },
    { label: 'Software / Code', multiplier: 1.5, icon: Code, unit: 'project size' },
    { label: 'Thesis / Research', multiplier: 2.0, icon: BookOpen, unit: 'pages' },
];

export const DEADLINES = [
    { label: 'Flexible (> 7 Days)', multiplier: 1.0 },
    { label: 'Standard (3-7 Days)', multiplier: 1.2 },
    { label: 'Urgent (1-3 Days)', multiplier: 1.5 },
    { label: 'Emergency (< 24h)', multiplier: 2.0 },
];

export const PROJECT_SCALES = [
    { label: 'Mini-Script', value: 30, multiplier: 1.0 },
    { label: 'Small App', value: 80, multiplier: 2.5 },
    { label: 'Full Project', value: 200, multiplier: 6.0 },
    { label: 'Industrial', value: 500, multiplier: 15.0 },
];

export interface PricingParams {
    level: string;
    type: string;
    urgency: string;
    words?: number;
    problems?: number;
    pages?: number;
    projectScale?: string;
}

export const calculateEstimatedPrice = (params: PricingParams): number => {
    const levelMult = ACADEMIC_LEVELS.find(l => l.label === params.level)?.multiplier || 1.3;
    const typeObj = ASSIGNMENT_TYPES.find(t => t.label === params.type);
    const urgencyMult = DEADLINES.find(d => d.label === params.urgency)?.multiplier || 1.2;

    let basePrice = 0;

    if (params.type === 'Essay / General') {
        basePrice = ((params.words || 1000) / 250) * 8;
    } else if (params.type === 'STEM Problems') {
        basePrice = (params.problems || 5) * 10;
    } else if (params.type === 'Software / Code') {
        const scale = PROJECT_SCALES.find(s => s.label === params.projectScale) || PROJECT_SCALES[0];
        basePrice = scale.value;
    } else if (params.type === 'Thesis / Research') {
        basePrice = (params.pages || 10) * 25;
    }

    return Math.round(basePrice * levelMult * urgencyMult);
};
