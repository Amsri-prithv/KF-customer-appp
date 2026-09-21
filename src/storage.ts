import { CustomerUser, Machine } from './types';

export const STORAGE_KEY_USERS = 'aura_iot_users_v4';
export const STORAGE_KEY_MACHINES = 'aura_iot_machines_v4';
export const STORAGE_KEY_CUSTOMER_SESSION = 'aura_customer_session_v4';
export const SESSION_KEY_ADMIN = 'aura_admin_session_v4';

export const ADMIN_CREDENTIALS = {
  username: 'prithive',
  password: 'prithive@8525965507',
};

export const INITIAL_USERS: CustomerUser[] = [];

export const INITIAL_MACHINES: Machine[] = [];

export function formatSprayCount(count: number): string {
  const c = Math.max(1, count || 1);
  return c === 1 ? '1 time' : `${c} times`;
}

export function getStoredUsers(): CustomerUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading users from storage:', e);
  }
  saveStoredUsers(INITIAL_USERS);
  return INITIAL_USERS;
}

export function saveStoredUsers(users: CustomerUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage:', e);
  }
}

export function getStoredMachines(): Machine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MACHINES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Migration: ensure each machine has sprayCount
        return parsed.map((m: any) => ({
          ...m,
          sprayCount: typeof m.sprayCount === 'number'
            ? m.sprayCount
            : (parseInt(String(m.sprayDuration || '2').replace('s', '')) || 2),
        }));
      }
    }
  } catch (e) {
    console.error('Error reading machines from storage:', e);
  }
  saveStoredMachines(INITIAL_MACHINES);
  return INITIAL_MACHINES;
}

export function saveStoredMachines(machines: Machine[]) {
  try {
    localStorage.setItem(STORAGE_KEY_MACHINES, JSON.stringify(machines));
  } catch (e) {
    console.error('Error saving machines to storage:', e);
  }
}
