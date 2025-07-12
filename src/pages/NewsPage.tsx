import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './NewsPage.module.css';

interface NewsArticle {
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

const NewsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false });

      if (error) throw error;
      if (data) {
        setArticles(data);
        // Set currentIndex to 1 (2nd article) if there are at least 2 articles, otherwise 0
        setCurrentIndex(data.length >= 2 ? 1 : 0);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : articles.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < articles.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1F3B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-[#1B1F3B] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">No articles available</h2>
          <p className="text-gray-300">Check back later for new content</p>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];
  const formattedDate = new Date(currentArticle.publish_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={styles.newsContainer}>
      <div className={styles.articleContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className={styles.articleContent}
            onClick={() => navigate(`/news/${currentArticle.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <span className={styles.categoryTag}>
                {currentArticle.category}
              </span>
              <span className={styles.date}>{formattedDate}</span>
            </div>
            
            <h1 className={styles.title}>{currentArticle.title}</h1>
            
            <div className={styles.authorSection}>
              {currentArticle.author_image && (
                <div className={styles.authorImage}>
                  <img src={currentArticle.author_image} alt={currentArticle.author} />
                </div>
              )}
              <span className={styles.authorName}>{currentArticle.author}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentArticle.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.featuredImage}
            onClick={() => navigate(`/news/${currentArticle.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={currentArticle.image_url} alt={currentArticle.title} />
          </motion.div>
        </AnimatePresence>

        <div className={styles.backgroundAccent} />
      </div>

      <div className={styles.navigationArrows}>
        <button onClick={handlePrevious} className={styles.navButton}>
          <ChevronUp size={24} />
        </button>
        <button onClick={handleNext} className={styles.navButton}>
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default NewsPage; 