import React, { useState } from 'react';
import { generateStudyPlan, formatDate } from './utils/planGenerator';
import { supabase } from './lib/supabase';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    subjectName: '',
    deadline: '',
    difficulty: '',
    confidence: '',
    studyHours: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [studyPlan, setStudyPlan] = useState(null);

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.subjectName.trim()) {
          newErrors.subjectName = 'Please enter a subject name';
        }
        if (!formData.deadline) {
          newErrors.deadline = 'Please select a deadline';
        } else {
          const deadlineDate = new Date(formData.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (deadlineDate <= today) {
            newErrors.deadline = 'Deadline must be in the future';
          }
        }
        break;
      case 2:
        if (!formData.difficulty) {
          newErrors.difficulty = 'Please select a difficulty level';
        }
        break;
      case 3:
        if (!formData.confidence) {
          newErrors.confidence = 'Please select your confidence level';
        }
        break;
      case 4:
        if (!formData.studyHours) {
          newErrors.studyHours = 'Please select your daily study hours';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        generatePlan();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const generatePlan = async () => {
    setIsLoading(true);
    setLoadingStep(0);
    
    // Simulate AI processing steps
    const steps = [
      { icon: '📊', text: 'Analyzing your requirements...' },
      { icon: '🧠', text: 'Calculating optimal strategy...' },
      { icon: '📅', text: 'Creating personalized schedule...' },
      { icon: '✨', text: 'Finalizing your study plan...' }
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    const plan = generateStudyPlan(formData);

const { error } = await supabase
  .from('study_plans')
  .insert([
    {
      subject_name: formData.subjectName,
      deadline: formData.deadline,
      difficulty: formData.difficulty,
      confidence: formData.confidence,
      study_hours: Number(formData.studyHours)
    }
  ]);

if (error) {
  console.error('Error saving study plan:', error.message);
} else {
  console.log('Study plan saved to Supabase successfully');
}

setStudyPlan(plan);
setIsLoading(false);
setCurrentStep(5);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData({
      subjectName: '',
      deadline: '',
      difficulty: '',
      confidence: '',
      studyHours: ''
    });
    setErrors({});
    setStudyPlan(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getRiskBadgeClass = (risk) => {
    const classes = {
      'Critical': 'risk-critical',
      'High': 'risk-high',
      'Medium': 'risk-medium',
      'Low': 'risk-low'
    };
    return classes[risk] || 'risk-medium';
  };

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div className="progress-steps">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            {currentStep > step ? '✓' : step}
          </div>
        ))}
      </div>
    </div>
  );

  const renderScreen1 = () => (
    <div className={`screen ${currentStep === 1 ? 'active' : ''}`}>
      <div className="screen-content">
        <div className="logo">📚</div>
        <h1>AI Study Planner</h1>
        <p className="subtitle">Let's create your personalized study plan</p>
        
        <div className="form-group">
          <label htmlFor="subjectName">What subject are you studying?</label>
          <input
            type="text"
            id="subjectName"
            placeholder="e.g., Mathematics, Physics, History..."
            value={formData.subjectName}
            onChange={(e) => handleInputChange('subjectName', e.target.value)}
            className={errors.subjectName ? 'error' : ''}
          />
          <span className="error-message">{errors.subjectName || ''}</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">When is your exam/deadline?</label>
          <input
            type="date"
            id="deadline"
            min={getTodayDate()}
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            className={errors.deadline ? 'error' : ''}
          />
          <span className="error-message">{errors.deadline || ''}</span>
        </div>
        
        <button className="btn btn-primary btn-large" onClick={handleNext}>
          Continue →
        </button>
      </div>
    </div>
  );

  const renderScreen2 = () => (
    <div className={`screen ${currentStep === 2 ? 'active' : ''}`}>
      <div className="screen-content">
        <h2>Subject Difficulty</h2>
        <p className="subtitle">How challenging is this subject for you?</p>
        
        <div className="form-group">
          <div className="radio-group">
            {[
              { value: 'easy', label: 'Easy', desc: 'I understand most concepts quickly' },
              { value: 'medium', label: 'Medium', desc: 'Some topics require extra practice' },
              { value: 'hard', label: 'Hard', desc: 'I find this subject very challenging' }
            ].map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={formData.difficulty === option.value}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                />
                <span className="radio-custom"></span>
                <div>
                  <span className="radio-label">{option.label}</span>
                  <span className="radio-desc">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
          <span className="error-message">{errors.difficulty || ''}</span>
        </div>
        
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreen3 = () => (
    <div className={`screen ${currentStep === 3 ? 'active' : ''}`}>
      <div className="screen-content">
        <h2>Confidence Level</h2>
        <p className="subtitle">How confident do you feel about the material?</p>
        
        <div className="form-group">
          <div className="radio-group">
            {[
              { value: 'high', label: 'High Confidence', desc: 'I feel well-prepared and ready' },
              { value: 'medium', label: 'Medium Confidence', desc: 'I know some areas need work' },
              { value: 'low', label: 'Low Confidence', desc: 'I need significant preparation' }
            ].map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="confidence"
                  value={option.value}
                  checked={formData.confidence === option.value}
                  onChange={(e) => handleInputChange('confidence', e.target.value)}
                />
                <span className="radio-custom"></span>
                <div>
                  <span className="radio-label">{option.label}</span>
                  <span className="radio-desc">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
          <span className="error-message">{errors.confidence || ''}</span>
        </div>
        
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreen4 = () => (
    <div className={`screen ${currentStep === 4 ? 'active' : ''}`}>
      <div className="screen-content">
        <h2>Daily Study Time</h2>
        <p className="subtitle">How many hours can you study each day?</p>
        
        <div className="form-group">
          <div className="radio-group">
            {[
              { value: '1', label: '1 Hour', desc: 'Light study schedule' },
              { value: '2', label: '2 Hours', desc: 'Moderate study schedule' },
              { value: '3', label: '3 Hours', desc: 'Intensive study schedule' },
              { value: '4', label: '4+ Hours', desc: 'Very intensive schedule' }
            ].map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="studyHours"
                  value={option.value}
                  checked={formData.studyHours === option.value}
                  onChange={(e) => handleInputChange('studyHours', e.target.value)}
                />
                <span className="radio-custom"></span>
                <div>
                  <span className="radio-label">{option.label}</span>
                  <span className="radio-desc">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
          <span className="error-message">{errors.studyHours || ''}</span>
        </div>
        
        <div className="summary-card">
          <h4>📋 Your Input Summary</h4>
          <div className="summary-item">
            <span className="label">Subject:</span>
            <span className="value">{formData.subjectName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Deadline:</span>
            <span className="value">{formatDate(formData.deadline)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Difficulty:</span>
            <span className="value" style={{textTransform: 'capitalize'}}>{formData.difficulty}</span>
          </div>
          <div className="summary-item">
            <span className="label">Confidence:</span>
            <span className="value" style={{textTransform: 'capitalize'}}>{formData.confidence}</span>
          </div>
        </div>
        
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            Generate My Plan ✨
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingScreen = () => (
    <div className={`screen ${isLoading ? 'active' : ''}`}>
      <div className="loading-content">
        <div className="ai-loader">
          <div className="loader-brain">🧠</div>
          <div className="loader-pulse"></div>
        </div>
        <h2>AI is Creating Your Plan</h2>
        <p className="subtitle">Please wait while we analyze your requirements</p>
        
        <div className="loading-steps">
          {[
            { icon: '📊', text: 'Analyzing your requirements...' },
            { icon: '🧠', text: 'Calculating optimal strategy...' },
            { icon: '📅', text: 'Creating personalized schedule...' },
            { icon: '✨', text: 'Finalizing your study plan...' }
          ].map((step, index) => (
            <div
              key={index}
              className={`loading-step ${index === loadingStep ? 'active' : ''} ${index < loadingStep ? 'completed' : ''}`}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-text">{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResultsScreen = () => {
    // Early return if studyPlan is null to prevent crashes
    if (!studyPlan || currentStep !== 5) {
      return null;
    }

    return (
      <div className="screen active">
        <div className="screen-content">
          <div className="success-icon">🎉</div>
          <h2>Your Study Plan is Ready!</h2>
          
          <div className="ethics-notice">
            <h4>🎓 Academic Integrity Note</h4>
            <p>This AI-generated plan is designed to support your learning journey. Remember: genuine understanding comes from your own effort and engagement with the material.</p>
            <p>Use this as a guide, but make sure you're actively learning and not just following a schedule.</p>
          </div>
          
          <div className="plan-container">
            <div className="plan-header">
              <h3>📚 {formData.subjectName}</h3>
              <p>Exam Date: {formatDate(formData.deadline)}</p>
              <div className="plan-summary">
                <div className="plan-summary-item">
                  <div className="number">{studyPlan.daysRemaining || 0}</div>
                  <div className="label">Days Left</div>
                </div>
                <div className="plan-summary-item">
                  <div className="number">{studyPlan.totalStudyHours || 0}</div>
                  <div className="label">Total Hours</div>
                </div>
                <div className="plan-summary-item">
                  <div className="number">{formData.studyHours}h</div>
                  <div className="label">Per Day</div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <div className="section-header">
                <span className="section-icon">⚠️</span>
                <span className="section-title">Risk Assessment</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>Risk Level:</span>
                <span className={`risk-badge ${getRiskBadgeClass(studyPlan.riskLevel || 'Medium')}`}>
                  {studyPlan.riskLevel || 'Medium'}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                <span>Priority:</span>
                <span className={`priority-badge priority-${(studyPlan.priority || 'medium').toLowerCase()}`}>
                  {studyPlan.priority || 'Medium'}
                </span>
              </div>
            </div>
            
            {studyPlan.warning && studyPlan.warning.show && (
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                <div className="warning-content">
                  <h4>{studyPlan.warning.title || 'Warning'}</h4>
                  <p>{studyPlan.warning.message || 'Please review your study plan.'}</p>
                </div>
              </div>
            )}
            
            {studyPlan.strategy && (
              <div className="strategy-card">
                <h4>🎯 Recommended Strategy</h4>
                <div className="strategy-name">{studyPlan.strategy.name || 'Custom Strategy'}</div>
                <div className="strategy-reason">{studyPlan.strategy.description || 'Follow your personalized study approach.'}</div>
              </div>
            )}
            
            <div className="dashboard-section">
              <div className="section-header">
                <span className="section-icon">🤖</span>
                <span className="section-title">AI Analysis</span>
              </div>
              <p style={{lineHeight: '1.6', color: '#495057'}}>{studyPlan.aiExplanation || 'Your personalized study plan has been generated based on your inputs.'}</p>
            </div>
            
            <div className="dashboard-section">
              <div className="section-header">
                <span className="section-icon">📅</span>
                <span className="section-title">Your Action Plan</span>
              </div>
              {studyPlan.actionPlan && studyPlan.actionPlan.length > 0 ? (
                studyPlan.actionPlan.map((item, index) => (
                  <div key={index} className="action-item">
                    <div className="action-day">{item.day || `Day ${index + 1}`}</div>
                    <div className="action-focus">{item.focus || 'Study session'}</div>
                    <div className="action-details">{item.details || 'Focus on your materials'}</div>
                  </div>
                ))
              ) : (
                <div className="action-item">
                  <div className="action-day">Getting Started</div>
                  <div className="action-focus">Begin your study journey</div>
                  <div className="action-details">Follow the recommended strategy above</div>
                </div>
              )}
            </div>
            
            <div className="tips-section">
              <h4>💡 Study Tips</h4>
              <ul>
                <li>Take regular breaks using the Pomodoro technique (25 min study, 5 min break)</li>
                <li>Review material before sleeping for better retention</li>
                <li>Use active recall: test yourself instead of re-reading</li>
                <li>Stay hydrated and get enough sleep</li>
                <li>Find a quiet, dedicated study space</li>
              </ul>
            </div>
          </div>
          
          <button className="btn btn-primary btn-large" onClick={handleStartOver}>
            Create New Plan 📚
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {!isLoading && renderProgressBar()}
      {renderScreen1()}
      {renderScreen2()}
      {renderScreen3()}
      {renderScreen4()}
      {renderLoadingScreen()}
      {renderResultsScreen()}
    </div>
  );
}

export default App;