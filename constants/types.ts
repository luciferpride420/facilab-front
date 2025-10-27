export type UserRole = 'patient' | 'laboratory' | 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Other';
  age?: number;
  weight?: number;
  height?: number;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
}

export interface Laboratory extends User {
  role: 'laboratory';
  labName: string;
  license: string;
  address: string;
  nurses: Nurse[];
  commission: number;
}

export interface Offer {
  id: string;
  labId: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  requiresAdminApproval?: boolean;
  approved?: boolean;
  createdAt: string;
}

export interface Nurse {
  id: string;
  name: string;
  phone: string;
  license: string;
  availability: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export type AgentType = 'support' | 'manager';

export interface Agent extends User {
  role: 'agent';
  department: string;
  assignedComplaints: number;
  agentType: AgentType;
  managedAgentIds?: string[];
}

export interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  preparation?: string;
  imageUrl?: string;
  requiresPrescription?: boolean;
}

export interface TestPack {
  id: string;
  name: string;
  description: string;
  tests: string[];
  price: number;
  discount: number;
  imageUrl?: string;
}

export type OrderStatus = 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type OrderLocation = 'home' | 'laboratory';

export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  tests: Test[];
  pack?: TestPack;
  status: OrderStatus;
  location: OrderLocation;
  address?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  assignedLaboratory?: string;
  assignedNurse?: string;
  price: number;
  paid: boolean;
  createdAt: string;
  resultsUrl?: string;
  prescriptionUrl?: string;
  confirmedByLab?: boolean;
  confirmedAt?: string;
  walletTransactionId?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'card' | 'paypal' | 'bank_transfer';
  date: string;
}

export interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCommissions: number;
  activePatients: number;
  activeLaboratories: number;
  completedOrders: number;
  pendingOrders: number;
}

export type ComplaintStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: 'patient' | 'laboratory';
  orderId?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
  messages: ComplaintMessage[];
  internalNotes: InternalNote[];
  compensation?: Compensation;
}

export interface ComplaintMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  isInternal: boolean;
}

export interface InternalNote {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  timestamp: string;
}

export interface Compensation {
  id: string;
  amount: number;
  type: 'refund' | 'credit';
  status: 'pending' | 'approved' | 'completed';
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
}

export type WalletTransactionType = 'payment' | 'refund' | 'commission' | 'payout' | 'credit';
export type WalletTransactionStatus = 'pending' | 'held' | 'completed' | 'failed';

export interface WalletTransaction {
  id: string;
  orderId: string;
  userId: string;
  userRole: 'patient' | 'laboratory';
  type: WalletTransactionType;
  amount: number;
  commission: number;
  netAmount: number;
  status: WalletTransactionStatus;
  createdAt: string;
  completedAt?: string;
  description: string;
}

export interface Wallet {
  userId: string;
  userRole: 'patient' | 'laboratory';
  balance: number;
  heldBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  transactions: WalletTransaction[];
}
