export type AlertSeverity = 'RED' | 'YELLOW' | 'GREEN';

export interface EmergencyAlert {
  severity: AlertSeverity;
  message: string;
  reason: string;
  action: string;
  advice: string[];
  emergencyNumbers?: string[];
}

export interface PatientData {
  temperature: number;
  age: number;
  symptoms: string[];
  comorbidities: string[];
  duration: number;
  compliance?: number;
}

const CRITICAL_SYMPTOMS = [
  'difficulty breathing', 'confusion', 'convulsions', 'seizures', 
  'unconscious', 'severe rash', 'low blood pressure', 'sepsis',
  'chest pain', 'severe headache', 'stiff neck', 'vomiting blood'
];

const WARNING_SYMPTOMS = [
  'severe pain', 'rash', 'persistent vomiting', 'drowsiness',
  'dehydration', 'severe chills', 'weakness', 'dizziness'
];

export function checkEmergencySeverity(data: PatientData): EmergencyAlert {
  const { temperature, age, symptoms, comorbidities, duration } = data;
  
  // RED ALERT CONDITIONS
  if (temperature >= 40.0) {
    return {
      severity: 'RED',
      message: '🚨 EMERGENCY ALERT – Seek Medical Help NOW',
      reason: `Critical fever: ${temperature}°C`,
      action: '📞 Call Ambulance (108/102)',
      advice: [
        'Call emergency services immediately',
        'Remove excess clothing',
        'Apply cool, damp cloths to forehead',
        'Do not give medication without medical advice',
        'Monitor breathing and consciousness'
      ],
      emergencyNumbers: ['108', '102']
    };
  }

  if (symptoms.some(s => CRITICAL_SYMPTOMS.some(cs => s.toLowerCase().includes(cs)))) {
    const criticalSymptom = symptoms.find(s => CRITICAL_SYMPTOMS.some(cs => s.toLowerCase().includes(cs)));
    return {
      severity: 'RED',
      message: '🚨 EMERGENCY ALERT – Seek Medical Help NOW',
      reason: `Critical symptom detected: ${criticalSymptom}`,
      action: '📞 Call Ambulance (108/102)',
      advice: [
        'Call emergency services immediately',
        'Stay with the patient',
        'Monitor breathing and pulse',
        'Be ready to perform CPR if needed',
        'Do not leave patient alone'
      ],
      emergencyNumbers: ['108', '102']
    };
  }

  if (age < 5 && (temperature >= 38.5 || symptoms.includes('persistent vomiting') || symptoms.includes('drowsiness'))) {
    return {
      severity: 'RED',
      message: '🚨 EMERGENCY ALERT – Child needs immediate care',
      reason: `Young child (${age}yo) with concerning symptoms`,
      action: '📞 Call Ambulance (108/102)',
      advice: [
        'Children under 5 need immediate medical attention',
        'Call emergency services now',
        'Keep child comfortable and hydrated',
        'Monitor temperature every 15 minutes',
        'Be prepared to go to hospital'
      ],
      emergencyNumbers: ['108', '102']
    };
  }

  // YELLOW ALERT CONDITIONS
  if (temperature >= 38.0 && temperature < 40.0 && duration > 5) {
    return {
      severity: 'YELLOW',
      message: '⚠️ CAUTION – Consult Doctor Today',
      reason: `Prolonged fever: ${temperature}°C for ${duration} days`,
      action: '🏥 Book Doctor Appointment',
      advice: [
        'Contact your doctor within 24 hours',
        'Continue monitoring temperature',
        'Maintain hydration',
        'Take prescribed medications as directed',
        'Watch for worsening symptoms'
      ]
    };
  }

  if (symptoms.some(s => WARNING_SYMPTOMS.some(ws => s.toLowerCase().includes(ws)))) {
    const warningSymptom = symptoms.find(s => WARNING_SYMPTOMS.some(ws => s.toLowerCase().includes(ws)));
    return {
      severity: 'YELLOW',
      message: '⚠️ CAUTION – Medical consultation recommended',
      reason: `Warning symptom: ${warningSymptom}`,
      action: '🏥 Consult Doctor Today',
      advice: [
        'Schedule medical consultation soon',
        'Monitor symptoms closely',
        'Keep a symptom diary',
        'Stay hydrated and rest',
        'Seek immediate help if symptoms worsen'
      ]
    };
  }

  if (age >= 60 || comorbidities.length > 0) {
    return {
      severity: 'YELLOW',
      message: '⚠️ CAUTION – Higher risk patient',
      reason: age >= 60 ? `Senior patient (${age}yo)` : `Chronic conditions: ${comorbidities.join(', ')}`,
      action: '🏥 Consult Doctor',
      advice: [
        'Higher risk patients need medical monitoring',
        'Contact your regular doctor',
        'Continue prescribed medications',
        'Monitor symptoms more frequently',
        'Have emergency contacts ready'
      ]
    };
  }

  // GREEN ALERT (Safe)
  return {
    severity: 'GREEN',
    message: '✅ STABLE – Continue home care',
    reason: `Manageable fever: ${temperature}°C`,
    action: '🏠 Monitor At Home',
    advice: [
      'Continue current treatment plan',
      'Monitor temperature twice daily',
      'Stay well hydrated',
      'Get plenty of rest',
      'Contact doctor if symptoms worsen'
    ]
  };
}