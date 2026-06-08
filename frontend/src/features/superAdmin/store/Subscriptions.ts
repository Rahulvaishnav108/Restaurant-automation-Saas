export interface SubscriptionRow {
  id: string;
  restaurantName: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  plan: "Basic" | "Standard" | "Premium" | "Enterprise";
  status: "Active" | "Trial" | "Inactive";
  revenue: string;
  branches: number;
}

export const subscriptionData: SubscriptionRow[] = [
  {
    id: "SUB-1001",
    restaurantName: "Spice Garden",
    owner: "Rahul Sharma",
    email: "rahul@spicegarden.com",
    phone: "+91 9876543210",
    location: "Kolkata",
    plan: "Premium",
    status: "Active",
    revenue: "$999",
    branches: 5,
  },
  {
    id: "SUB-1002",
    restaurantName: "Burger Hub",
    owner: "Amit Das",
    email: "amit@burgerhub.com",
    phone: "+91 9123456780",
    location: "Delhi",
    plan: "Standard",
    status: "Trial",
    revenue: "$599",
    branches: 2,
  },
  {
    id: "SUB-1003",
    restaurantName: "Pizza Point",
    owner: "Sneha Roy",
    email: "sneha@pizzapoint.com",
    phone: "+91 9988776655",
    location: "Mumbai",
    plan: "Enterprise",
    status: "Active",
    revenue: "$1999",
    branches: 10,
  },
];