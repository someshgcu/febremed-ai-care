import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { toast } from "sonner";

const LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];

// Mock healthcare data - In production, this would come from an API or database
const MOCK_HEALTHCARE = {
  Mumbai: [
    { id: 1, name: "Apollo Hospital", type: "Hospital", address: "123 Medical Street, Mumbai", phone: "+91-22-1234-5678", distance: "2.5 km", open: "24/7" },
    { id: 2, name: "Fortis Healthcare", type: "Hospital", address: "456 Health Avenue, Mumbai", phone: "+91-22-2345-6789", distance: "5.1 km", open: "24/7" },
    { id: 3, name: "MedPlus Pharmacy", type: "Pharmacy", address: "789 Pharmacy Road, Mumbai", phone: "+91-22-3456-7890", distance: "1.2 km", open: "9 AM - 9 PM" },
    { id: 4, name: "Dr. Sharma Clinic", type: "Clinic", address: "321 Doctor Lane, Mumbai", phone: "+91-22-4567-8901", distance: "3.8 km", open: "10 AM - 7 PM" },
  ],
  Delhi: [
    { id: 5, name: "AIIMS Delhi", type: "Hospital", address: "AIIMS Campus, New Delhi", phone: "+91-11-2658-8500", distance: "8.3 km", open: "24/7" },
    { id: 6, name: "Max Hospital", type: "Hospital", address: "Saket, New Delhi", phone: "+91-11-2651-5050", distance: "12.5 km", open: "24/7" },
    { id: 7, name: "Wellness Forever", type: "Pharmacy", address: "Connaught Place, Delhi", phone: "+91-11-2345-6789", distance: "4.2 km", open: "9 AM - 10 PM" },
  ],
  Bangalore: [
    { id: 8, name: "Narayana Health", type: "Hospital", address: "Bommanahalli, Bangalore", phone: "+91-80-2372-2000", distance: "6.7 km", open: "24/7" },
    { id: 9, name: "Apollo Pharmacy", type: "Pharmacy", address: "Koramangala, Bangalore", phone: "+91-80-2555-1234", distance: "2.1 km", open: "8 AM - 10 PM" },
  ],
};

const HealthcareLocator = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"all" | "Hospital" | "Pharmacy" | "Clinic">("all");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!location) {
      toast.error("Please select a location");
      return;
    }

    const locationData = MOCK_HEALTHCARE[location as keyof typeof MOCK_HEALTHCARE] || [];
    const filtered = type === "all" 
      ? locationData 
      : locationData.filter(item => item.type === type);
    
    setResults(filtered);

    if (filtered.length === 0) {
      toast.info("No healthcare facilities found in this area");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Hospital":
        return "bg-primary text-primary-foreground";
      case "Pharmacy":
        return "bg-success text-success-foreground";
      case "Clinic":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

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
              <MapPin className="h-6 w-6 text-primary" />
              Find Healthcare Nearby
            </CardTitle>
            <CardDescription>
              Locate hospitals, clinics, and pharmacies in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Facility Type</Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full" size="lg">
              <Navigation className="mr-2 h-5 w-5" />
              Search Healthcare Facilities
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Found {results.length} facility(s)</h2>
            {results.map((facility) => (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{facility.name}</h3>
                        <Badge className={getTypeColor(facility.type)}>
                          {facility.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{facility.address}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {facility.distance}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {facility.open}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${facility.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="mr-2 h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && location && (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found. Try a different location or facility type.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareLocator;


