import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  DollarSign, 
  FileText, 
  Download, 
  Eye, 
  X, 
  Calendar,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Building,
  LogOut,
  Save,
  User,
  Calculator,
  Target,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  employee?: Employee | null;
}

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onGenerate: (payslipData: any) => void;
}

interface KPIAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onAssign: (employeeId: string, kpis: any) => void;
}

interface LeaveManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onApplyLeave: (employeeId: string, leaveData: any) => void;
}

interface BankingDetailsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email_work: '',
    staff_number: '',
    position: '',
    salary: 0,
    location: '',
    mobile_plan_allowance: 0,
    internet_plan_allowance: 0,
    email_personal: '',
    employee_benefits_priority_code: '',
    date_of_birth: '',
    password_hash: 'temp_password_hash'
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        name: '',
        email_work: '',
        staff_number: '',
        position: '',
        salary: 0,
        location: '',
        mobile_plan_allowance: 0,
        internet_plan_allowance: 0,
        email_personal: '',
        employee_benefits_priority_code: '',
        date_of_birth: '',
        password_hash: 'temp_password_hash'
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Number *
              </label>
              <input
                type="text"
                value={formData.staff_number || ''}
                onChange={(e) => setFormData({ ...formData, staff_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email *
              </label>
              <input
                type="email"
                value={formData.email_work || ''}
                onChange={(e) => setFormData({ ...formData, email_work: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Email
              </label>
              <input
                type="email"
                value={formData.email_personal || ''}
                onChange={(e) => setFormData({ ...formData, email_personal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary
              </label>
              <input
                type="number"
                value={formData.salary || ''}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Plan Allowance
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.mobile_plan_allowance || ''}
                onChange={(e) => setFormData({ ...formData, mobile_plan_allowance: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internet Plan Allowance
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.internet_plan_allowance || ''}
                onChange={(e) => setFormData({ ...formData, internet_plan_allowance: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits Priority Code
              </label>
              <input
                type="text"
                value={formData.employee_benefits_priority_code || ''}
                onChange={(e) => setFormData({ ...formData, employee_benefits_priority_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2"
            >
              <Save size={16} />
              {employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, employee, onGenerate }) => {
  const [payslipData, setPayslipData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: employee?.salary || 0,
    allowances: {
      mobile: employee?.mobile_plan_allowance || 0,
      internet: employee?.internet_plan_allowance || 0,
      transport: 0,
      medical: 0
    },
    deductions: {
      tax: 0,
      insurance: 0,
      providentFund: 0
    },
    overtime: 0,
    bonus: 0
  });

  const payslipPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (employee) {
      setPayslipData(prev => ({
        ...prev,
        basicSalary: employee.salary || 0,
        allowances: {
          ...prev.allowances,
          mobile: employee.mobile_plan_allowance || 0,
          internet: employee.internet_plan_allowance || 0
        }
      }));
    }
  }, [employee]);

  const calculateTotal = () => {
    const totalAllowances = Object.values(payslipData.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(payslipData.deductions).reduce((sum, val) => sum + val, 0);
    const grossSalary = payslipData.basicSalary + totalAllowances + payslipData.overtime + payslipData.bonus;
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, netSalary, totalAllowances, totalDeductions };
  };

  const handleGenerate = () => {
    const calculations = calculateTotal();
    const fullPayslipData = {
      ...payslipData,
      ...calculations,
      employeeId: employee?.id,
      employeeName: employee?.name,
      staffNumber: employee?.staff_number,
      position: employee?.position,
      generatedAt: new Date().toISOString()
    };
    onGenerate(fullPayslipData);
  };

  const downloadPDF = () => {
    if (payslipPreviewRef.current && employee) {
      const monthName = new Date(0, payslipData.month - 1).toLocaleString('default', { month: 'long' });
      const filename = `${employee.name.replace(/\s+/g, '_')}_Payslip_${monthName}_${payslipData.year}.pdf`;
      
      html2canvas(payslipPreviewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate dimensions to fit the content properly
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        // Center the image on the page
        const x = 10; // 10mm left margin
        const y = Math.max(10, (pdfHeight - imgHeight) / 2); // Center vertically or 10mm from top
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(filename);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      });
    }
  };

  if (!isOpen || !employee) return null;

  const { grossSalary, netSalary, totalAllowances, totalDeductions } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Generate Payslip - {employee.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Input Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={payslipData.month}
                    onChange={(e) => setPayslipData({ ...payslipData, month: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={payslipData.year}
                    onChange={(e) => setPayslipData({ ...payslipData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
                <input
                  type="number"
                  step="0.01"
                  value={payslipData.basicSalary}
                  onChange={(e) => setPayslipData({ ...payslipData, basicSalary: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Allowances</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mobile Allowance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.allowances.mobile}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        allowances: { ...payslipData.allowances, mobile: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Internet Allowance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.allowances.internet}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        allowances: { ...payslipData.allowances, internet: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Transport Allowance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.allowances.transport}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        allowances: { ...payslipData.allowances, transport: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Medical Allowance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.allowances.medical}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        allowances: { ...payslipData.allowances, medical: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Deductions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tax</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.deductions.tax}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        deductions: { ...payslipData.deductions, tax: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Insurance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.deductions.insurance}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        deductions: { ...payslipData.deductions, insurance: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Provident Fund</label>
                    <input
                      type="number"
                      step="0.01"
                      value={payslipData.deductions.providentFund}
                      onChange={(e) => setPayslipData({
                        ...payslipData,
                        deductions: { ...payslipData.deductions, providentFund: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overtime</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payslipData.overtime}
                    onChange={(e) => setPayslipData({ ...payslipData, overtime: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bonus</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payslipData.bonus}
                    onChange={(e) => setPayslipData({ ...payslipData, bonus: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B]"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Payslip Preview</h3>
              <div ref={payslipPreviewRef} className="bg-white p-6 rounded border space-y-4 min-w-[400px]">
                <div className="text-center border-b pb-4">
                  <h4 className="font-bold text-xl text-[#1B1F3B]">Konta Nibo</h4>
                  <p className="text-sm text-gray-600">Financial Comparison Platform</p>
                  <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
                  <h5 className="font-semibold text-lg mt-2">PAYSLIP</h5>
                  <p className="text-sm text-gray-600">For the month of {new Date(0, payslipData.month - 1).toLocaleString('default', { month: 'long' })} {payslipData.year}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Employee Name:</span>
                      <span>{employee.name}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Staff Number:</span>
                      <span>{employee.staff_number}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Position:</span>
                      <span>{employee.position}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Email:</span>
                      <span className="text-xs">{employee.email_work}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Location:</span>
                      <span>{employee.location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Pay Period:</span>
                      <span>{new Date(0, payslipData.month - 1).toLocaleString('default', { month: 'short' })} {payslipData.year}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h6 className="font-semibold text-sm mb-3 text-[#1B1F3B]">EARNINGS</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span>৳{payslipData.basicSalary.toLocaleString()}</span>
                    </div>
                    {payslipData.allowances.mobile > 0 && (
                      <div className="flex justify-between">
                        <span>Mobile Allowance:</span>
                        <span>৳{payslipData.allowances.mobile.toLocaleString()}</span>
                      </div>
                    )}
                    {payslipData.allowances.internet > 0 && (
                      <div className="flex justify-between">
                        <span>Internet Allowance:</span>
                        <span>৳{payslipData.allowances.internet.toLocaleString()}</span>
                      </div>
                    )}
                    {payslipData.allowances.transport > 0 && (
                      <div className="flex justify-between">
                        <span>Transport Allowance:</span>
                        <span>৳{payslipData.allowances.transport.toLocaleString()}</span>
                      </div>
                    )}
                    {payslipData.allowances.medical > 0 && (
                      <div className="flex justify-between">
                        <span>Medical Allowance:</span>
                        <span>৳{payslipData.allowances.medical.toLocaleString()}</span>
                      </div>
                    )}
                    {payslipData.overtime > 0 && (
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span>৳{payslipData.overtime.toLocaleString()}</span>
                      </div>
                    )}
                    {payslipData.bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span>৳{payslipData.bonus.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Gross Salary:</span>
                      <span>৳{grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {totalDeductions > 0 && (
                  <div className="border-t pt-4">
                    <h6 className="font-semibold text-sm mb-3 text-[#1B1F3B]">DEDUCTIONS</h6>
                    <div className="space-y-2 text-sm">
                      {payslipData.deductions.tax > 0 && (
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span className="text-red-600">৳{payslipData.deductions.tax.toLocaleString()}</span>
                        </div>
                      )}
                      {payslipData.deductions.insurance > 0 && (
                        <div className="flex justify-between">
                          <span>Insurance:</span>
                          <span className="text-red-600">৳{payslipData.deductions.insurance.toLocaleString()}</span>
                        </div>
                      )}
                      {payslipData.deductions.providentFund > 0 && (
                        <div className="flex justify-between">
                          <span>Provident Fund:</span>
                          <span className="text-red-600">৳{payslipData.deductions.providentFund.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Deductions:</span>
                        <span className="text-red-600">৳{totalDeductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-[#1B1F3B] pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>NET SALARY:</span>
                    <span className="text-green-600">৳{netSalary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4 text-xs text-gray-500">
                  <p>Generated on: {new Date().toLocaleDateString('en-GB')}</p>
                  <p className="mt-1">This is a computer-generated payslip and does not require a signature.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={handleGenerate}
              className="px-6 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2"
            >
              <FileText size={16} />
              Generate Payslip
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const KPIAssignmentModal: React.FC<KPIAssignmentModalProps> = ({ isOpen, onClose, employee, onAssign }) => {
  const [kpis, setKpis] = useState<any>({});
  const [newKpiName, setNewKpiName] = useState('');
  const [newKpiTarget, setNewKpiTarget] = useState('');
  const [newKpiCurrent, setNewKpiCurrent] = useState('');
  const [newKpiDescription, setNewKpiDescription] = useState('');
  const [newKpiDueDate, setNewKpiDueDate] = useState('');

  useEffect(() => {
    if (employee && employee.kpis) {
      setKpis(employee.kpis);
    } else {
      setKpis({});
    }
  }, [employee, isOpen]);

  const handleAddKpi = () => {
    if (!newKpiName || !newKpiTarget || !newKpiDueDate) return;

    const kpiKey = newKpiName.toLowerCase().replace(/\s+/g, '_');
    setKpis({
      ...kpis,
      [kpiKey]: {
        name: newKpiName,
        description: newKpiDescription,
        target: parseFloat(newKpiTarget) || 0,
        current: parseFloat(newKpiCurrent) || 0,
        unit: 'units',
        dueDate: newKpiDueDate,
        status: 'pending',
        assignedAt: new Date().toISOString(),
        completedAt: null
      }
    });

    setNewKpiName('');
    setNewKpiTarget('');
    setNewKpiCurrent('');
    setNewKpiDescription('');
    setNewKpiDueDate('');
  };

  const handleUpdateKpi = (key: string, field: string, value: any) => {
    setKpis({
      ...kpis,
      [key]: {
        ...kpis[key],
        [field]: field === 'target' || field === 'current' ? parseFloat(value) || 0 : value
      }
    });
  };

  const handleRemoveKpi = (key: string) => {
    const updatedKpis = { ...kpis };
    delete updatedKpis[key];
    setKpis(updatedKpis);
  };

  const handleSave = () => {
    if (!employee) return;
    onAssign(employee.id, kpis);
    onClose();
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

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="text-[#1B1F3B]" size={24} />
            Assign KPIs to {employee.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Add New KPI Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New KPI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KPI Name *
                </label>
                <input
                  type="text"
                  value={newKpiName}
                  onChange={(e) => setNewKpiName(e.target.value)}
                  placeholder="e.g., Sales Target"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newKpiDueDate}
                  onChange={(e) => setNewKpiDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newKpiDescription}
                onChange={(e) => setNewKpiDescription(e.target.value)}
                placeholder="Describe the task or goal in detail..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  value={newKpiTarget}
                  onChange={(e) => setNewKpiTarget(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value
                </label>
                <input
                  type="number"
                  value={newKpiCurrent}
                  onChange={(e) => setNewKpiCurrent(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddKpi}
                  disabled={!newKpiName || !newKpiTarget || !newKpiDueDate}
                  className="w-full px-4 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  Add KPI
                </button>
              </div>
            </div>
          </div>

          {/* Existing KPIs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current KPIs</h3>
            {Object.keys(kpis).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No KPIs assigned yet. Add some KPIs above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(kpis).map(([key, kpi]: [string, any]) => {
                  const status = getKpiStatus(kpi);
                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="text"
                              value={kpi.name || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              onChange={(e) => handleUpdateKpi(key, 'name', e.target.value)}
                              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#1B1F3B] rounded px-2 py-1"
                            />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={kpi.description || ''}
                              onChange={(e) => handleUpdateKpi(key, 'description', e.target.value)}
                              placeholder="Add description..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveKpi(key)}
                          className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target
                          </label>
                          <input
                            type="number"
                            value={kpi.target || 0}
                            onChange={(e) => handleUpdateKpi(key, 'target', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current
                          </label>
                          <input
                            type="number"
                            value={kpi.current || 0}
                            onChange={(e) => handleUpdateKpi(key, 'current', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={kpi.dueDate || ''}
                            onChange={(e) => handleUpdateKpi(key, 'dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={kpi.status || 'pending'}
                            onChange={(e) => handleUpdateKpi(key, 'status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(((kpi.current || 0) / (kpi.target || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
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

                      {/* Task Info */}
                      <div className="mt-3 text-xs text-gray-500 flex justify-between">
                        <span>Assigned: {kpi.assignedAt ? new Date(kpi.assignedAt).toLocaleDateString() : 'N/A'}</span>
                        {kpi.completedAt && (
                          <span>Completed: {new Date(kpi.completedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#1B1F3B] text-white rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2"
            >
              <Save size={16} />
              Save KPIs
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LeaveManagementModal: React.FC<LeaveManagementModalProps> = ({ isOpen, onClose, employee, onApplyLeave }) => {
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

    onApplyLeave(employee.id, leaveApplication);
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
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CalendarDays className="text-[#1B1F3B]" size={24} />
            Leave Management - {employee.name}
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
                      <span className="font-medium text-gray-700">Total Used:</span>
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

const BankingDetailsViewModal: React.FC<BankingDetailsViewModalProps> = ({ isOpen, onClose, employee }) => {
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
        return {
          primary: `${detail.bankName}`,
          secondary: `BSB: ${detail.bsb} | Account: ${detail.accountNumber}`,
          tertiary: `Branch: ${detail.branch}`
        };
      case 'mobile_wallet':
        return {
          primary: `${detail.walletType.toUpperCase()}`,
          secondary: `Phone: ${detail.phoneNumber}`,
          tertiary: ''
        };
      case 'paypal':
        return {
          primary: 'PayPal',
          secondary: `Email: ${detail.paypalAddress}`,
          tertiary: ''
        };
      case 'airwallex':
        return {
          primary: 'Airwallex',
          secondary: `Address: ${detail.airwallexAddress}`,
          tertiary: ''
        };
      default:
        return {
          primary: 'Unknown banking method',
          secondary: '',
          tertiary: ''
        };
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CreditCard className="text-[#1B1F3B]" size={24} />
            Banking Details - {employee.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                {employee.profile_photo ? (
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={employee.profile_photo}
                    alt={employee.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-500">Staff Number: {employee.staff_number}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Banking Methods</h4>
            
            {employee.banking_details && employee.banking_details.length > 0 ? (
              <div className="space-y-4">
                {employee.banking_details.map((detail: any, index: number) => {
                  const displayInfo = getBankingDetailDisplay(detail);
                  return (
                    <div key={detail.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-lg text-gray-900">
                              {getBankingTypeLabel(detail.type)}
                            </h5>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                              {detail.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-gray-900 font-medium">
                              {displayInfo.primary}
                            </div>
                            {displayInfo.secondary && (
                              <div className="text-gray-700">
                                {displayInfo.secondary}
                              </div>
                            )}
                            {displayInfo.tertiary && (
                              <div className="text-gray-600">
                                {displayInfo.tertiary}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Added: {new Date(detail.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional details for EFT */}
                      {detail.type === 'eft' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Bank Name:</span>
                              <div className="text-gray-900">{detail.bankName}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">BSB:</span>
                              <div className="text-gray-900">{detail.bsb}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Account Number:</span>
                              <div className="text-gray-900 font-mono">{detail.accountNumber}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Branch:</span>
                              <div className="text-gray-900">{detail.branch}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CreditCard size={64} className="mx-auto mb-4 text-gray-300" />
                <h5 className="text-lg font-medium text-gray-900 mb-2">No Banking Details</h5>
                <p>This employee hasn't added any banking methods yet.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Total Banking Methods: {employee.banking_details?.length || 0}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HRPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isBankingModalOpen, setIsBankingModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select();

      if (error) throw error;
      if (data) {
        setEmployees([...employees, data[0]]);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    }
  };

  const handleUpdateEmployee = async (employeeData: Partial<Employee>) => {
    if (!editingEmployee) return;

    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', editingEmployee.id)
        .select();

      if (error) throw error;
      if (data) {
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? data[0] : emp));
        setIsAddModalOpen(false);
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    }
  };

  const handleGeneratePayslip = async (payslipData: any) => {
    try {
      const employee = employees.find(emp => emp.id === payslipData.employeeId);
      if (!employee) return;

      const updatedPayslips = [...(employee.payslips || []), payslipData];

      const { error } = await supabase
        .from('employees')
        .update({ payslips: updatedPayslips })
        .eq('id', employee.id);

      if (error) throw error;

      // Update local state
      setEmployees(employees.map(emp => 
        emp.id === employee.id 
          ? { ...emp, payslips: updatedPayslips }
          : emp
      ));

      setIsPayslipModalOpen(false);
      alert('Payslip generated successfully!');
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Error generating payslip. Please try again.');
    }
  };

  const handleAssignKPIs = async (employeeId: string, kpis: any) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ kpis: kpis })
        .eq('id', employeeId);

      if (error) throw error;

      // Update local state
      setEmployees(employees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, kpis: kpis }
          : emp
      ));

      setIsKPIModalOpen(false);
      alert('KPIs assigned successfully!');
    } catch (error) {
      console.error('Error assigning KPIs:', error);
      alert('Error assigning KPIs. Please try again.');
    }
  };

  const handleApplyLeave = async (employeeId: string, leaveData: any) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;

      const leaveType = leaveData.type;
      const currentLeaves = leaveType === 'annual' ? (employee.annual_leave || []) : (employee.sick_leave || []);
      const updatedLeaves = [...currentLeaves, leaveData];

      const updateData = leaveType === 'annual' 
        ? { annual_leave: updatedLeaves }
        : { sick_leave: updatedLeaves };

      const { error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', employeeId);

      if (error) throw error;

      // Update local state
      setEmployees(employees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, ...updateData }
          : emp
      ));

      setIsLeaveModalOpen(false);
      alert('Leave application submitted successfully! Awaiting approval subject to leave allowance.');
    } catch (error) {
      console.error('Error applying for leave:', error);
      alert('Error submitting leave application. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrAuth');
    navigate('/hr-login');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email_work.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.staff_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

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
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">HR Management</h1>
            <p className="text-xl">Manage employees, payroll, and generate payslips</p>
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
        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsAddModalOpen(true);
              }}
              className="bg-[#1B1F3B] text-white px-6 py-2 rounded-lg hover:bg-[#2d325f] transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-[#1B1F3B]">{employees.length}</p>
              </div>
              <Users className="text-[#1B1F3B]" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0))}
                </p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Salary</p>
                <p className="text-2xl font-bold text-blue-600">
                  {employees.length > 0 
                    ? formatCurrency(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length)
                    : '৳0'
                  }
                </p>
              </div>
              <Calculator className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payslips Generated</p>
                <p className="text-3xl font-bold text-purple-600">
                  {employees.reduce((sum, emp) => sum + (emp.payslips?.length || 0), 0)}
                </p>
              </div>
              <FileText className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Employees ({filteredEmployees.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payslips
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {employee.profile_photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={employee.profile_photo}
                                alt={employee.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                                <User className="text-white" size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.staff_number}</div>
                            <div className="text-sm text-gray-500">{employee.email_work}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.position}</div>
                        {employee.location && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {employee.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.salary ? formatCurrency(employee.salary) : 'Not set'}
                        </div>
                        {(employee.mobile_plan_allowance || employee.internet_plan_allowance) && (
                          <div className="text-xs text-gray-500">
                            +{formatCurrency((employee.mobile_plan_allowance || 0) + (employee.internet_plan_allowance || 0))} allowances
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.location || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {employee.payslips?.length || 0} generated
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingEmployee(employee);
                              setIsAddModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit Employee"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsPayslipModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Generate Payslip"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsKPIModalOpen(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                            title="Assign KPIs"
                          >
                            <Target size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsLeaveModalOpen(true);
                            }}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                            title="Manage Leave"
                          >
                            <CalendarDays size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsBankingModalOpen(true);
                            }}
                            className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-50"
                            title="View Banking Details"
                          >
                            <CreditCard size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddEmployeeModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingEmployee(null);
            }}
            onSave={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
            employee={editingEmployee}
          />
        )}
        {isPayslipModalOpen && (
          <PayslipModal
            isOpen={isPayslipModalOpen}
            onClose={() => setIsPayslipModalOpen(false)}
            employee={selectedEmployee}
            onGenerate={handleGeneratePayslip}
          />
        )}
        {isKPIModalOpen && (
          <KPIAssignmentModal
            isOpen={isKPIModalOpen}
            onClose={() => setIsKPIModalOpen(false)}
            employee={selectedEmployee}
            onAssign={handleAssignKPIs}
          />
        )}
        {isLeaveModalOpen && (
          <LeaveManagementModal
            isOpen={isLeaveModalOpen}
            onClose={() => setIsLeaveModalOpen(false)}
            employee={selectedEmployee}
            onApplyLeave={handleApplyLeave}
          />
        )}
        {isBankingModalOpen && (
          <BankingDetailsViewModal
            isOpen={isBankingModalOpen}
            onClose={() => setIsBankingModalOpen(false)}
            employee={selectedEmployee}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HRPage; 
