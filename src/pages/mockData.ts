export const mockUsers = [
  {
    id: "USR-001",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-03-12",
    lastLogin: "2025-01-18 14:22",
    phone: "+237 677 123 456",
    country: "Cameroon",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    id: "USR-002",
    name: "Sophia Williams",
    email: "sophia@example.com",
    role: "User",
    status: "Active",
    createdAt: "2023-11-07",
    lastLogin: "2025-01-20 09:11",
    phone: "+1 402 882 1099",
    country: "USA",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "USR-003",
    name: "Lionel Mbappe",
    email: "lionel@example.com",
    role: "Moderator",
    status: "Suspended",
    createdAt: "2024-06-21",
    lastLogin: "2024-12-10 18:02",
    phone: "+237 690 443 212",
    country: "Cameroon",
    verified: false,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "USR-004",
    name: "Emma Rodriguez",
    email: "emma@example.com",
    role: "User",
    status: "Pending",
    createdAt: "2025-01-01",
    lastLogin: null,
    phone: "+34 612 789 333",
    country: "Spain",
    verified: false,
    avatar: "https://randomuser.me/api/portraits/women/58.jpg"
  },
  {
    id: "USR-005",
    name: "Kevin Nfor",
    email: "kevin@example.com",
    role: "Merchant",
    status: "Active",
    createdAt: "2024-09-30",
    lastLogin: "2025-01-19 17:55",
    phone: "+237 672 100 988",
    country: "Cameroon",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    id: "USR-006",
    name: "Amelia Brown",
    email: "amelia@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2023-04-18",
    lastLogin: "2025-01-10 08:31",
    phone: "+44 7700 900230",
    country: "United Kingdom",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/19.jpg"
  },
  {
    id: "USR-007",
    name: "Taku Divine",
    email: "taku@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2024-11-02",
    lastLogin: "2025-01-05 12:40",
    phone: "+237 651 299 889",
    country: "Cameroon",
    verified: false,
    avatar: "https://randomuser.me/api/portraits/men/85.jpg"
  },
  {
    id: "USR-008",
    name: "Claire Dubois",
    email: "claire@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-05-29",
    lastLogin: "2025-01-16 21:15",
    phone: "+33 612 299 877",
    country: "France",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/25.jpg"
  },
  {
    id: "USR-009",
    name: "Daniel Kim",
    email: "daniel@example.com",
    role: "User",
    status: "Pending",
    createdAt: "2024-12-15",
    lastLogin: null,
    phone: "+82 10-2234-9911",
    country: "South Korea",
    verified: false,
    avatar: "https://randomuser.me/api/portraits/men/47.jpg"
  },
  {
    id: "USR-010",
    name: "Linda Nchinda",
    email: "linda@example.com",
    role: "Merchant",
    status: "Active",
    createdAt: "2023-09-03",
    lastLogin: "2025-01-21 10:25",
    phone: "+237 690 223 551",
    country: "Cameroon",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/78.jpg"
  }
];
export const products = [
{
id: 1,
name: "Wireless Bluetooth Headphones",
category: "Electronics",
price: 59.99,
inStock: true,
rating: 4.5
},
{
id: 2,
name: "Organic Green Tea",
category: "Beverages",
price: 12.99,
inStock: true,
rating: 4.2
},
{
id: 3,
name: "Running Shoes",
category: "Footwear",
price: 89.99,
inStock: false,
rating: 4.7
},
{
id: 4,
name: "Smart LED Desk Lamp",
category: "Home & Living",
price: 35.5,
inStock: true,
rating: 4.0
},
{
id: 5,
name: "Noise-Cancelling Earbuds",
category: "Electronics",
price: 45.0,
inStock: true,
rating: 4.3
},
{
id: 6,
name: "Stainless Steel Water Bottle",
category: "Accessories",
price: 18.75,
inStock: true,
rating: 4.6
},
{
id: 7,
name: "Yoga Mat",
category: "Fitness",
price: 25.0,
inStock: false,
rating: 4.4
},
{
id: 8,
name: "Portable Charger 10000mAh",
category: "Electronics",
price: 22.99,
inStock: true,
rating: 4.1
},
{
id: 9,
name: "Classic Leather Wallet",
category: "Accessories",
price: 40.0,
inStock: true,
rating: 4.8
},
{
id: 10,
name: "Espresso Coffee Maker",
category: "Home & Living",
price: 120.0,
inStock: false,
rating: 4.5
}
];
export const orders = [
  {
    id: "#10212",
    customer: "Sarah Williams",
    date: "2025-01-10",
    status: "Completed",
    amount: 129.50,
  },
  {
    id: "#10213",
    customer: "James Carter",
    date: "2025-01-12",
    status: "Pending",
    amount: 89.99,
  },
  {
    id: "#10214",
    customer: "Emma Johnson",
    date: "2025-01-13",
    status: "Processing",
    amount: 159.00,
  },
  {
    id: "#10215",
    customer: "Michael Brown",
    date: "2025-01-14",
    status: "Completed",
    amount: 210.75,
  },
  {
    id: "#10216",
    customer: "Olivia Davis",
    date: "2025-01-16",
    status: "Canceled",
    amount: 45.00,
  },
  {
    id: "#10217",
    customer: "Daniel Lee",
    date: "2025-01-18",
    status: "Pending",
    amount: 72.30,
  },
];
// Sample data array for 10 recent activities
export const recentActivities = [
  { date: '2025-12-01', activity: 'User signed up', atId: 'ID001' },
  { date: '2025-12-01', activity: 'Order placed', atId: 'ID002' },
  { date: '2025-12-01', activity: 'Payment received', atId: 'ID003' },
  { date: '2025-12-01', activity: 'Product added', atId: 'ID004' },
  { date: '2025-12-01', activity: 'User updated profile', atId: 'ID005' },
  { date: '2025-12-01', activity: 'Order shipped', atId: 'ID006' },
  { date: '2025-12-01', activity: 'Product deleted', atId: 'ID007' },
  { date: '2025-12-01', activity: 'New comment', atId: 'ID008' },
  { date: '2025-12-01', activity: 'Payment refunded', atId: 'ID009' },
  { date: '2025-12-01', activity: 'User logged in', atId: 'ID010' },
];
export const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    isPositive: true,
    icon: "DollarSign", // or pass the actual component when mapping
    color: "blue",
  },
  {
    title: "Total Users",
    value: "12,304",
    change: "+8.1%",
    isPositive: true,
    icon: "Users",
    color: "green",
  },
  {
    title: "Total Products",
    value: "1,029",
    change: "-3.2%",
    isPositive: false,
    icon: "Package",
    color: "red",
  },
  {
    title: "Active Subscriptions",
    value: "3,842",
    change: "+5.6%",
    isPositive: true,
    icon: "BarChart",
    color: "purple",
  },
];
