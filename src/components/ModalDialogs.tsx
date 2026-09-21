import React, { useState } from 'react';
import { X, UserPlus, Pencil, Trash2, HardDrive, AlertTriangle } from 'lucide-react';
import { CustomerUser, Machine } from '../types';

// ==========================================
// ADD CUSTOMER MODAL
// ==========================================
interface AddCustomerModalProps {
  onClose: () => void;
  onAdd: (newCustomer: Omit<CustomerUser, 'assignedMachines'>) => void;
  suggestedId: string;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  onClose,
  onAdd,
  suggestedId,
}) => {
  const [customerId, setCustomerId] = useState(suggestedId);
  const [officeName, setOfficeName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [password, setPassword] = useState(`pass${Math.floor(1000 + Math.random() * 9000)}`);
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeName.trim() || !customerName.trim() || !password.trim()) return;

    onAdd({
      customerId: customerId.trim().toUpperCase(),
      officeName: officeName.trim(),
      customerName: customerName.trim(),
      password: password.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Register Facility Client</h3>
            <p className="text-xs text-slate-400">Generate credentials and access permissions.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Identifier (ID)</label>
            <input
              type="text"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm uppercase focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Office / Venue Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sterling Financial Plaza"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name</label>
            <input
              type="text"
              required
              placeholder="e.g. David Vance"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client Access Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// EDIT CUSTOMER MODAL
// ==========================================
interface EditCustomerModalProps {
  user: CustomerUser;
  onClose: () => void;
  onSave: (updated: Partial<CustomerUser>) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const [officeName, setOfficeName] = useState(user.officeName);
  const [customerName, setCustomerName] = useState(user.customerName);
  const [password, setPassword] = useState(user.password);
  const [phone, setPhone] = useState(user.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      officeName: officeName.trim(),
      customerName: customerName.trim(),
      password: password.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
            <Pencil className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Edit Client Profile</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {user.customerId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Office / Venue Name</label>
            <input
              type="text"
              required
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// DELETE CUSTOMER MODAL
// ==========================================
interface DeleteCustomerModalProps {
  user: CustomerUser;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  user,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-sm w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700 text-rose-400 mx-auto flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Delete Client Account?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Are you sure you want to remove <strong className="text-white">{user.officeName}</strong> ({user.customerId})?
          Assigned machines will be unlinked from this client.
        </p>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950"
          >
            Delete Client
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ADD / LINK MACHINE MODAL
// ==========================================
interface AddMachineModalProps {
  onClose: () => void;
  onAdd: (newMachine: Machine) => void;
  suggestedId: string;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({
  onClose,
  onAdd,
  suggestedId,
}) => {
  const [machineId, setMachineId] = useState(suggestedId);
  const [customName, setCustomName] = useState('');
  const [ipAddress, setIpAddress] = useState('192.168.1.75');
  const [scentType, setScentType] = useState('White Tea & Thyme');
  const [sprayCount, setSprayCount] = useState<number>(2);
  const [intervalMinutes, setIntervalMinutes] = useState('30m');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !ipAddress.trim()) return;

    onAdd({
      id: machineId.trim().toUpperCase(),
      customName: customName.trim(),
      ipAddress: ipAddress.trim(),
      scentType: scentType.trim(),
      sprayCount: Math.max(1, sprayCount),
      intervalMinutes,
      isMasterLocked: false,
      status: 'Active',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Link New ESP32 Unit</h3>
            <p className="text-xs text-slate-400">Register hardware MAC/ID and network IP.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hardware Machine ID</label>
            <input
              type="text"
              required
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm uppercase focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Label / Room Placement</label>
            <input
              type="text"
              required
              placeholder="e.g. VIP Reception Lounge"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ESP32 IP Address</label>
            <input
              type="text"
              required
              placeholder="192.168.1.xxx"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Fragrance Note</label>
            <input
              type="text"
              placeholder="e.g. Lavender & Chamomile"
              value={scentType}
              onChange={(e) => setScentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Spray Count (Times)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={sprayCount}
                onChange={(e) => setSprayCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 outline-none"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Interval</label>
              <select
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 outline-none"
              >
                <option value="15m">Every 15m</option>
                <option value="30m">Every 30m</option>
                <option value="45m">Every 45m</option>
                <option value="1h">Every 1 hr</option>
                <option value="2h">Every 2 hrs</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950"
            >
              Link Machine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// RENAME MACHINE MODAL
// ==========================================
interface RenameMachineModalProps {
  machine: Machine;
  onClose: () => void;
  onSave: (newName: string, newScent: string) => void;
}

export const RenameMachineModal: React.FC<RenameMachineModalProps> = ({
  machine,
  onClose,
  onSave,
}) => {
  const [customName, setCustomName] = useState(machine.customName);
  const [scentType, setScentType] = useState(machine.scentType || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSave(customName.trim(), scentType.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white font-['Outfit'] mb-1">Rename Dispenser</h3>
        <p className="text-xs text-slate-400 font-mono mb-4">{machine.id}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Placement / Display Label</label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Fragrance Note</label>
            <input
              type="text"
              value={scentType}
              onChange={(e) => setScentType(e.target.value)}
              placeholder="e.g. Amber & Jasmine"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Save Label
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// DELETE MACHINE MODAL
// ==========================================
interface DeleteMachineModalProps {
  machine: Machine;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteMachineModal: React.FC<DeleteMachineModalProps> = ({
  machine,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-sm w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700 text-rose-400 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Unlink Hardware Unit?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Remove <strong className="text-white">{machine.customName}</strong> ({machine.id})?
          Its network configuration will be removed from this client's portal.
        </p>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950"
          >
            Unlink Machine
          </button>
        </div>
      </div>
    </div>
  );
};
