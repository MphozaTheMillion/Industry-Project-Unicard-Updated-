"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Server, Database, Shield } from "lucide-react";

type ServiceStatus = "ok" | "maintenance" | "degraded";

interface Service {
    name: string;
    status: ServiceStatus;
    description: string;
    icon: React.ReactNode;
}

const services: Service[] = [
    { name: "Authentication Service", status: "ok", description: "Login and registration services are operational.", icon: <Shield className="w-5 h-5" /> },
    { name: "Database Service", status: "ok", description: "User data storage is fully functional.", icon: <Database className="w-5 h-5" /> },
    { name: "ID Card Generation", status: "maintenance", description: "Card creation service is under scheduled maintenance.", icon: <Server className="w-5 h-5" /> },
    { name: "API Endpoints", status: "degraded", description: "Some API endpoints are experiencing high latency.", icon: <Server className="w-5 h-5" /> }
]

const StatusIndicator = ({ status }: { status: ServiceStatus }) => {
    if (status === 'ok') {
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> OK</Badge>
    }
    if (status === 'maintenance') {
        return <Badge variant="outline">Maintenance</Badge>
    }
    return <Badge variant="destructive"><AlertTriangle className="w-4 h-4 mr-1" /> Degraded</Badge>
}


export default function TechnicianDashboardPage() {
  return (
    <div className="container mx-auto">
       <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Technician Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor the health and status of application services.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Application Health</CardTitle>
            <CardDescription>Real-time status of system components.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {services.map(service => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-md">
                           {service.icon}
                        </div>
                        <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                    </div>
                    <StatusIndicator status={service.status} />
                </div>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}
