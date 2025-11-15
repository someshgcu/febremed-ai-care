import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowLeft, FileText, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any[]>([]);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('fever_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      const { data: predictionData, error: predictionError } = await supabase
        .from('predictions')
        .select('*')
        .eq('assessment_id', id)
        .single();

      if (predictionError) throw predictionError;
      setPrediction(predictionData);

      const { data: symptomsData, error: symptomsError } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('assessment_id', id);

      if (symptomsError) throw symptomsError;
      setSymptoms(symptomsData);
    } catch (error: any) {
      console.error('Error loading results:', error);
      toast.error("Failed to load results");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'CONSULT_DOCTOR':
        return 'bg-warning text-warning-foreground';
      case 'CONTINUE':
        return 'bg-primary text-primary-foreground';
      case 'LIKELY_SAFE_TO_STOP':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM':
        return 'bg-warning text-warning-foreground';
      case 'LOW':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment || !prediction) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/report/${id}`)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Doctor Report
          </Button>
        </div>

        {/* Decision Card */}
        <Card className={getDecisionColor(assessment.decision)}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {assessment.decision === 'CONSULT_DOCTOR' && <AlertTriangle className="h-6 w-6" />}
              {assessment.decision === 'CONTINUE' && <Activity className="h-6 w-6" />}
              {assessment.decision === 'LIKELY_SAFE_TO_STOP' && <CheckCircle2 className="h-6 w-6" />}
              {assessment.decision.replace(/_/g, ' ')}
            </CardTitle>
            <CardDescription className="text-inherit opacity-90">
              AI Analysis Result
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg opacity-90">
              {prediction.explanation}
            </p>
          </CardContent>
        </Card>

        {/* Recovery & Confidence */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Probability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-success">
                {Math.round(assessment.recovery_probability * 100)}%
              </div>
              <Progress value={assessment.recovery_probability * 100} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Confidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {Math.round(assessment.confidence * 100)}%
              </div>
              <Progress value={assessment.confidence * 100} className="h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getRiskColor(assessment.risk_assessment)} variant="default">
              {assessment.risk_assessment} RISK
            </Badge>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Key Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prediction.key_factors?.map((factor: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Symptoms Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Badge key={symptom.id} variant="secondary">
                  {symptom.symptom_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              {prediction.next_steps?.map((step: string, index: number) => (
                <li key={index} className="text-foreground">{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Warning Signs */}
        {prediction.warning_signs && prediction.warning_signs.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warning Signs to Watch For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prediction.warning_signs.map((sign: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Product Recommendations */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recommended Microlabs Products
            </CardTitle>
            <CardDescription>
              Based on your assessment, here are some products that may help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {assessment.medication_type?.toLowerCase() === 'antipyretic' && (
                <>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold mb-2">Paracetamol 500mg</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Effective fever reducer and pain reliever. Suitable for most age groups.
                    </p>
                    <Badge variant="outline" className="text-xs">Antipyretic</Badge>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold mb-2">Ibuprofen 400mg</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Anti-inflammatory and fever reducer. Use with caution if you have stomach issues.
                    </p>
                    <Badge variant="outline" className="text-xs">Antipyretic</Badge>
                  </div>
                </>
              )}
              {assessment.medication_type?.toLowerCase() === 'antibiotic' && (
                <>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold mb-2">Azithromycin 500mg</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Broad-spectrum antibiotic. Complete the full course as prescribed.
                    </p>
                    <Badge variant="outline" className="text-xs">Antibiotic</Badge>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold mb-2">Amoxicillin 500mg</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Common antibiotic for bacterial infections. Take with food to reduce stomach upset.
                    </p>
                    <Badge variant="outline" className="text-xs">Antibiotic</Badge>
                  </div>
                </>
              )}
              {assessment.medication_type?.toLowerCase() === 'antiviral' && (
                <>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold mb-2">Oseltamivir 75mg</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Antiviral medication for influenza. Most effective when started early.
                    </p>
                    <Badge variant="outline" className="text-xs">Antiviral</Badge>
                  </div>
                </>
              )}
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-semibold mb-2">Oral Rehydration Salts (ORS)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Essential for maintaining hydration during fever. Mix with clean water as directed.
                </p>
                <Badge variant="outline" className="text-xs">Supportive Care</Badge>
              </div>
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-semibold mb-2">Multivitamin Supplements</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Support immune system recovery. Contains Vitamin C, Zinc, and other essential nutrients.
                </p>
                <Badge variant="outline" className="text-xs">Supportive Care</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              <strong>Note:</strong> Always consult with a healthcare professional before starting any new medication. 
              These recommendations are for informational purposes only.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={() => navigate('/assessment')} size="lg" className="flex-1">
            New Assessment
          </Button>
          <Button onClick={() => navigate('/history')} variant="secondary" size="lg" className="flex-1">
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
