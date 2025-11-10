import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Trash2, FileText, Activity } from "lucide-react";
import { format } from "date-fns";

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('fever_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error: any) {
      console.error('Error loading history:', error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('fever_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Assessment deleted");
      loadHistory();
    } catch (error: any) {
      console.error('Error deleting assessment:', error);
      toast.error("Failed to delete assessment");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button onClick={() => navigate('/assessment')}>
            <Activity className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment History</CardTitle>
            <CardDescription>
              View and manage your past fever assessments
            </CardDescription>
          </CardHeader>
        </Card>

        {assessments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No assessments yet</p>
              <Button onClick={() => navigate('/assessment')}>
                Start Your First Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/results/${assessment.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className={getDecisionColor(assessment.decision)}>
                          {assessment.decision.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(assessment.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="font-semibold">{assessment.temperature}°C</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-semibold">{assessment.duration_days} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recovery</p>
                          <p className="font-semibold text-success">
                            {Math.round(assessment.recovery_probability * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Risk</p>
                          <p className="font-semibold">
                            {assessment.risk_assessment}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/report/${assessment.id}`);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => handleDelete(assessment.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
