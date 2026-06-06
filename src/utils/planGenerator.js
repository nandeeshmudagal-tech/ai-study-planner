// AI Risk Calculation
export function calculateRiskLevel(userData) {
    const difficultyPoints = { easy: 1, medium: 2, hard: 3 };
    const confidencePoints = { high: 1, medium: 2, low: 3 };
    const daysRemaining = calculateDaysRemaining(userData.deadline);
    const timePressure = daysRemaining <= 3 ? 3 : daysRemaining <= 7 ? 2 : 1;
    
    const riskScore = (
        difficultyPoints[userData.difficulty] + 
        confidencePoints[userData.confidence] + 
        timePressure
    ) / 3;
    
    if (riskScore >= 2.5) return 'Critical';
    if (riskScore >= 2.0) return 'High';
    if (riskScore >= 1.5) return 'Medium';
    return 'Low';
}

// AI Strategy Selection
export function selectStrategy(riskLevel, daysRemaining, userData) {
    const strategies = {
        'Critical': {
            name: 'Intensive Sprint',
            description: 'Focus on high-priority topics only. Use active recall and spaced repetition. Consider seeking help from tutors or study groups immediately.'
        },
        'High': {
            name: 'Accelerated Learning',
            description: 'Prioritize core concepts and practice problems. Break study sessions into focused 25-minute blocks with short breaks.'
        },
        'Medium': {
            name: 'Steady Progress',
            description: 'Balance between learning new material and reviewing existing knowledge. Use a mix of reading, practice, and self-testing.'
        },
        'Low': {
            name: 'Deep Learning',
            description: 'Take time to thoroughly understand concepts. Focus on building strong foundations and exploring topics in depth.'
        }
    };
    
    // Override based on specific conditions
    if (userData.difficulty === 'hard' && userData.confidence === 'low' && daysRemaining <= 5) {
        return {
            name: 'Emergency Focus Mode',
            description: 'Concentrate exclusively on exam-critical topics. Use memorization techniques for key formulas and concepts. Practice past papers intensively.'
        };
    }
    
    if (userData.confidence === 'low') {
        return {
            name: 'Confidence Building',
            description: 'Start with easier topics to build momentum. Gradually increase difficulty. Include regular review sessions to reinforce learning.'
        };
    }
    
    return strategies[riskLevel];
}

// Calculate days remaining
export function calculateDaysRemaining(deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays);
}

// Calculate priority based on deadline
export function calculatePriority(daysRemaining) {
    if (daysRemaining <= 3) {
        return 'High';
    } else if (daysRemaining <= 7) {
        return 'Medium';
    } else {
        return 'Low';
    }
}

// Generate warning message
export function generateWarning(riskLevel, daysRemaining, userData) {
    if (riskLevel === 'Critical' || riskLevel === 'High') {
        return {
            show: true,
            title: 'Study Time May Be Insufficient',
            message: `Based on your subject difficulty (${userData.difficulty}), confidence level (${userData.confidence}), and only ${daysRemaining} days remaining, you may need to increase your daily study hours or seek additional support.`
        };
    }
    return { show: false };
}

// Generate AI explanation
export function generateAIExplanation(riskLevel, strategy, daysRemaining, userData) {
    const explanations = [
        `Based on your ${userData.difficulty} difficulty rating and ${userData.confidence} confidence level, our AI has identified a ${riskLevel.toLowerCase()} risk level for your upcoming deadline.`,
        `With ${daysRemaining} days remaining and ${userData.studyHours} hours of daily study time, the "${strategy.name}" approach will optimize your learning efficiency.`,
        `This personalized strategy focuses on maximizing your retention while managing time pressure effectively.`
    ];
    
    return explanations.join(' ');
}

// Generate action plan
export function generateActionPlan(daysRemaining, userData) {
    const actionPlan = [];
    const today = new Date();
    const displayDays = Math.min(daysRemaining, 7);
    
    const focusAreas = [
        'Review core concepts and fundamentals',
        'Practice problem-solving techniques',
        'Take practice quizzes and tests',
        'Review and consolidate notes',
        'Focus on weak areas identified',
        'Final review and relaxation',
        'Light revision and rest before deadline'
    ];
    
    for (let i = 0; i < displayDays; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + i);
        
        const dayName = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : formatDayName(dayDate));
        const dateStr = formatShortDate(dayDate);
        const focus = focusAreas[i % focusAreas.length];
        
        actionPlan.push({
            day: `${dayName} (${dateStr})`,
            focus: focus,
            details: `Study for ${userData.studyHours} hours • ${userData.difficulty.charAt(0).toUpperCase() + userData.difficulty.slice(1)} intensity`
        });
    }
    
    if (daysRemaining > 7) {
        actionPlan.push({
            day: `Remaining ${daysRemaining - 7} days`,
            focus: 'Continue with daily study schedule',
            details: `${userData.studyHours} hours/day • Follow the established routine`
        });
    }
    
    return actionPlan;
}

// Generate full study plan
export function generateStudyPlan(userData) {
    const daysRemaining = calculateDaysRemaining(userData.deadline);
    const priority = calculatePriority(daysRemaining);
    const riskLevel = calculateRiskLevel(userData);
    const strategy = selectStrategy(riskLevel, daysRemaining, userData);
    const totalStudyHours = daysRemaining * userData.studyHours;
    const warning = generateWarning(riskLevel, daysRemaining, userData);
    const aiExplanation = generateAIExplanation(riskLevel, strategy, daysRemaining, userData);
    const actionPlan = generateActionPlan(daysRemaining, userData);
    
    return {
        daysRemaining,
        priority,
        riskLevel,
        strategy,
        totalStudyHours,
        warning,
        aiExplanation,
        actionPlan
    };
}

// Utility functions
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatShortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}