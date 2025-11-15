import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, History, MapPin, Heart } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <UserMenu />
      </div>
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">FebreMed</h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Fever Recovery Assistant
          </p>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Get intelligent guidance on fever management and medication decisions based on your symptoms and medical history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() => navigate('/assessment')}
          >
            <Activity className="mr-2 h-5 w-5" />
            Start New Assessment
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() => navigate('/history')}
          >
            <History className="mr-2 h-5 w-5" />
            View My History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate('/healthcare')}
          >
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-semibold">Find Healthcare</span>
            <span className="text-xs text-muted-foreground">Locate nearby hospitals & pharmacies</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate('/caregiver-tips')}
          >
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-semibold">Caregiver Tips</span>
            <span className="text-xs text-muted-foreground">Essential care guidance & red flags</span>
          </Button>
        </div>

        <div className="pt-12 border-t border-border mt-12">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This tool provides educational guidance only. 
            Always consult with a healthcare professional for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
