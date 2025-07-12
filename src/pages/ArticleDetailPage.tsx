import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './ArticleDetailPage.module.css';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  author_image?: string;
  publish_date: string;
  read_time: string;
  category: string;
  image_url: string;
  additional_image_url?: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
}

const ArticleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setArticle(data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <button
            onClick={() => navigate('/news')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to News
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.publish_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.container}
    >
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.button
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/news')}
            className={styles.backButton}
          >
            <ArrowLeft size={20} />
            Back to News
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.category}>{article.category}</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.title}
          >
            {article.title}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={styles.metadata}
          >
            <div className={styles.author}>
              {article.author_image && (
                <img
                  src={article.author_image}
                  alt={article.author}
                  className={styles.authorImage}
                />
              )}
              <span className={styles.authorName}>{article.author}</span>
            </div>
            <div className={styles.articleInfo}>
              <span className={styles.infoItem}>
                <Calendar size={16} />
                {formattedDate}
              </span>
              <span className={styles.infoItem}>
                <Clock size={16} />
                {article.read_time}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={styles.mainContent}
      >
        <div className={styles.featuredImage}>
          <img src={article.image_url} alt={article.title} />
        </div>

        <div className={styles.articleContent}>
          <p className={styles.excerpt}>{article.excerpt}</p>
          
          {/* Article content */}
          <div className="prose prose-lg prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className={styles.tags}>
              {article.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleDetailPage; 