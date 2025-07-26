import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TreeNodeData {
  name: string;
  email?: string;
  walletBalance?: number;
  totalReferrals?: number;
  level?: number;
  status?: string;
  attributes?: {
    department?: string;
  };
  children?: TreeNodeData[];
}

interface AffiliateTreeProps {
  data?: TreeNodeData;
}

const AffiliateTree: React.FC<AffiliateTreeProps> = ({ data }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Mock data cho cây phả hệ
  const treeData: TreeNodeData = data || {
    name: "Admin Root",
    email: "admin@mamnonthaonguyenxanh.com",
    walletBalance: 0,
    totalReferrals: 3,
    level: 0,
    status: "active",
    children: [
      {
        name: "Cô Lan",
        email: "co.lan@example.com", 
        walletBalance: 4500000,
        totalReferrals: 2,
        level: 1,
        status: "active",
        children: [
          {
            name: "Phụ huynh A",
            email: "phuhuynh.a@example.com",
            walletBalance: 2000000,
            totalReferrals: 1,
            level: 2,
            status: "active",
            children: [
              {
                name: "Phụ huynh B",
                email: "phuhuynh.b@example.com",
                walletBalance: 2000000,
                totalReferrals: 0,
                level: 3,
                status: "active"
              }
            ]
          },
          {
            name: "Phụ huynh C",
            email: "phuhuynh.c@example.com",
            walletBalance: 2000000,
            totalReferrals: 0,
            level: 2,
            status: "pending"
          }
        ]
      },
      {
        name: "Cô Mai",
        email: "co.mai@example.com",
        walletBalance: 2000000,
        totalReferrals: 1,
        level: 1,
        status: "active",
        children: [
          {
            name: "Phụ huynh D",
            email: "phuhuynh.d@example.com",
            walletBalance: 2000000,
            totalReferrals: 0,
            level: 2,
            status: "active"
          }
        ]
      },
      {
        name: "Cô Hoa",
        email: "co.hoa@example.com",
        walletBalance: 0,
        totalReferrals: 0,
        level: 1,
        status: "inactive"
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Custom node rendering
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: { nodeDatum: any, toggleNode: () => void }) => (
    <g>
      {/* Node circle */}
      <circle
        r={25}
        fill={nodeDatum.status === 'active' ? '#10b981' : 
              nodeDatum.status === 'pending' ? '#f59e0b' : '#6b7280'}
        stroke="#374151"
        strokeWidth={2}
        onClick={toggleNode}
        style={{ cursor: 'pointer' }}
      />
      
      {/* User icon */}
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fontSize="12"
        fill="white"
        style={{ pointerEvents: 'none' }}
      >
        👤
      </text>
      
      {/* Name label */}
      <text
        x={0}
        y={45}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#374151"
        style={{ pointerEvents: 'none' }}
      >
        {nodeDatum.name}
      </text>
      
      {/* Level label */}
      <text
        x={0}
        y={60}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        style={{ pointerEvents: 'none' }}
      >
        Cấp {nodeDatum.level}
      </text>
      
      {/* Referrals count */}
      <text
        x={0}
        y={75}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        style={{ pointerEvents: 'none' }}
      >
        GT: {nodeDatum.totalReferrals || 0}
      </text>
      
      {/* Wallet balance */}
      {nodeDatum.walletBalance && nodeDatum.walletBalance > 0 && (
        <text
          x={0}
          y={90}
          textAnchor="middle"
          fontSize="10"
          fill="#059669"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {formatCurrency(nodeDatum.walletBalance)}
        </text>
      )}
    </g>
  );

  React.useEffect(() => {
    const dimensions = { width: 800, height: 600 };
    setTranslate({
      x: dimensions.width / 2,
      y: 100
    });
  }, []);

  return (
    <div className="w-full">
      {/* Legend */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Chú thích:</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Hoạt động</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Chờ xử lý</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Không hoạt động</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            GT = Số lượng giới thiệu | Click vào node để mở rộng/thu gọn
          </p>
        </CardContent>
      </Card>

      {/* Tree Container */}
      <Card>
        <CardContent className="p-0">
          <div style={{ width: '100%', height: '600px' }}>
            <Tree
              data={treeData}
              translate={translate}
              orientation="vertical"
              pathFunc="diagonal"
              nodeSize={{ x: 200, y: 150 }}
              separation={{ siblings: 1.2, nonSiblings: 1.5 }}
              renderCustomNodeElement={renderCustomNodeElement}
              zoom={0.8}
              enableLegacyTransitions={true}
              transitionDuration={500}
              depthFactor={150}
              styles={{
                links: {
                  stroke: '#6b7280',
                  strokeWidth: 2,
                },
                nodes: {
                  node: {
                    circle: {
                      fill: '#10b981',
                      stroke: '#374151',
                      strokeWidth: 2,
                    },
                    name: {
                      fontWeight: 'bold',
                      fontSize: '12px',
                    },
                    attributes: {
                      fontSize: '10px',
                      fill: '#6b7280',
                    },
                  },
                  leafNode: {
                    circle: {
                      fill: '#10b981',
                      stroke: '#374151',
                      strokeWidth: 2,
                    },
                    name: {
                      fontWeight: 'bold',
                      fontSize: '12px',
                    },
                    attributes: {
                      fontSize: '10px',
                      fill: '#6b7280',
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Thống kê mạng lưới:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600">Tổng thành viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Cấp độ tối đa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Đang hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(12500000)}</div>
              <div className="text-sm text-gray-600">Tổng ví</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateTree;