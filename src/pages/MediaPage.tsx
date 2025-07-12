import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Save, Image, Tag, Calendar, Clock, User, FileText, AlignLeft, Upload, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publish_date: string;
  read_time: string;
  category: string;
  image_url: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string;
  tags: string;
  read_time: string;
  publish_date: string;
}

const MediaPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    image_url: '',
    tags: '',
    read_time: '5 min read',
    publish_date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Partial<ArticleForm>>({});

  const categories = ['Technology', 'Finance', 'Investment', 'Security', 'Real Estate'];

  const navigate = useNavigate();

  const refreshArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ArticleForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ArticleForm> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.image_url.trim()) newErrors.image_url = 'Image URL is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Validate image URL format
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started...');
    
    // Validate form before submission
    if (!validateForm()) {
      const errorMsg = 'Please fix the errors below';
      console.error('Form validation failed:', errors);
      setSubmitMessage(errorMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      console.log('Raw form data:', formData);

      // Parse tags from comma-separated string to array
      const parsedTags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      console.log('Parsed tags:', parsedTags);

      // Convert form data to article format
      const articleData: Omit<Article, 'id'> = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        category: formData.category,
        image_url: formData.image_url.trim(),
        tags: parsedTags,
        read_time: formData.read_time.trim(),
        likes: 0,
        comments: 0,
        views: 0,
        is_published: true,
        publish_date: formData.publish_date
      };

      console.log('Prepared article data:', articleData);

      await handlePublishArticle(articleData);
      console.log('Article published successfully');
      
      // Clear form after successful submission
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: 'Technology',
        image_url: '',
        tags: '',
        read_time: '5 min read',
        publish_date: new Date().toISOString().split('T')[0]
      });

      setSubmitMessage('Article published successfully!');
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish article';
      console.error('Error details:', {
        type: typeof error,
        message: errorMessage,
        fullError: error
      });
      setSubmitMessage(`Failed to publish article: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Technology',
      image_url: '',
      tags: '',
      read_time: '5 min read',
      publish_date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setSubmitMessage('');
  };

  const handlePublishArticle = async (articleData: Omit<Article, 'id'>) => {
    setPublishError(null);
    try {
      console.log('Starting article publication process...');
      console.log('Article data received:', articleData);

      // Validate required fields
      const requiredFields = ['title', 'excerpt', 'content', 'author', 'category', 'image_url'];
      const missingFields = requiredFields.filter(field => !articleData[field as keyof typeof articleData]);
      if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(', ')}`;
        console.error('Validation error:', error);
        throw new Error(error);
      }

      // Validate data types and formats
      if (!isValidUrl(articleData.image_url)) {
        const error = 'Invalid image URL format';
        console.error('URL validation error:', error);
        throw new Error(error);
      }

      // Format the date as YYYY-MM-DD for PostgreSQL date type
      const formattedDate = new Date(articleData.publish_date).toISOString().split('T')[0];
      console.log('Formatted publish date:', formattedDate);

      // Format tags as a JSON string array
      const formattedTags = JSON.stringify(
        articleData.tags.map(tag => tag.trim()).filter(Boolean)
      );
      console.log('Formatted tags:', formattedTags);

      // Ensure proper data formatting according to the database schema
      const formattedData = {
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        author: articleData.author,
        category: articleData.category,
        image_url: articleData.image_url,
        publish_date: formattedDate,
        read_time: articleData.read_time || '5 min read',
        likes: 0,
        comments: 0,
        views: 0,
        tags: formattedTags,
        is_published: true
      };

      console.log('Final formatted data for database:', formattedData);

      // Insert the article into Supabase
      console.log('Attempting to insert article into database...');
      const { data, error } = await supabase
        .from('news_articles')
        .insert([formattedData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insertion error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });

        // Handle specific error cases
        if (error.code === '23505') {
          throw new Error('An article with this title already exists');
        } else if (error.code === '23503') {
          throw new Error('Invalid category selected');
        } else if (error.code === '23502') {
          throw new Error('Required field is null');
        } else if (error.code?.startsWith('22')) {
          throw new Error('Invalid data format: ' + error.message);
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      if (!data) {
        console.error('No data returned from insert operation');
        throw new Error('No result returned from insert query');
      }

      console.log('Article successfully published:', data);
      await refreshArticles();
      return data;
    } catch (error) {
      console.error('Article publication failed:', error);
      console.error('Full error details:', {
        name: error instanceof Error ? error.name : 'Unknown error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setPublishError(error instanceof Error ? error.message : 'Failed to publish article');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50"
    >
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Media Center</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
            <p className="text-xl text-gray-600">Create and publish news articles for your financial platform</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Create New Article</h2>
            </div>

            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Author and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.author ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Publish Date and Read Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} />
                    Publish Date
                  </label>
                  <input
                    type="date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} />
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} />
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.image_url ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>}
                <p className="mt-1 text-sm text-gray-500">Enter the URL of the article's featured image</p>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Fintech, AI, Banking, Innovation (comma-separated)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <AlignLeft size={16} />
                  Article Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief summary or excerpt of the article..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
              </div>

              {/* Content */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Article Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Write your full article content here..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Publish Article
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MediaPage; 