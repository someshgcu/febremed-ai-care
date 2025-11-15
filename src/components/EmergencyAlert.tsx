import { AlertTriangle, Phone, Hospital, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmergencyAlert as AlertData } from "@/utils/emergencyChecker";

interface EmergencyAlertProps {
  alert: AlertData;
  location?: string;
}

export function EmergencyAlert({ alert, location }: EmergencyAlertProps) {
  const { severity, message, reason, action, advice, emergencyNumbers } = alert;

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleHospitalSearch = () => {
    const query = location ? `hospitals near ${location}` : 'emergency hospitals near me';
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  const getSeverityStyles = () => {
    switch (severity) {
      case 'RED':
        return {
          card: 'border-red-500 bg-red-50 border-2',
          header: 'text-red-800 bg-red-100',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />
        };
      case 'YELLOW':
        return {
          card: 'border-yellow-500 bg-yellow-50 border-2',
          header: 'text-yellow-800 bg-yellow-100',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />
        };
      case 'GREEN':
        return {
          card: 'border-green-500 bg-green-50 border-2',
          header: 'text-green-800 bg-green-100',
          button: 'bg-green-600 hover:bg-green-700 text-white',
          icon: <Home className="h-6 w-6 text-green-600" />
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <Card className={`${styles.card} mb-6`}>
      <CardContent className="p-6">
        <div className={`${styles.header} p-4 rounded-lg mb-4 flex items-center gap-3`}>
          {styles.icon}
          <div>
            <h2 className="text-xl font-bold">{message}</h2>
            <p className="text-sm mt-1">{reason}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {severity === 'RED' && emergencyNumbers && (
            <>
              {emergencyNumbers.map(number => (
                <Button
                  key={number}
                  onClick={() => handleEmergencyCall(number)}
                  className={styles.button}
                  size="lg"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call {number}
                </Button>
              ))}
              <Button
                onClick={handleHospitalSearch}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-700 hover:bg-red-50"
              >
                <Hospital className="mr-2 h-5 w-5" />
                Find Hospital
              </Button>
            </>
          )}
          
          {severity === 'YELLOW' && (
            <>
              <Button
                onClick={handleHospitalSearch}
                className={styles.button}
                size="lg"
              >
                <Hospital className="mr-2 h-5 w-5" />
                {action}
              </Button>
            </>
          )}
          
          {severity === 'GREEN' && (
            <Button
              className={styles.button}
              size="lg"
              disabled
            >
              <Home className="mr-2 h-5 w-5" />
              {action}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Immediate Actions:</h3>
          <ul className="space-y-1">
            {advice.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {severity === 'RED' && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-red-800 text-sm font-medium">
              ⚠️ This is a medical emergency. Do not delay seeking professional help.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}