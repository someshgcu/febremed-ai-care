import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

const SYMPTOMS = [
  "Body ache",
  "Headache",
  "Cough",
  "Sore throat",
  "Rash",
  "Nausea",
  "Vomiting",
  "Chills",
  "Fatigue"
];

const COMORBIDITIES = ["Diabetes", "Hypertension", "Asthma", "Other"];

const LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];

const Assessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    temperature: "",
    duration: "",
    medicationType: "",
    age: "",
    location: "",
    daysOnMedication: "",
    compliance: 80,
    symptoms: [] as string[],
    comorbidities: [] as string[],
  });

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleComorbidityToggle = (comorbidity: string) => {
    setFormData(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(comorbidity)
        ? prev.comorbidities.filter(c => c !== comorbidity)
        : [...prev.comorbidities, comorbidity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.temperature || !formData.duration || !formData.medicationType || 
        !formData.age || !formData.location || !formData.daysOnMedication) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.symptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setLoading(true);

    try {
      // Call the edge function for AI analysis
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('analyze-fever', {
        body: { 
          patientData: {
            temperature: parseFloat(formData.temperature),
            duration: parseInt(formData.duration),
            medicationType: formData.medicationType,
            age: parseInt(formData.age),
            location: formData.location,
            daysOnMedication: parseInt(formData.daysOnMedication),
            compliance: formData.compliance,
            symptoms: formData.symptoms,
            comorbidities: formData.comorbidities
          }
        }
      });

      if (aiError) throw aiError;
      if (!aiResponse) throw new Error("No response from AI analysis");

      // Save assessment to database
      const { data: assessment, error: assessmentError } = await supabase
        .from('fever_assessments')
        .insert({
          temperature: parseFloat(formData.temperature),
          duration_days: parseInt(formData.duration),
          medication_type: formData.medicationType,
          age: parseInt(formData.age),
          location: formData.location,
          days_on_medication: parseInt(formData.daysOnMedication),
          medication_compliance: formData.compliance,
          comorbidities: formData.comorbidities,
          decision: aiResponse.decision,
          recovery_probability: aiResponse.recovery_probability,
          confidence: aiResponse.confidence,
          risk_assessment: aiResponse.risk_assessment
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Save symptoms
      const symptomInserts = formData.symptoms.map(symptom => ({
        assessment_id: assessment.id,
        symptom_name: symptom,
        severity: 'moderate'
      }));

      const { error: symptomsError } = await supabase
        .from('symptom_logs')
        .insert(symptomInserts);

      if (symptomsError) throw symptomsError;

      // Save prediction details
      const { error: predictionError } = await supabase
        .from('predictions')
        .insert({
          assessment_id: assessment.id,
          recovery_probability: aiResponse.recovery_probability,
          confidence_score: aiResponse.confidence,
          explanation: aiResponse.explanation,
          key_factors: aiResponse.key_factors,
          next_steps: aiResponse.next_steps,
          warning_signs: aiResponse.warning_signs,
          doctor_note: aiResponse.doctor_note
        });

      if (predictionError) throw predictionError;

      toast.success("Assessment completed successfully!");
      navigate(`/results/${assessment.id}`);
    } catch (error: any) {
      console.error('Assessment error:', error);
      toast.error(error.message || "Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Fever Assessment</CardTitle>
            <CardDescription>
              Please provide accurate information for the best analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Current Temperature (°C) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="38.5"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Fever Duration (days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="3"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years) *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicationType">Medication Type *</Label>
                  <Select value={formData.medicationType} onValueChange={(value) => setFormData({ ...formData, medicationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paracetamol">Paracetamol (Fever Medicine)</SelectItem>
                      <SelectItem value="Ibuprofen">Ibuprofen (Fever Medicine)</SelectItem>
                      <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                      <SelectItem value="Antiviral">Antiviral</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daysOnMedication">Days on Medication *</Label>
                  <Input
                    id="daysOnMedication"
                    type="number"
                    placeholder="2"
                    value={formData.daysOnMedication}
                    onChange={(e) => setFormData({ ...formData, daysOnMedication: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medication Compliance: {formData.compliance}%</Label>
                <Slider
                  value={[formData.compliance]}
                  onValueChange={(value) => setFormData({ ...formData, compliance: value[0] })}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Symptoms *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SYMPTOMS.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <Label htmlFor={symptom} className="cursor-pointer text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comorbidities (optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {COMORBIDITIES.map((comorbidity) => (
                    <div key={comorbidity} className="flex items-center space-x-2">
                      <Checkbox
                        id={comorbidity}
                        checked={formData.comorbidities.includes(comorbidity)}
                        onCheckedChange={() => handleComorbidityToggle(comorbidity)}
                      />
                      <Label htmlFor={comorbidity} className="cursor-pointer text-sm">{comorbidity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  'Analyze My Symptoms'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
