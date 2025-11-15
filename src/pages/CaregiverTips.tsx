import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Heart, Thermometer, Droplet, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const CaregiverTips = () => {
  const navigate = useNavigate();

  const generalTips = [
    {
      icon: Thermometer,
      title: "Monitor Temperature Regularly",
      description: "Check temperature every 4-6 hours. Keep a log of readings with timestamps to track patterns."
    },
    {
      icon: Droplet,
      title: "Ensure Hydration",
      description: "Encourage frequent sips of water, oral rehydration solutions, or clear broths. Watch for signs of dehydration."
    },
    {
      icon: Clock,
      title: "Medication Timing",
      description: "Follow prescribed medication schedule strictly. Set reminders and maintain a medication log."
    },
    {
      icon: Heart,
      title: "Rest and Comfort",
      description: "Ensure adequate rest in a well-ventilated room. Use light clothing and maintain comfortable room temperature."
    }
  ];

  const redFlags = [
    "Temperature above 40°C (104°F) that doesn't respond to medication",
    "Severe headache with neck stiffness or sensitivity to light",
    "Difficulty breathing or rapid breathing",
    "Severe dehydration (dry mouth, no urination for 8+ hours, sunken eyes)",
    "Confusion, disorientation, or difficulty waking up",
    "Severe vomiting or inability to keep fluids down",
    "Rash that spreads rapidly or looks like bruises",
    "Seizures or convulsions",
    "Persistent chest pain or severe abdominal pain",
    "Fever lasting more than 5 days without improvement"
  ];

  const medicationTips = [
    "Never exceed recommended dosage, even if fever persists",
    "Wait appropriate intervals between doses (usually 4-6 hours for antipyretics)",
    "Do not combine multiple fever-reducing medications without doctor's advice",
    "Check expiration dates before administering any medication",
    "Store medications in a cool, dry place away from children"
  ];

  const comfortMeasures = [
    "Sponge baths with lukewarm water (not cold) can help reduce fever",
    "Apply cool, damp cloths to forehead, wrists, and back of neck",
    "Ensure the patient wears light, breathable clothing",
    "Keep the room well-ventilated but avoid direct drafts",
    "Offer light, easy-to-digest foods like soups, toast, or fruits"
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Caregiver Support & Tips
            </CardTitle>
            <CardDescription>
              Essential guidance for caring for someone with fever
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Red Flags Alert */}
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive">Red Flags - Seek Immediate Medical Attention</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {redFlags.map((flag, index) => (
                <li key={index} className="text-sm">{flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        {/* General Care Tips */}
        <Card>
          <CardHeader>
            <CardTitle>General Care Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {generalTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex gap-3 p-4 rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Medication Safety */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Safety Tips</CardTitle>
            <CardDescription>Important guidelines for administering medications</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicationTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Comfort Measures */}
        <Card>
          <CardHeader>
            <CardTitle>Comfort Measures</CardTitle>
            <CardDescription>Ways to help the patient feel more comfortable</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {comfortMeasures.map((measure, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{measure}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* When to Consult Doctor */}
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-warning">When to Consult a Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <span>Fever persists for more than 3 days despite medication</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <span>Temperature spikes above 39°C (102.2°F) repeatedly</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <span>New symptoms develop or existing symptoms worsen</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <span>Patient is unable to take fluids or medications</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <span>Underlying health conditions (diabetes, heart disease, etc.) are present</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Important:</strong> These tips are for general guidance only. Always consult with a healthcare professional 
              for personalized medical advice, especially for children, elderly, or individuals with chronic conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaregiverTips;


