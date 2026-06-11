import { Layers, LayoutDashboard, type LucideProps } from "lucide-react";

// TYPE MANIFESTS
export interface PlatformOrder {
  id: string;
  restaurant: string;
  grossAmount: number;
  commission: number;
  type: "Delivery" | "Dine-In" | "Takeaway";
  status: "Settled" | "Processing" | "Disputed";
  timestamp: string;
}

export interface MetricItem {
  label: string;
  current: string;
  shift: string;
  darkBg: string;
  lightBg: string;
  icon: React.ComponentType<LucideProps>;
}

export interface BarSeriesItem {
  period: string;
  load: number;
  capacity: number;
}

export interface DistributionItem {
  division: string;
  allocation: number;
  Hex: string;
}

// PRESET METRICS MATRIX
export const metricsData: MetricItem[] = [
  { 
    label: "Active Subscriptions", 
    current: "1,240", 
    shift: "+12.3%", 
    darkBg: "bg-orange-500/10 text-orange-500", 
    lightBg: "bg-orange-50 text-orange-600", 
    icon: Layers 
  },
  { 
    label: "Platform Compute", 
    current: "94.2%", 
    shift: "+0.8%", 
    darkBg: "bg-blue-500/10 text-blue-500", 
    lightBg: "bg-blue-50 text-blue-600", 
    icon: LayoutDashboard 
  },
];

// OPERATIONAL THROUGHPUT CAPACITY
export const barSeries: BarSeriesItem[] = [
  { period: "Q1", load: 400, capacity: 240 },
  { period: "Q2", load: 300, capacity: 139 },
  { period: "Q3", load: 200, capacity: 980 },
  { period: "Q4", load: 278, capacity: 390 },
];

// DEPLOYMENT INFRASTRUCTURE ALLOCATION 
export const distributionSeries: DistributionItem[] = [
  { division: "Enterprise", allocation: 60, Hex: "#f97316" },
  { division: "SME Node", allocation: 40, Hex: "#3b82f6" },
];

// CONNECTED ROUTE OUTLETS RAW RECORDS
export const mockPlatformOrders: PlatformOrder[] = [
  { id: "TXN-9021", restaurant: "Spice Paradise Hub", grossAmount: 1450, commission: 145, type: "Delivery", status: "Settled", timestamp: "Just Now" },
  { id: "TXN-9022", restaurant: "Burger House Alley", grossAmount: 620, commission: 62, type: "Takeaway", status: "Settled", timestamp: "2 mins ago" },
  { id: "TXN-9023", restaurant: "Tandoori Nights Express", grossAmount: 2150, commission: 215, type: "Delivery", status: "Processing", timestamp: "5 mins ago" },
  { id: "TXN-9024", restaurant: "Pizza Express Central", grossAmount: 980, commission: 98, type: "Dine-In", status: "Disputed", timestamp: "12 mins ago" },
  { id: "TXN-9025", restaurant: "Sushi Roll Dojo", grossAmount: 1850, commission: 185, type: "Delivery", status: "Settled", timestamp: "18 mins ago" },
];