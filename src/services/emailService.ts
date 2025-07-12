import { supabase } from '../lib/supabase';

// Use production URL or fallback to localhost for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://kontanibo.com/api'
  : 'http://localhost:5000/api';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface BankNotificationData {
  bankName: string;
  bankEmail: string;
  subject: string;
  content: string;
}

const handleResponse = async (response: Response) => {
  try {
    const contentType = response.headers.get('content-type');
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response status:', response.status);
    
    const responseData = await response.text();
    console.log('Raw response:', responseData);
    
    let data;
    try {
      data = JSON.parse(responseData);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.error || 'Server error');
    }
    
    return data;
  } catch (error) {
    console.error('Error handling response:', error);
    throw error;
  }
};

export const emailService = {
  // Send email using Supabase
  sendEmail: async (data: EmailData) => {
    try {
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_type: 'email',
            email: data.to,
            data: {
              subject: data.subject,
              html: data.html
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Form submitted successfully',
        data: submission
      };
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  // Contact form submission
  submitContactForm: async (data: ContactFormData) => {
    try {
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_type: 'contact',
            email: data.email,
            data: {
              name: data.name,
              message: data.message
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Contact form submitted successfully',
        data: submission
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Bank notification
  sendBankNotification: async (data: BankNotificationData) => {
    try {
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_type: 'bank_notification',
            email: data.bankEmail,
            data: {
              bankName: data.bankName,
              subject: data.subject,
              content: data.content
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Bank notification submitted successfully',
        data: submission
      };
    } catch (error) {
      console.error('Error sending bank notification:', error);
      throw error;
    }
  },

  // Check submission status
  checkSubmissionStatus: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        status: data.status,
        data: data
      };
    } catch (error) {
      console.error('Error checking submission status:', error);
      throw error;
    }
  },

  // Health check
  checkHealth: async () => {
    try {
      console.log('Checking email service health');
      
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error checking email service health:', error);
      throw new Error(error instanceof Error ? error.message : 'Email service health check failed');
    }
  }
}; 