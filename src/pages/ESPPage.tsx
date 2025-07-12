import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CalendarDays,
  DollarSign, 
  FileText, 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  LogOut,
  Building,
  Briefcase,
  CreditCard,
  Download,
  Eye,
  X,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  number?: string;
  email_personal?: string;
  email_work: string;
  staff_number: string;
  employee_benefits_priority_code?: string;
  position: string;
  salary?: number;
  profile_photo?: string;
  password_hash: string;
  payslips: any[];
  kpis: any;
  file_access_links: any[];
  date_of_birth?: string;
  location?: string;
  mobile_plan_allowance?: number;
  internet_plan_allowance?: number;
  reports_to?: string;
  annual_leave: any[];
  sick_leave: any[];
  banking_details: any[];
  created_at: string;
  updated_at: string;
}

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: any;
}

interface LeaveApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onApplyLeave: (leaveData: any) => void;
}

interface BankingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSaveBankingDetails: (bankingDetails: any[]) => void;
}

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, payslip }) => {
  if (!isOpen || !payslip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Payslip Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded border space-y-4">
            <div className="text-center border-b pb-4">
              <h4 className="font-bold text-xl text-[#1B1F3B]">Konta Nibo</h4>
              <p className="text-sm text-gray-600">Financial Comparison Platform</p>
              <h5 className="font-semibold text-lg mt-2">PAYSLIP</h5>
              <p className="text-sm text-gray-600">
                For {payslip.month}/{payslip.year}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Employee:</span>
                  <span>{payslip.employeeName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Staff Number:</span>
                  <span>{payslip.staffNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Position:</span>
                  <span>{payslip.position}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Generated:</span>
                  <span>{new Date(payslip.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h6 className="font-semibold text-sm mb-3 text-[#1B1F3B]">EARNINGS</h6>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span>৳{payslip.basicSalary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Allowances:</span>
                  <span>৳{payslip.totalAllowances?.toLocaleString()}</span>
                </div>
                {payslip.overtime > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime:</span>
                    <span>৳{payslip.overtime?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.bonus > 0 && (
                  <div className="flex justify-between">
                    <span>Bonus:</span>
                    <span>৳{payslip.bonus?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Gross Salary:</span>
                  <span>৳{payslip.grossSalary?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {payslip.totalDeductions > 0 && (
              <div className="border-t pt-4">
                <h6 className="font-semibold text-sm mb-3 text-[#1B1F3B]">DEDUCTIONS</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total Deductions:</span>
                    <span className="text-red-600">৳{payslip.totalDeductions?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t-2 border-[#1B1F3B] pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>NET SALARY:</span>
                <span className="text-green-600">৳{payslip.netSalary?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({ isOpen, onClose, employee, onApplyLeave }) => {
  const [activeTab, setActiveTab] = useState<'annual' | 'sick'>('annual');
  const [leaveData, setLeaveData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending'
  });

  const resetForm = () => {
    setLeaveData({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending'
    });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setLeaveData(prev => ({ ...prev, type: activeTab }));
    }
  }, [isOpen, activeTab]);

  const calculateLeaveDays = () => {
    if (!leaveData.startDate || !leaveData.endDate) return 0;
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) return;

    const leaveApplication = {
      ...leaveData,
      type: activeTab,
      days: calculateLeaveDays(),
      appliedAt: new Date().toISOString(),
      employeeId: employee.id,
      employeeName: employee.name,
      staffNumber: employee.staff_number
    };

    onApplyLeave(leaveApplication);
    resetForm();
  };

  const getLeaveHistory = (type: 'annual' | 'sick') => {
    if (!employee) return [];
    return type === 'annual' ? (employee.annual_leave || []) : (employee.sick_leave || []);
  };

  const getTotalLeaveDays = (type: 'annual' | 'sick') => {
    const history = getLeaveHistory(type);
    return history
      .filter((leave: any) => leave.status === 'approved')
      .reduce((total: number, leave: any) => total + (leave.days || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CalendarDays className="text-[#1B1F3B]" size={24} />
            Apply for Leave
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('annual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'annual'
                  ? 'bg-white text-[#1B1F3B] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual Leave
            </button>
            <button
              onClick={() => setActiveTab('sick')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'sick'
                  ? 'bg-white text-[#1B1F3B] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sick Leave
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Apply for Leave */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Apply for {activeTab === 'annual' ? 'Annual' : 'Sick'} Leave
                </h3>
                
                {/* Leave Summary */}
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Used:</span>
                      <span className="ml-2 font-bold text-[#1B1F3B]">
                        {getTotalLeaveDays(activeTab)} days
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Allowance:</span>
                      <span className="ml-2 font-bold text-green-600">
                        {activeTab === 'annual' ? '21' : '14'} days/year
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={leaveData.startDate}
                        onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={leaveData.endDate}
                        onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                        min={leaveData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {leaveData.startDate && leaveData.endDate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Duration:</strong> {calculateLeaveDays()} day(s)
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason *
                    </label>
                    <textarea
                      value={leaveData.reason}
                      onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                      placeholder={`Reason for ${activeTab} leave...`}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!leaveData.startDate || !leaveData.endDate || !leaveData.reason}
                    className="w-full px-4 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <CalendarDays size={16} />
                    Apply for Leave
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Leave History */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {activeTab === 'annual' ? 'Annual' : 'Sick'} Leave History
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getLeaveHistory(activeTab).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No {activeTab} leave applications yet</p>
                    </div>
                  ) : (
                    getLeaveHistory(activeTab)
                      .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                      .map((leave: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">
                                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{leave.days} day(s)</span>
                                <span>Applied: {new Date(leave.appliedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BankingDetailsModal: React.FC<BankingDetailsModalProps> = ({ isOpen, onClose, employee, onSaveBankingDetails }) => {
  const [bankingDetails, setBankingDetails] = useState<any[]>([]);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'eft',
    bankName: '',
    bsb: '',
    accountNumber: '',
    branch: '',
    walletType: 'bkash',
    phoneNumber: '',
    paypalAddress: '',
    airwallexAddress: ''
  });

  useEffect(() => {
    if (isOpen && employee) {
      setBankingDetails(employee.banking_details || []);
    }
  }, [isOpen, employee]);

  const resetForm = () => {
    setFormData({
      type: 'eft',
      bankName: '',
      bsb: '',
      accountNumber: '',
      branch: '',
      walletType: 'bkash',
      phoneNumber: '',
      paypalAddress: '',
      airwallexAddress: ''
    });
    setActiveForm(null);
  };

  const handleAddBankingDetail = () => {
    if (!formData.type) return;

    let newDetail: any = {
      id: Date.now().toString(),
      type: formData.type,
      createdAt: new Date().toISOString()
    };

    switch (formData.type) {
      case 'eft':
        if (!formData.bankName || !formData.bsb || !formData.accountNumber || !formData.branch) return;
        newDetail = {
          ...newDetail,
          bankName: formData.bankName,
          bsb: formData.bsb,
          accountNumber: formData.accountNumber,
          branch: formData.branch
        };
        break;
      case 'mobile_wallet':
        if (!formData.walletType || !formData.phoneNumber) return;
        newDetail = {
          ...newDetail,
          walletType: formData.walletType,
          phoneNumber: formData.phoneNumber
        };
        break;
      case 'paypal':
        if (!formData.paypalAddress) return;
        newDetail = {
          ...newDetail,
          paypalAddress: formData.paypalAddress
        };
        break;
      case 'airwallex':
        if (!formData.airwallexAddress) return;
        newDetail = {
          ...newDetail,
          airwallexAddress: formData.airwallexAddress
        };
        break;
    }

    const updatedDetails = [...bankingDetails, newDetail];
    setBankingDetails(updatedDetails);
    resetForm();
  };

  const handleRemoveBankingDetail = (id: string) => {
    const updatedDetails = bankingDetails.filter(detail => detail.id !== id);
    setBankingDetails(updatedDetails);
  };

  const handleSave = () => {
    onSaveBankingDetails(bankingDetails);
    onClose();
  };

  const getBankingTypeLabel = (type: string) => {
    switch (type) {
      case 'eft': return 'EFT Bank Transfer';
      case 'mobile_wallet': return 'Mobile Wallet';
      case 'paypal': return 'PayPal';
      case 'airwallex': return 'Airwallex';
      default: return type;
    }
  };

  const getBankingDetailDisplay = (detail: any) => {
    switch (detail.type) {
      case 'eft':
        return `${detail.bankName} - ${detail.accountNumber} (BSB: ${detail.bsb})`;
      case 'mobile_wallet':
        return `${detail.walletType.toUpperCase()} - ${detail.phoneNumber}`;
      case 'paypal':
        return `PayPal - ${detail.paypalAddress}`;
      case 'airwallex':
        return `Airwallex - ${detail.airwallexAddress}`;
      default:
        return 'Unknown banking method';
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CreditCard className="text-[#1B1F3B]" size={24} />
            Banking Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Add Banking Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add Banking Method</h3>
                
                {/* Banking Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banking Method *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                      setActiveForm(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                  >
                    <option value="eft">EFT Bank Transfer</option>
                    <option value="mobile_wallet">Mobile Wallet</option>
                    <option value="paypal">PayPal</option>
                    <option value="airwallex">Airwallex</option>
                  </select>
                </div>

                {/* EFT Form */}
                {activeForm === 'eft' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="Enter bank name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          BSB *
                        </label>
                        <input
                          type="text"
                          value={formData.bsb}
                          onChange={(e) => setFormData({ ...formData, bsb: e.target.value })}
                          placeholder="123-456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          placeholder="Account number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch *
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        placeholder="Branch name/location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Wallet Form */}
                {activeForm === 'mobile_wallet' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Type *
                      </label>
                      <select
                        value={formData.walletType}
                        onChange={(e) => setFormData({ ...formData, walletType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      >
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+880 1XXXXXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {activeForm === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.paypalAddress}
                      onChange={(e) => setFormData({ ...formData, paypalAddress: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                    />
                  </div>
                )}

                {/* Airwallex Form */}
                {activeForm === 'airwallex' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Airwallex Address *
                    </label>
                    <input
                      type="text"
                      value={formData.airwallexAddress}
                      onChange={(e) => setFormData({ ...formData, airwallexAddress: e.target.value })}
                      placeholder="Airwallex account address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                    />
                  </div>
                )}

                {activeForm && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleAddBankingDetail}
                      className="flex-1 px-4 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Banking Method
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Banking Details List */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Banking Methods</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bankingDetails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No banking methods added yet</p>
                    </div>
                  ) : (
                    bankingDetails.map((detail, index) => (
                      <div key={detail.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {getBankingTypeLabel(detail.type)}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {detail.type.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {getBankingDetailDisplay(detail)}
                            </p>
                            <div className="text-xs text-gray-500">
                              Added: {new Date(detail.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveBankingDetail(detail.id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Save Banking Details
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ESPPage: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [manager, setManager] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isBankingModalOpen, setIsBankingModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const espAuth = localStorage.getItem('espAuth');
      if (!espAuth) {
        navigate('/esp-login');
        return;
      }

      const authData = JSON.parse(espAuth);
      
      // Fetch employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', authData.employeeId)
        .single();

      if (employeeError) throw employeeError;
      if (employeeData) {
        setEmployee(employeeData);

        // Fetch manager data if reports_to is set
        if (employeeData.reports_to) {
          const { data: managerData, error: managerError } = await supabase
            .from('employees')
            .select('*')
            .eq('id', employeeData.reports_to)
            .single();

          if (!managerError && managerData) {
            setManager(managerData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('espAuth');
    navigate('/esp-login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const getKPIColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getKPIBgColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-50 border-green-200';
    if (percentage >= 75) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const handleMarkAsFinished = async (kpiKey: string) => {
    if (!employee) return;

    try {
      const updatedKpis = { ...employee.kpis };
      if (updatedKpis[kpiKey]) {
        updatedKpis[kpiKey] = {
          ...updatedKpis[kpiKey],
          status: 'completed',
          current: updatedKpis[kpiKey].target,
          completedAt: new Date().toISOString()
        };

        const { error } = await supabase
          .from('employees')
          .update({ kpis: updatedKpis })
          .eq('id', employee.id);

        if (error) throw error;

        // Update local state
        setEmployee({ ...employee, kpis: updatedKpis });
        alert('Task marked as completed successfully!');
      }
    } catch (error) {
      console.error('Error updating KPI:', error);
      alert('Error updating task. Please try again.');
    }
  };

  const handleApplyLeave = async (leaveData: any) => {
    if (!employee) return;

    try {
      const leaveType = leaveData.type;
      const currentLeaves = leaveType === 'annual' ? (employee.annual_leave || []) : (employee.sick_leave || []);
      const updatedLeaves = [...currentLeaves, leaveData];

      const updateData = leaveType === 'annual' 
        ? { annual_leave: updatedLeaves }
        : { sick_leave: updatedLeaves };

      const { error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', employee.id);

      if (error) throw error;

      // Update local state
      setEmployee({ ...employee, ...updateData });
      setIsLeaveModalOpen(false);
      alert('Leave application submitted successfully! Awaiting approval.');
    } catch (error) {
      console.error('Error applying for leave:', error);
      alert('Error submitting leave application. Please try again.');
    }
  };

  const handleSaveBankingDetails = async (bankingDetails: any[]) => {
    if (!employee) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({ banking_details: bankingDetails })
        .eq('id', employee.id);

      if (error) throw error;

      // Update local state
      setEmployee({ ...employee, banking_details: bankingDetails });
      alert('Banking details saved successfully!');
    } catch (error) {
      console.error('Error saving banking details:', error);
      alert('Error saving banking details. Please try again.');
    }
  };

  const getKpiStatus = (kpi: any) => {
    if (kpi.status === 'completed') return 'completed';
    const dueDate = new Date(kpi.dueDate);
    const today = new Date();
    if (dueDate < today) return 'overdue';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1B1F3B]"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h2>
          <button
            onClick={handleLogout}
            className="bg-[#1B1F3B] text-white px-6 py-2 rounded-lg hover:bg-[#2d325f] transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f5f7fa]"
    >
      {/* Header */}
      <div className="bg-[#1B1F3B] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Employee Portal</h1>
            <p className="text-xl">Welcome back, {employee.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {employee.profile_photo ? (
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={employee.profile_photo}
                  alt={employee.name}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-400" size={16} />
                  <span className="font-medium">Position:</span>
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="text-gray-400" size={16} />
                  <span className="font-medium">Staff Number:</span>
                  <span>{employee.staff_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={16} />
                  <span className="font-medium">Email:</span>
                  <span>{employee.email_work}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-400" size={16} />
                  <span className="font-medium">Location:</span>
                  <span>{employee.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-400" size={16} />
                  <span className="font-medium">Salary:</span>
                  <span>{employee.salary ? formatCurrency(employee.salary) : 'Not disclosed'}</span>
                </div>
                {employee.date_of_birth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="font-medium">DOB:</span>
                    <span>{new Date(employee.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - KPIs and Manager */}
          <div className="lg:col-span-2 space-y-8">
            {/* KPI Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="text-[#1B1F3B]" size={24} />
                Key Performance Indicators
              </h3>
              
              {employee.kpis && Object.keys(employee.kpis).length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(employee.kpis).map(([key, kpi]: [string, any]) => {
                    const status = getKpiStatus(kpi);
                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.01 }}
                        className={`p-6 rounded-lg border-2 ${getKPIBgColor(kpi.current || 0, kpi.target || 1)}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg text-gray-900">
                                {kpi.name || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                            {kpi.description && (
                              <p className="text-gray-600 text-sm mb-3">{kpi.description}</p>
                            )}
                            {kpi.dueDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Calendar size={14} />
                                <span>Due: {new Date(kpi.dueDate).toLocaleDateString()}</span>
                                {status === 'overdue' && (
                                  <span className="text-red-600 font-medium">(Overdue)</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className={getKPIColor(kpi.current || 0, kpi.target || 1)} size={24} />
                            {status !== 'completed' && (
                              <button
                                onClick={() => handleMarkAsFinished(key)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                Mark Finished
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white bg-opacity-50 p-3 rounded">
                            <div className="text-xs text-gray-600 mb-1">Current Progress</div>
                            <div className="text-2xl font-bold text-gray-900">{kpi.current || 0}</div>
                          </div>
                          <div className="bg-white bg-opacity-50 p-3 rounded">
                            <div className="text-xs text-gray-600 mb-1">Target</div>
                            <div className="text-2xl font-bold text-gray-900">{kpi.target || 0}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress:</span>
                            <span className={`font-medium ${getKPIColor(kpi.current || 0, kpi.target || 1)}`}>
                              {Math.round(((kpi.current || 0) / (kpi.target || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                ((kpi.current || 0) / (kpi.target || 1)) * 100 >= 100
                                  ? 'bg-green-500'
                                  : ((kpi.current || 0) / (kpi.target || 1)) * 100 >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(((kpi.current || 0) / (kpi.target || 1)) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Task Timeline */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Assigned: {kpi.assignedAt ? new Date(kpi.assignedAt).toLocaleDateString() : 'N/A'}
                            </span>
                            {kpi.completedAt && (
                              <span className="text-green-600 font-medium">
                                Completed: {new Date(kpi.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No KPIs assigned yet</p>
                </div>
              )}
            </div>

            {/* Manager Section */}
            {manager && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="text-[#1B1F3B]" size={24} />
                  Your Manager
                </h3>
                
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {manager.profile_photo ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={manager.profile_photo}
                        alt={manager.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                        <User className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{manager.name}</h4>
                    <p className="text-gray-600">{manager.position}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="text-gray-400" size={14} />
                        <span>{manager.email_work}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="text-gray-400" size={14} />
                        <span>{manager.location || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payslips */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-[#1B1F3B]" size={24} />
                Payslip History
              </h3>
              
              {employee.payslips && employee.payslips.length > 0 ? (
                <div className="space-y-3">
                  {employee.payslips.slice(0, 5).map((payslip, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#1B1F3B] transition cursor-pointer"
                      onClick={() => {
                        setSelectedPayslip(payslip);
                        setIsPayslipModalOpen(true);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {new Date(0, payslip.month - 1).toLocaleString('default', { month: 'long' })} {payslip.year}
                          </p>
                          <p className="text-sm text-gray-600">
                            Net: {formatCurrency(payslip.netSalary || 0)}
                          </p>
                        </div>
                        <Eye className="text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  ))}
                  {employee.payslips.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{employee.payslips.length - 5} more payslips
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No payslips available</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payslips:</span>
                  <span className="font-medium">{employee.payslips?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile Allowance:</span>
                  <span className="font-medium">
                    {employee.mobile_plan_allowance ? formatCurrency(employee.mobile_plan_allowance) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Internet Allowance:</span>
                  <span className="font-medium">
                    {employee.internet_plan_allowance ? formatCurrency(employee.internet_plan_allowance) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee Since:</span>
                  <span className="font-medium">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="text-[#1B1F3B]" size={20} />
                  Banking Details
                </h3>
                <button
                  onClick={() => setIsBankingModalOpen(true)}
                  className="bg-[#1B1F3B] text-white px-4 py-2 rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Manage Banking
                </button>
              </div>
              
              <div className="space-y-3">
                {employee.banking_details && employee.banking_details.length > 0 ? (
                  employee.banking_details.slice(0, 3).map((detail: any, index: number) => {
                    const getBankingTypeLabel = (type: string) => {
                      switch (type) {
                        case 'eft': return 'EFT Bank Transfer';
                        case 'mobile_wallet': return 'Mobile Wallet';
                        case 'paypal': return 'PayPal';
                        case 'airwallex': return 'Airwallex';
                        default: return type;
                      }
                    };

                    const getBankingDetailDisplay = (detail: any) => {
                      switch (detail.type) {
                        case 'eft':
                          return `${detail.bankName} - ****${detail.accountNumber?.slice(-4)}`;
                        case 'mobile_wallet':
                          return `${detail.walletType.toUpperCase()} - ${detail.phoneNumber}`;
                        case 'paypal':
                          return `PayPal - ${detail.paypalAddress}`;
                        case 'airwallex':
                          return `Airwallex - ${detail.airwallexAddress}`;
                        default:
                          return 'Unknown banking method';
                      }
                    };

                    return (
                      <div key={detail.id || index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {getBankingTypeLabel(detail.type)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {detail.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {getBankingDetailDisplay(detail)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <CreditCard size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No banking methods added yet</p>
                  </div>
                )}
                {employee.banking_details && employee.banking_details.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{employee.banking_details.length - 3} more banking methods
                  </p>
                )}
              </div>
            </div>

            {/* Leave Management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="text-[#1B1F3B]" size={20} />
                  Leave Management
                </h3>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-[#1B1F3B] text-white px-4 py-2 rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Apply for Leave
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Annual Leave Summary */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-blue-900">Annual Leave</span>
                    <span className="text-sm text-blue-700">
                      {(employee.annual_leave || [])
                        .filter((leave: any) => leave.status === 'approved')
                        .reduce((total: number, leave: any) => total + (leave.days || 0), 0)
                      } / 21 days used
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((employee.annual_leave || [])
                            .filter((leave: any) => leave.status === 'approved')
                            .reduce((total: number, leave: any) => total + (leave.days || 0), 0) / 21) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Sick Leave Summary */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-red-900">Sick Leave</span>
                    <span className="text-sm text-red-700">
                      {(employee.sick_leave || [])
                        .filter((leave: any) => leave.status === 'approved')
                        .reduce((total: number, leave: any) => total + (leave.days || 0), 0)
                      } / 14 days used
                    </span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((employee.sick_leave || [])
                            .filter((leave: any) => leave.status === 'approved')
                            .reduce((total: number, leave: any) => total + (leave.days || 0), 0) / 14) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Recent Leave Applications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Applications</h4>
                  {[...(employee.annual_leave || []), ...(employee.sick_leave || [])]
                    .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                    .slice(0, 3)
                    .map((leave: any, index: number) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg mb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {leave.type === 'annual' ? 'Annual' : 'Sick'} Leave
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                leave.status === 'approved' ? 'text-green-600 bg-green-100' :
                                leave.status === 'rejected' ? 'text-red-600 bg-red-100' :
                                'text-yellow-600 bg-yellow-100'
                              }`}>
                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.days} days)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {[...(employee.annual_leave || []), ...(employee.sick_leave || [])].length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No leave applications yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      <AnimatePresence>
        {isPayslipModalOpen && (
          <PayslipModal
            isOpen={isPayslipModalOpen}
            onClose={() => setIsPayslipModalOpen(false)}
            payslip={selectedPayslip}
          />
        )}
      </AnimatePresence>

      {/* Leave Application Modal */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <LeaveApplicationModal
            isOpen={isLeaveModalOpen}
            onClose={() => setIsLeaveModalOpen(false)}
            employee={employee}
            onApplyLeave={handleApplyLeave}
          />
        )}
      </AnimatePresence>

      {/* Banking Details Modal */}
      <AnimatePresence>
        {isBankingModalOpen && (
          <BankingDetailsModal
            isOpen={isBankingModalOpen}
            onClose={() => setIsBankingModalOpen(false)}
            employee={employee}
            onSaveBankingDetails={handleSaveBankingDetails}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ESPPage; 