import { Card, CardContent } from "@/components/ui/card";
import type { Program } from "@shared/schema";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="bg-light-gray rounded-xl p-8 hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-0">
        <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mb-6">
          <i className={`${program.icon} text-primary-green text-2xl`}></i>
        </div>
        <h3 className="font-semibold text-xl text-dark-gray mb-4">{program.name}</h3>
        <p className="text-gray-600 mb-4">{program.description}</p>
        <div className="space-y-2">
          {program.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <i className="fas fa-check text-primary-green mr-2"></i>
              {feature}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Học phí:</span>
            <span className="font-semibold text-dark-gray">
              {program.tuition.toLocaleString('vi-VN')} VNĐ/tháng
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-600">Chỉ tiêu:</span>
            <span className="font-semibold text-dark-gray">{program.capacity} học sinh</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
