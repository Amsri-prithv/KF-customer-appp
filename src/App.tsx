import React, { useState, useEffect, useCallback } from 'react';
import { db, ref, set, onValue, remove, update } from './services/firebase';
import { Navbar } from './components/Navbar';
import { LoginGateway } from './components/LoginGateway';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminCustomerDirectory } from './components/AdminCustomerDirectory';
import { AdminCustomerDevices } from './components/AdminCustomerDevices';
import { MachineControlModal } from './components/MachineControlModal';
import { MistOverlay } from './components/MistOverlay';
import { ToastContainer } from './components/ToastContainer';
import {
  AddCustomerModal,
  EditCustomerModal,
  DeleteCustomerModal,
  AddMachineModal,
  RenameMachineModal,
  DeleteMachineModal,
} from './components/ModalDialogs';
import {
  CustomerUser,
  Machine,
  AuthRole,
  ToastMessage,
} from './types';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredMachines,
  saveStoredMachines,
  ADMIN_CREDENTIALS,
  STORAGE_KEY_CUSTOMER_SESSION,
  SESSION_KEY_ADMIN,
  STORAGE_KEY_USERS,
  STORAGE_KEY_MACHINES,
} from './storage';

export default function App() {
  // Core Data Collections
  const [users, setUsers] = useState<CustomerUser[]>(() => getStoredUsers());
  const [machines, setMachines] = useState<Machine[]>(() => getStoredMachines());

  // Authentication State
  const [currentRole, setCurrentRole] = useState<AuthRole>(() => {
    // Check admin session (sessionStorage)
    try {
      if (sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true') {
        return 'admin';
      }
      // Check customer session (localStorage)
      const custId = localStorage.getItem(STORAGE_KEY_CUSTOMER_SESSION);
      if (custId) {
        return 'customer';
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOMER_SESSION);
    } catch {
      return null;
    }
  });

  // Admin Navigation: selected customer for Screen A2
  const [selectedAdminCustomerId, setSelectedAdminCustomerId] = useState<string | null>(null);

  // Modal / Overlay States
  const [selectedControlMachine, setSelectedControlMachine] = useState<Machine | null>(null);
  const [activeMistMachine, setActiveMistMachine] = useState<Machine | null>(null);
  const [activeMistSprayCount, setActiveMistSprayCount] = useState<number>(2);

  // Admin Action Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerUser | null>(null);

  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [renamingMachine, setRenamingMachine] = useState<Machine | null>(null);
  const [deletingMachine, setDeletingMachine] = useState<Machine | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Clients Cloud Sync
  useEffect(() => {
    const clientsRef = ref(db, 'clients');
    const unsub = onValue(clientsRef, (snapshot) => {
      const val = snapshot.val();
      setUsers(val ? Object.values(val) : []);
    });
    return () => unsub();
  }, []);

  // 2. Machines Cloud Sync (Customer portal & Master admin permanent data)
  useEffect(() => {
    const machinesRef = ref(db, 'machines');
    const unsub = onValue(machinesRef, (snapshot) => {
      const val = snapshot.val();
      setMachines(val ? Object.values(val) : []);
    });
    return () => unsub();
  }, []);

  const isMasterLockActive = useCallback((machine?: Machine | null) => {
    if (!machine) return false;
    return Boolean(machine.isMasterLocked || machine.status === 'Master Stopped');
  }, []);

  const normalizeHardwareStatus = useCallback((machine: Machine, payload: any): Machine => {
    if (isMasterLockActive(machine)) {
      return {
        ...machine,
        isMasterLocked: true,
        status: 'Master Stopped',
      };
    }

    const rawIntervalMinutes = typeof payload?.interval === 'number' ? Number(payload.interval) : parseInt(machine.intervalMinutes.replace(/[mh]/g, '')) || 30;
    const intervalString = rawIntervalMinutes >= 60 && rawIntervalMinutes % 60 === 0
      ? `${rawIntervalMinutes / 60}h`
      : `${rawIntervalMinutes}m`;

    const nextSpraySec = typeof payload?.nextSpraySec === 'number'
      ? payload.nextSpraySec
      : machine.nextSpraySec;

    const isHardwareLocked = Boolean(payload?.locked || payload?.status === 'Master Stopped');
    const nextStatus: Machine['status'] =
      payload?.status === 'Master Stopped' || isHardwareLocked
        ? 'Master Stopped'
        : payload?.status === 'Active'
          ? 'Active'
          : 'Offline';

    return {
      ...machine,
      sprayCount: typeof payload?.sprayCount === 'number' ? payload.sprayCount : machine.sprayCount,
      intervalMinutes: intervalString,
      isMasterLocked: isHardwareLocked,
      status: nextStatus,
      nextSpraySec,
    };
  }, [isMasterLockActive]);

  const pollMachineStatus = useCallback(async (machine: Machine) => {
    if (!machine.ipAddress || isMasterLockActive(machine)) return;

    try {
      const response = await fetch(`http://${machine.ipAddress}/status`, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Status request failed: ${response.status}`);
      }

      const payload = await response.json();
      setMachines((prev) =>
        prev.map((m) => (m.id === machine.id ? normalizeHardwareStatus(m, payload) : m))
      );
    } catch (error) {
      console.warn(`[ESP32 STATUS] Poll failed for ${machine.ipAddress}:`, error);
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machine.id
            ? {
                ...m,
                status: 'Offline',
              }
            : m
        )
      );
    }
  }, [isMasterLockActive, normalizeHardwareStatus]);

  // Save changes to storage whenever users/machines update
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredMachines(machines);
  }, [machines]);

  useEffect(() => {
    if (!machines.length) return;

    let isMounted = true;
    const refreshAll = async () => {
      if (!isMounted) return;
      await Promise.allSettled(machines.map((machine) => pollMachineStatus(machine)));
    };

    refreshAll();
    const intervalId = window.setInterval(refreshAll, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [machines, pollMachineStatus]);

  // Cross-tab sync listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_USERS) {
        setUsers(getStoredUsers());
      } else if (e.key === STORAGE_KEY_MACHINES) {
        setMachines(getStoredMachines());
      } else if (e.key === STORAGE_KEY_CUSTOMER_SESSION) {
        const newCustId = localStorage.getItem(STORAGE_KEY_CUSTOMER_SESSION);
        if (!newCustId && currentRole === 'customer') {
          setCurrentRole(null);
          setCurrentCustomerId(null);
        } else if (newCustId) {
          setCurrentCustomerId(newCustId);
          setCurrentRole('customer');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentRole]);

  // Keep selectedControlMachine in sync if machines change
  useEffect(() => {
    if (selectedControlMachine) {
      const updated = machines.find((m) => m.id === selectedControlMachine.id);
      if (updated) {
        setSelectedControlMachine(updated);
      }
    }
  }, [machines, selectedControlMachine]);

  // Current authenticated customer object
  const currentCustomerUser = users.find((u) => u.customerId === currentCustomerId) || null;

  // Selected customer for Admin Screen A2
  const selectedAdminCustomer = users.find((u) => u.customerId === selectedAdminCustomerId) || null;

  const normalizeClientId = (value?: string | null) => (value ?? '').toString().trim().toUpperCase();

  const isMatchingMachine = (machine: Machine, targetId?: string | null) => {
    if (!targetId || !machine) return false;
    const mClientId = normalizeClientId(machine.clientId || (machine as any).client_id || '');
    const cId = normalizeClientId(targetId);
    return mClientId === cId;
  };

  const currentTargetId = normalizeClientId(
    selectedAdminCustomerId || selectedAdminCustomer?.customerId || currentCustomerId || currentCustomerUser?.customerId || 'CUST-101'
  );
  const clientMachines = machines.filter((m) => isMatchingMachine(m, currentTargetId));
  const adminAssignedMachines = machines.filter((m) => isMatchingMachine(m, currentTargetId));

  // ==========================================
  // AUTHENTICATION HANDLERS
  // ==========================================
  const handleCustomerLogin = (id: string, pass: string) => {
    const matched = users.find(
      (u) => u.customerId.toUpperCase() === id.toUpperCase() && u.password === pass
    );

    if (matched) {
      setCurrentRole('customer');
      setCurrentCustomerId(matched.customerId);
      localStorage.setItem(STORAGE_KEY_CUSTOMER_SESSION, matched.customerId);
      addToast(`Welcome, ${matched.officeName}`, 'success', 'Customer Portal Access');
    } else {
      addToast('Invalid Customer ID or Password. Try demo credentials.', 'error', 'Authentication Failed');
    }
  };

  const handleAdminLogin = (username: string, pass: string) => {
    if (username === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
      setCurrentRole('admin');
      sessionStorage.setItem(SESSION_KEY_ADMIN, 'true');
      addToast('Master Admin Privileges Granted', 'success', 'Admin Session Authenticated');
    } else {
      addToast('Invalid Master Admin Credentials.', 'error', 'Access Denied');
    }
  };

  const handleLogout = () => {
    if (currentRole === 'customer') {
      localStorage.removeItem(STORAGE_KEY_CUSTOMER_SESSION);
    } else if (currentRole === 'admin') {
      sessionStorage.removeItem(SESSION_KEY_ADMIN);
    }
    setCurrentRole(null);
    setCurrentCustomerId(null);
    setSelectedAdminCustomerId(null);
    setSelectedControlMachine(null);
    addToast('You have signed out.', 'info');
  };

  // ==========================================
  // HARDWARE REST DISPATCH ACTIONS
  // ==========================================
  const handleTriggerSpray = (machine: Machine, sprayCount: number) => {
    if (machine.isMasterLocked && currentRole !== 'admin') {
      addToast('Maintenance Lock Active. Spraying is disabled.', 'error', 'Machine Locked');
      return;
    }

    const safeCount = Math.max(1, sprayCount);
    const countLabel = safeCount === 1 ? '1 time spray' : `${safeCount} times spray`;

    // Trigger overlay mist animation
    setActiveMistMachine(machine);
    setActiveMistSprayCount(safeCount);

    // Dispatch real REST signal to ESP32: GET http://<ip>/spray?duration=<seconds>
    const endpoint = `http://${machine.ipAddress}/spray?duration=${safeCount}`;
    fetch(endpoint, { method: 'GET' }).catch((err) => {
      console.log(`[ESP32 REST] Dispatched to ${endpoint}`, err);
    });

    addToast(`Spraying ${machine.customName} (${countLabel})`, 'success', 'Mist Pulse Initiated');

    // Automatically dismiss overlay after spray count cycle
    setTimeout(() => {
      setActiveMistMachine(null);
    }, Math.max(2200, safeCount * 1200 + 400));
  };

  const handleSaveSchedule = async (machineId: string, sprayCount: number, interval: string) => {
    const target = machines.find((m) => m.id === machineId);
    if (!target) return;

    if (target.isMasterLocked && currentRole !== 'admin') {
      addToast('Cannot update schedule while Emergency Stop is engaged.', 'error', 'Machine Locked');
      return;
    }

    const safeCount = Math.max(1, sprayCount);
    const countText = safeCount === 1 ? '1 time spray' : `${safeCount} times spray`;

    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              sprayCount: safeCount,
              sprayDuration: countText,
              intervalMinutes: interval,
            }
          : m
      )
    );

    try {
      await update(ref(db, `machines/${machineId}`), {
        sprayCount: safeCount,
        intervalMinutes: interval,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to update machine schedule in Firebase:', error);
    }

    // Dispatch REST signal to ESP32: GET http://<ip>/configure?duration=...&interval=...
    let minutes = parseInt(interval.replace(/[mh]/g, '')) || 30;
    if (interval.endsWith('h')) {
      minutes = minutes * 60;
    }
    const endpoint = `http://${target.ipAddress}/configure?duration=${safeCount}&interval=${minutes}`;
    fetch(endpoint, { method: 'GET' }).catch((err) => {
      console.log(`[ESP32 REST] Dispatched to ${endpoint}`, err);
    });

    addToast(`Updated schedule: ${countText} every ${interval}`, 'success', `${target.customName} Saved`);
    setSelectedControlMachine(null);
  };

  const handleEmergencyStop = async (machineId: string) => {
    const target = machines.find((m) => m.id === machineId);
    if (!target) return;

    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              isMasterLocked: true,
              status: 'Master Stopped',
            }
          : m
      )
    );

    try {
      await update(ref(db, `machines/${machineId}`), {
        isMasterLocked: true,
        status: 'Master Stopped',
      });
    } catch (err) {
      console.error('Firebase lock failed:', err);
    }

    try {
      if (target.ipAddress) {
        await fetch(`http://${target.ipAddress}/master-lock`, {
          method: 'POST',
          signal: AbortSignal.timeout(1500),
        });
      }
    } catch (hwErr) {
      console.warn('ESP32 offline or unreachable:', hwErr);
    }

    addToast('Emergency Master Stop Engaged', 'error', 'Hardware Security Signal');
  };

  const handleReleaseMasterStop = async (machineId: string) => {
    const target = machines.find((m) => m.id === machineId);
    if (!target) return;

    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              isMasterLocked: false,
              status: 'Active',
            }
          : m
      )
    );

    try {
      await update(ref(db, `machines/${machineId}`), {
        isMasterLocked: false,
        status: 'Active',
      });
    } catch (err) {
      console.error('Firebase release failed:', err);
    }

    try {
      if (target.ipAddress) {
        await fetch(`http://${target.ipAddress}/master-release`, {
          method: 'POST',
          signal: AbortSignal.timeout(1500),
        });
      }
    } catch (hwErr) {
      console.warn('ESP32 offline or unreachable:', hwErr);
    }

    addToast(`Master Stop Released for ${target.customName || 'Room'}`, 'success', 'Hardware Security Signal');
  };

  const handleToggleMasterLock = async (machineId: string, currentLockState: boolean) => {
    if (currentLockState) {
      await handleReleaseMasterStop(machineId);
      return;
    }
    await handleEmergencyStop(machineId);
  };

  const handleRegisterClient = (newClient: CustomerUser) => {
    set(ref(db, `clients/${newClient.customerId}`), newClient);
  };

  const handleDeleteClient = (clientId: string) => {
    remove(ref(db, `clients/${clientId}`));
  };

  const handleAddMachine = (newMachine: Partial<Machine> & { id?: string }) => {
    const targetClientId = selectedAdminCustomerId || currentCustomerId || currentCustomerUser?.customerId || 'CUST-101';

    const machinePayload: Machine = {
      ...newMachine,
      id: newMachine.id || `ESP-${Date.now()}`,
      clientId: targetClientId,
      customName: newMachine.customName || 'Fragrance Unit',
      ipAddress: newMachine.ipAddress || '192.168.1.75',
      sprayCount: newMachine.sprayCount ?? 2,
      intervalMinutes: newMachine.intervalMinutes || '30m',
      isMasterLocked: newMachine.isMasterLocked ?? false,
      status: newMachine.status || 'Active',
    };

    set(ref(db, `machines/${machinePayload.id}`), machinePayload);
  };

  const handleDeleteMachine = (machineId: string) => {
    remove(ref(db, `machines/${machineId}`));
  };

  // ==========================================
  // ADMIN CLIENT MANAGEMENT
  // ==========================================
  const handleAddCustomer = (newCustomer: Omit<CustomerUser, 'assignedMachines'>) => {
    const fullUser: CustomerUser = {
      ...newCustomer,
      assignedMachines: [],
    };
    setUsers((prev) => [...prev, fullUser]);
    handleRegisterClient(fullUser);
    setIsAddCustomerOpen(false);
    addToast(`Registered client ${fullUser.officeName} (${fullUser.customerId})`, 'success');
  };

  const handleSaveCustomerEdit = (updated: Partial<CustomerUser>) => {
    if (!editingCustomer) return;
    setUsers((prev) =>
      prev.map((u) => (u.customerId === editingCustomer.customerId ? { ...u, ...updated } : u))
    );
    setEditingCustomer(null);
    addToast('Client details updated successfully', 'success');
  };

  const handleConfirmDeleteCustomer = () => {
    if (!deletingCustomer) return;
    const targetId = deletingCustomer.customerId;

    // Unlink machines or keep them unassigned
    setUsers((prev) => prev.filter((u) => u.customerId !== targetId));
    handleDeleteClient(targetId);
    if (selectedAdminCustomerId === targetId) {
      setSelectedAdminCustomerId(null);
    }
    setDeletingCustomer(null);
    addToast(`Deleted client account ${targetId}`, 'info');
  };

  // ==========================================
  // ADMIN DEVICE MANAGEMENT
  // ==========================================
  const handleAddMachineToCustomer = (newMachine: Machine) => {
    if (!selectedAdminCustomerId) return;

    const machineWithClient: Machine = {
      ...newMachine,
      clientId: selectedAdminCustomerId,
      id: newMachine.id || `ESP-${Date.now()}`,
    };

    // Add to machines list
    setMachines((prev) => [...prev, machineWithClient]);
    handleAddMachine(machineWithClient);

    // Link to current client
    setUsers((prev) =>
      prev.map((u) =>
        u.customerId === selectedAdminCustomerId
          ? { ...u, assignedMachines: [...(u.assignedMachines || []), machineWithClient.id] }
          : u
      )
    );

    setIsAddMachineOpen(false);
    addToast(`Linked ${machineWithClient.customName} (${machineWithClient.id}) to client`, 'success');
  };

  const handleSaveMachineRename = (newName: string, newScent: string) => {
    if (!renamingMachine) return;
    setMachines((prev) =>
      prev.map((m) =>
        m.id === renamingMachine.id ? { ...m, customName: newName, scentType: newScent } : m
      )
    );
    setRenamingMachine(null);
    addToast('Dispenser label updated', 'success');
  };

  const handleConfirmDeleteMachine = () => {
    if (!deletingMachine) return;
    const targetId = deletingMachine.id;

    // Unlink from all users
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        assignedMachines: (u.assignedMachines || []).filter((id) => id !== targetId),
      }))
    );

    // Remove from machines
    setMachines((prev) => prev.filter((m) => m.id !== targetId));
    handleDeleteMachine(targetId);

    if (selectedControlMachine?.id === targetId) {
      setSelectedControlMachine(null);
    }
    setDeletingMachine(null);
    addToast(`Unlinked hardware unit ${targetId}`, 'info');
  };

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      addToast(`Copied ${label} to clipboard`, 'info');
    } catch {
      addToast(`Failed to copy: ${text}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navigation */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentCustomerUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {/* 1. NOT AUTHENTICATED: SHOW GATEWAY */}
        {!currentRole && (
          <LoginGateway
            users={users}
            onCustomerLogin={handleCustomerLogin}
            onAdminLogin={handleAdminLogin}
          />
        )}

        {/* 2. CUSTOMER AUTHENTICATED: CUSTOMER DASHBOARD */}
        {currentRole === 'customer' && currentCustomerUser && (
          <CustomerDashboard
            user={currentCustomerUser}
            machines={machines}
            onOpenMachineControl={(machine) => setSelectedControlMachine(machine)}
            onQuickSpray={(machine) => {
              const count =
                typeof machine.sprayCount === 'number'
                  ? machine.sprayCount
                  : parseInt(String(machine.sprayDuration || '2').replace('s', '')) || 2;
              handleTriggerSpray(machine, count);
            }}
          />
        )}

        {/* 3. MASTER ADMIN AUTHENTICATED: SCREEN A1 (DIRECTORY) OR SCREEN A2 (DEVICES) */}
        {currentRole === 'admin' && (
          <>
            {selectedAdminCustomer ? (
              <AdminCustomerDevices
                user={selectedAdminCustomer}
                machines={adminAssignedMachines}
                onBack={() => setSelectedAdminCustomerId(null)}
                onOpenAddMachine={() => setIsAddMachineOpen(true)}
                onOpenRenameMachine={(machine) => setRenamingMachine(machine)}
                onOpenDeleteMachine={(machine) => setDeletingMachine(machine)}
                onOpenMachineControl={(machine) => setSelectedControlMachine(machine)}
                onEmergencyStop={handleEmergencyStop}
                onReleaseMasterStop={handleReleaseMasterStop}
              />
            ) : (
              <AdminCustomerDirectory
                users={users}
                machines={machines}
                onSelectCustomer={(custId) => setSelectedAdminCustomerId(custId)}
                onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
                onOpenEditCustomer={(user) => setEditingCustomer(user)}
                onOpenDeleteCustomer={(user) => setDeletingCustomer(user)}
                onCopyText={copyToClipboard}
              />
            )}
          </>
        )}
      </main>

      {/* Machine Control Modal (Available in Customer & Admin mode) */}
      {selectedControlMachine && (
        <MachineControlModal
          machine={selectedControlMachine}
          currentRole={currentRole}
          onClose={() => setSelectedControlMachine(null)}
          onSaveSchedule={handleSaveSchedule}
          onTriggerSpray={handleTriggerSpray}
          onEmergencyStop={currentRole === 'admin' ? handleEmergencyStop : undefined}
          onReleaseMasterStop={currentRole === 'admin' ? handleReleaseMasterStop : undefined}
        />
      )}

      {/* Mist Spraying Visual Overlay */}
      {activeMistMachine && (
        <MistOverlay
          machine={activeMistMachine}
          sprayCount={activeMistSprayCount}
        />
      )}

      {/* Admin Dialog Modals */}
      {isAddCustomerOpen && (
        <AddCustomerModal
          suggestedId={`CUST-${100 + users.length + 1}`}
          onClose={() => setIsAddCustomerOpen(false)}
          onAdd={handleAddCustomer}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          user={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSaveCustomerEdit}
        />
      )}

      {deletingCustomer && (
        <DeleteCustomerModal
          user={deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleConfirmDeleteCustomer}
        />
      )}

      {isAddMachineOpen && (
        <AddMachineModal
          suggestedId={`ESP-KASH-0${machines.length + 1}`}
          onClose={() => setIsAddMachineOpen(false)}
          onAdd={handleAddMachineToCustomer}
        />
      )}

      {renamingMachine && (
        <RenameMachineModal
          machine={renamingMachine}
          onClose={() => setRenamingMachine(null)}
          onSave={handleSaveMachineRename}
        />
      )}

      {deletingMachine && (
        <DeleteMachineModal
          machine={deletingMachine}
          onClose={() => setDeletingMachine(null)}
          onConfirm={handleConfirmDeleteMachine}
        />
      )}

      {/* Toast Feedback System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
