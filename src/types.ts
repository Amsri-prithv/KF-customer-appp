export interface Machine {
  id: string; // e.g. "ESP-KASH-01"
  customName: string; // e.g. "Executive Boardroom Scent"
  ipAddress: string; // e.g. "192.168.1.51"
  sprayCount: number; // e.g. 1, 2, 3 (times)
  sprayDuration?: string; // backwards compatibility
  intervalMinutes: string; // e.g. "30m", "1h"
  isMasterLocked: boolean; // Emergency stop state
  status: 'Active' | 'Master Stopped' | 'Offline';
  lastSprayed?: string;
  scentType?: string;
}

export interface CustomerUser {
  customerId: string; // e.g. "CUST-101"
  password: string; // e.g. "apex2026"
  customerName: string; // e.g. "Sarah Jenkins"
  officeName: string; // e.g. "Apex Corporate Tower"
  phone: string; // e.g. "+1 (555) 234-5678"
  assignedMachines: string[]; // machine IDs
}

export type AuthRole = 'customer' | 'admin' | null;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
