import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@shared/schema";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={activity.imageUrl || "https://images.unsplash.com/photo-1560785496-3c9d27877182"} 
        alt={activity.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl text-dark-gray mb-2">{activity.name}</h3>
        <p className="text-gray-600 mb-4">{activity.description}</p>
        <span className="text-sm text-primary-green font-medium">{activity.frequency}</span>
      </CardContent>
    </Card>
  );
}
