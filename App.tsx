import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, BookOpen, Award, Users, Clock, Star, ChevronRight, ChevronDown,
  Menu, X, Search, Filter, CheckCircle, ArrowRight,
  Code, Laptop, Zap, Shield, Heart, Globe2, TrendingUp,
  Award as AwardIcon,
  PlayCircle, RotateCcw, Share2, Timer, Trophy
} from 'lucide-react';
import './i18n';
import { fetchCourses, Course } from './services/api';

type Page = 'home' | 'courses' | 'dashboard' | 'quiz' | 'login' | 'signup';
type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the correct way to create a React component?',
    options: [
      'function Component() { return <div />; }',
      'const Component = () => { return <div />; }',
      'Both A and B',
      'None of the above'
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    question: 'Which hook is used for side effects in React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1
  },
  {
    id: 3,
    question: 'What does JSX stand for?',
    options: [
      'JavaScript XML',
      'Java Syntax Extension',
      'JavaScript Extension',
      'JSON XML'
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: 'Which method is used to update state in React?',
    options: ['setState', 'updateState', 'changeState', 'modifyState'],
    correctAnswer: 0
  },
  {
    id: 5,
    question: 'What is the virtual DOM?',
    options: [
      'A copy of the real DOM',
      'A lightweight representation of the DOM',
      'A browser feature',
      'A CSS framework'
    ],
    correctAnswer: 1
  }
];

function BackButton({ onClick, label = 'Back to Home' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/30 rounded-xl hover:border-purple-500/60 hover:from-purple-600/20 hover:to-indigo-600/20 transition-all duration-300 mb-8 overflow-hidden backdrop-blur-sm"
      whileHover={{ x: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
        <ChevronRight className="w-5 h-5 text-white rotate-180" />
        <div className="absolute inset-0 rounded-xl border-2 border-purple-400/50 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" />
      </div>
      <span className="relative text-sm font-semibold bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-white transition-all duration-300">
        {label}
      </span>
      <div className="relative flex gap-1 ml-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [0, 1, 0],
              x: [0, i * 6, i * 12],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-purple-400/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-purple-400/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentTip, setCurrentTip] = useState(0);

  const loadingTips = [
    'Initializing system...',
    'Loading resources...',
    'Preparing courses...',
    'Setting up your profile...',
    'Almost ready...',
    'Finalizing...',
  ];

  useEffect(() => {
    const duration = 5000;
    const interval = 40;
    const increment = 100 / (duration / interval);
    
    let current = 0;
    let tipIndex = 0;
    
    const timer = setInterval(() => {
      current += increment + (Math.random() * 2 - 1);
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
      
      setProgress(current);
      setDisplayText(`${current.toFixed(1)}%`);
      
      const newTipIndex = Math.min(Math.floor(current / 20), loadingTips.length - 1);
      if (newTipIndex !== tipIndex) {
        tipIndex = newTipIndex;
        setCurrentTip(newTipIndex);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="hidden md:block absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(102, 126, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 126, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
        <style>{`
          @keyframes gridMove {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
          }
        `}</style>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            initial={{ top: `${i * 20}%`, opacity: 0 }}
            animate={{ 
              top: `${(i * 20 + 100) % 100}%`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="hidden md:block absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/50 rounded-tl-3xl" />
      <div className="hidden md:block absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/50 rounded-tr-3xl" />
      <div className="hidden md:block absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/50 rounded-bl-3xl" />
      <div className="hidden md:block absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/50 rounded-br-3xl" />

      <div className="relative z-10 w-full max-w-3xl px-4 sm:px-8 flex flex-col items-center gap-6 sm:gap-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-400/50">
            <Code className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              WebForg
            </span>
          </h1>
          <p className="text-gray-400 text-lg tracking-widest uppercase">
            Premium Learning Platform
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-3xl" />
          <div className="relative flex items-baseline gap-1">
            <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight">
              <span className="bg-gradient-to-r from-purple-300 via-white to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">
                {displayText}
              </span>
            </div>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </motion.div>

        <div className="w-full relative">
          <div className="relative h-8 bg-gray-900/80 rounded-lg overflow-hidden border-2 border-purple-500/30 shadow-[0_0_30px_rgba(102,126,234,0.3)]">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
            <motion.div
              className="h-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600" />
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                  animation: 'stripeMove 1s linear infinite',
                }}
              />
              <style>{`
                @keyframes stripeMove {
                  0% { background-position: 0 0; }
                  100% { background-position: 40px 0; }
                }
              `}</style>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
            </motion.div>
            <div className="absolute inset-0 border border-purple-400/30 rounded-lg" />
          </div>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-10 bg-gradient-to-r from-purple-600 to-transparent rounded-l-lg blur-sm" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-10 bg-gradient-to-l from-indigo-600 to-transparent rounded-r-lg blur-sm" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-purple-400 font-mono text-lg tracking-wider">
              {loadingTips[currentTip]}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-full"
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-8 mt-8 text-gray-500 text-sm font-mono"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>SYSTEM READY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>v2.0.26</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span>SECURE</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </motion.div>
  );
}

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={i18n.language}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Globe2 className="w-4 h-4" />
          <span className="font-semibold text-sm">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

function Navbar({ 
  currentPage, 
  setCurrentPage,
  isLoggedIn,
  currentUser,
  onLogout
}: { 
  currentPage: Page; 
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  currentUser: any;
  onLogout: () => void;
}) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: t('nav.home') },
    { id: 'courses', label: t('nav.courses') },
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'quiz', label: t('nav.quiz') }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              WebForg
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  currentPage === item.id
                    ? 'text-purple-400'
                    : 'text-gray-300 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium">{currentUser?.name || 'User'}</span>
                  </motion.div>
                  <motion.button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t('nav.logout')}
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => setCurrentPage('login')}
                    className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t('nav.login')}
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentPage('signup')}
                    className="btn-primary text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('nav.signup')}
                  </motion.button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left text-lg font-medium py-2 ${
                    currentPage === item.id
                      ? 'text-purple-400'
                      : 'text-gray-300'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setCurrentPage('login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 text-center text-white font-medium"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('signup');
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-primary py-3"
                >
                  {t('nav.signup')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center lg:text-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-purple-500/30"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                {t('common.new')} - {t('hero.title')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => setCurrentPage('courses')}
                className="btn-primary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setCurrentPage('courses')}
                className="btn-secondary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-5 h-5" />
                {t('hero.secondary')}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/10"
            >
              {[
                { value: '50K+', label: t('hero.stats.students') },
                { value: '100+', label: t('hero.stats.courses') },
                { value: '50+', label: t('hero.stats.instructors') },
                { value: '1000+', label: t('hero.stats.hours') }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
                  className="text-center lg:text-start group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block h-[500px] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 blur-3xl" />
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.svg
                viewBox="0 0 500 400"
                className="w-full h-full max-w-lg"
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.3, type: 'spring' }}
              >
                <defs>
                  <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#764ba2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4facfe" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="code1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="code2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="code3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="code4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="code5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="monitorFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2d2d44" />
                    <stop offset="100%" stopColor="#1a1a2e" />
                  </linearGradient>
                  <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3d3d5c" />
                    <stop offset="100%" stopColor="#2d2d44" />
                  </linearGradient>
                </defs>
                
                <circle cx="250" cy="200" r="190" fill="url(#screenGlow)" />
                
                <motion.ellipse
                  cx="250"
                  cy="340"
                  rx="80"
                  ry="12"
                  fill="url(#baseGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
                
                <motion.rect
                  x="225"
                  y="280"
                  width="50"
                  height="60"
                  fill="url(#monitorFrame)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
                
                <motion.rect
                  x="100"
                  y="80"
                  width="300"
                  height="200"
                  rx="12"
                  fill="url(#monitorFrame)"
                  stroke="#4a4a6a"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                />
                
                <rect x="115" y="95" width="270" height="170" rx="6" fill="#0d0d1a" />
                <rect x="115" y="95" width="270" height="170" rx="6" fill="url(#screenGlow)" opacity="0.2" />
                
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.rect
                    x="135"
                    y="115"
                    width="180"
                    height="8"
                    rx="3"
                    fill="url(#code1)"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  />
                  <motion.rect
                    x="135"
                    y="130"
                    width="220"
                    height="8"
                    rx="3"
                    fill="url(#code2)"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.rect
                    x="135"
                    y="145"
                    width="160"
                    height="8"
                    rx="3"
                    fill="url(#code3)"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                  />
                  <motion.rect
                    x="135"
                    y="160"
                    width="200"
                    height="8"
                    rx="3"
                    fill="url(#code4)"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
                  />
                  <motion.rect
                    x="135"
                    y="175"
                    width="175"
                    height="8"
                    rx="3"
                    fill="url(#code5)"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                  />
                  <motion.rect
                    x="135"
                    y="190"
                    width="190"
                    height="8"
                    rx="3"
                    fill="#fb923c"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />
                </motion.g>
                
                <motion.rect
                  x="160"
                  y="300"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#1a1a2e"
                  stroke="#4a4a6a"
                  strokeWidth="1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                />
                
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.rect
                      key={i}
                      x={170 + (i % 6) * 28}
                      y={305 + Math.floor(i / 6) * 12}
                      width="18"
                      height="8"
                      rx="2"
                      fill="#2d2d44"
                      animate={{
                        fill: ['#2d2d44', '#4a4a6a', '#2d2d44']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.g>
                
                <motion.g
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <text x="60" y="140" fill="#667eea" fontSize="28" fontWeight="bold" opacity="0.7">&lt;/&gt;</text>
                  <text x="50" y="200" fill="#764ba2" fontSize="22" opacity="0.6">function</text>
                  <text x="55" y="260" fill="#4facfe" fontSize="20" opacity="0.5">import</text>
                  <text x="420" y="160" fill="#764ba2" fontSize="32" fontWeight="bold" opacity="0.7">{`{ }`}</text>
                  <text x="410" y="220" fill="#00f2fe" fontSize="22" opacity="0.6">export</text>
                  <text x="415" y="280" fill="#c084fc" fontSize="20" opacity="0.5">return</text>
                </motion.g>
                
                <motion.rect
                  x="330"
                  y="190"
                  width="3"
                  height="12"
                  fill="#ffffff"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={100 + Math.random() * 300}
                    cy={100 + Math.random() * 200}
                    r={2 + Math.random() * 3}
                    fill={['#c084fc', '#60a5fa', '#4ade80', '#f472b6', '#22d3ee'][i % 5]}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.svg>
            </motion.div>
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Laptop,
      title: t('features.interactive'),
      description: t('features.interactiveDesc'),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Users,
      title: t('features.expert'),
      description: t('features.expertDesc'),
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Award,
      title: t('features.certificate'),
      description: t('features.certificateDesc'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Globe,
      title: t('features.community'),
      description: t('features.communityDesc'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: t('features.flexible'),
      description: t('features.flexibleDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: t('features.support'),
      description: t('features.supportDesc'),
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-4"
          />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t('features.title')}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-glass card-hover p-8 group cursor-pointer"
            >
              <motion.div 
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesSection({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<CourseLevel>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <section className="py-20 min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onClick={() => setCurrentPage('home')} label="Back to Home" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60px' }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-4"
          />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('courses.title')}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            {t('courses.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder={t('courses.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as CourseLevel)}
                className="w-full sm:w-40 pl-12 pr-10 py-3 bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white appearance-none cursor-pointer"
              >
                <option value="all">{t('courses.all')}</option>
                <option value="beginner">{t('courses.beginner')}</option>
                <option value="intermediate">{t('courses.intermediate')}</option>
                <option value="advanced">{t('courses.advanced')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
            </div>
            
            <div className="flex items-center px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-sm">
              <span className="text-purple-400 font-bold">{filteredCourses.length}</span>
              <span className="ml-1">courses</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="card-glass overflow-hidden card-hover cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  {course.isNew && <span className="badge-new">{t('common.new')}</span>}
                  {course.isPopular && <span className="badge-popular">{t('common.popular')}</span>}
                  {course.isPremium && <span className="badge-premium">{t('common.premium')}</span>}
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="text-2xl font-bold text-white">
                    {course.price === 0 ? t('common.free') : `$${course.price}`}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-300">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} {t('courses.lessons')}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    {course.rating}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{t('courses.students')}</span>
                    <span className="text-gray-300">{course.students.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(course.students / 300, 100)}%` }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t('courses.enroll')}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t('common.noResults')}</p>
          </motion.div>
        )}

        <div className="mt-16 pt-8 border-t border-white/10">
          <BackButton onClick={() => setCurrentPage('home')} label="Back to Home" />
        </div>
      </div>
    </section>
  );
}

function Dashboard({ currentUser, setCurrentPage }: { currentUser: any; setCurrentPage: (page: Page) => void }) {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses().then(setCourses).catch(console.error);
  }, []);

  const myCourses = courses.slice(0, 3);
  const achievements = [
    { icon: Trophy, title: 'First Course', completed: true },
    { icon: AwardIcon, title: '10 Lessons', completed: true },
    { icon: Star, title: 'Top Student', completed: false },
    { icon: CheckCircle, title: 'Quiz Master', completed: false }
  ];

  const weekProgress = [45, 72, 38, 85, 62, 90, 55];

  const userName = currentUser?.name || 'User';

  return (
    <section className="py-20 min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onClick={() => setCurrentPage('home')} label="Back to Dashboard" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('dashboard.welcome')}, {userName}! 👋
            </span>
          </h1>
          <p className="text-gray-400">{t('dashboard.title')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {[
            { 
              icon: BookOpen, 
              label: t('dashboard.myCourses'), 
              value: '3', 
              subValue: 'Active',
              color: 'from-purple-500 to-indigo-500',
              trend: '+2 this month'
            },
            { 
              icon: CheckCircle, 
              label: t('dashboard.completedCourses'), 
              value: '1', 
              subValue: 'Certified',
              color: 'from-green-500 to-emerald-500',
              trend: '+1 this week'
            },
            { 
              icon: Award, 
              label: t('dashboard.certificates'), 
              value: '2', 
              subValue: 'Earned',
              color: 'from-amber-500 to-orange-500',
              trend: 'Top 10%'
            },
            { 
              icon: Clock, 
              label: t('dashboard.studyTime'), 
              value: '12.5h', 
              subValue: 'This Week',
              color: 'from-blue-500 to-cyan-500',
              trend: '+18% vs last week'
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-glass p-5 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
              </div>
              
              <div className="mb-1">
                <span className="text-4xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              
              <div className="text-sm text-gray-400 font-medium mb-2">{stat.label}</div>
              <div className="text-xs text-gray-500 mb-3">{stat.subValue}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${stat.trend.includes('+') ? 'bg-green-500' : 'bg-purple-500'} animate-pulse`} />
                <span className={stat.trend.includes('+') ? 'text-green-400' : 'text-purple-400'}>
                  {stat.trend}
                </span>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t('dashboard.myCourses')}</h2>
                <button className="text-purple-400 text-sm hover:underline">{t('common.view')}</button>
              </div>
              <div className="space-y-4">
                {myCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{course.instructor}</p>
                      <div className="progress-bar h-1.5">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${30 + i * 20}%` }}
                        />
                      </div>
                    </div>
                    <motion.button
                      className="btn-primary px-4 py-2 text-sm self-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      {t('dashboard.resume')}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="card-glass p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{t('dashboard.progress')}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Daily learning hours this week</p>
                  </div>
                </div>
                
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">+12%</span>
                  </div>
                  <span className="text-gray-400 text-sm">vs last week</span>
                </motion.div>
              </div>
              
              <div className="relative h-64 mb-6">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[100, 75, 50, 25, 0].map((level) => (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-8 text-right">{level}%</span>
                      <div className="flex-1 border-t border-gray-700/50 border-dashed" />
                    </div>
                  ))}
                </div>
                
                <div className="relative h-full flex items-end justify-between gap-2 sm:gap-3 pl-11 pr-2 pt-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex justify-center h-44">
                        <motion.div 
                          className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 border border-purple-500/50 px-3 py-2 rounded-xl text-sm font-bold text-white whitespace-nowrap z-20 shadow-xl shadow-purple-500/20"
                          initial={{ y: 10, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                        >
                          <div className="text-purple-400 text-xs mb-0.5">{day}</div>
                          {weekProgress[i]}%
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-purple-500/50 rotate-45" />
                        </motion.div>
                        
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${weekProgress[i]}%` }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                          className="relative w-full max-w-[36px] rounded-t-xl overflow-hidden"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-t ${
                            weekProgress[i] >= 80 ? 'from-green-600 via-green-500 to-green-400' :
                            weekProgress[i] >= 60 ? 'from-purple-600 via-purple-500 to-purple-400' :
                            weekProgress[i] >= 40 ? 'from-indigo-600 via-indigo-500 to-indigo-400' :
                            'from-gray-600 via-gray-500 to-gray-400'
                          }`} />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
                        </motion.div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-purple-400 transition-colors">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700/50">
                <motion.div 
                  className="text-center p-3 bg-gray-800/50 rounded-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-xs text-gray-400 mb-1">Average</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {Math.round(weekProgress.reduce((a, b) => a + b, 0) / weekProgress.length)}%
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-3 bg-gray-800/50 rounded-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="text-xs text-gray-400 mb-1">Best Day</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {Math.max(...weekProgress)}%
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-3 bg-gray-800/50 rounded-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="text-xs text-gray-400 mb-1">Total Hours</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {(weekProgress.reduce((a, b) => a + b, 0) / 10).toFixed(1)}h
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-glass p-6"
            >
              <h2 className="text-xl font-bold mb-4">{t('dashboard.achievements')}</h2>
              <div className="space-y-3">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.completed ? 'bg-green-500/20' : 'bg-white/5'
                    }`}
                  >
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.completed ? 'text-green-400' : 'text-gray-500'
                    }`} />
                    <span className={achievement.completed ? 'text-green-400' : 'text-gray-400'}>
                      {achievement.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card-glass p-6"
            >
              <h2 className="text-xl font-bold mb-4">{t('dashboard.nextLesson')}</h2>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold mb-1">React Hooks Deep Dive</h3>
                <p className="text-sm text-gray-400 mb-4">Lesson 12 of 48</p>
                <motion.button
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {t('dashboard.continueLearning')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizSection() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);

  const handleBackToHome = () => {
    if (window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    if (!showResults && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quizQuestions.length) * 100);

  if (showResults) {
    return (
      <section className="py-20 min-h-screen pt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              <Trophy className={`w-16 h-16 ${
                percentage >= 70 ? 'text-green-400' : 'text-red-400'
              }`} />
            </motion.div>

            <h2 className="text-3xl font-bold mb-2">{t('quiz.completed')}</h2>
            <p className="text-gray-400 mb-8">{t('quiz.congratulations')}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-purple-400">{score}</div>
                <div className="text-sm text-gray-400">{t('quiz.correct')}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-indigo-400">{quizQuestions.length}</div>
                <div className="text-sm text-gray-400">{t('quiz.total')}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className={`text-3xl font-bold ${
                  percentage >= 70 ? 'text-green-400' : 'text-red-400'
                }`}>{percentage}%</div>
                <div className="text-sm text-gray-400">{t('quiz.percentage')}</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setShowResults(false);
                  setTimeRemaining(300);
                }}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <RotateCcw className="w-5 h-5" />
                {t('quiz.retake')}
              </motion.button>
              <motion.button
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Share2 className="w-5 h-5" />
                {t('quiz.shareResults')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <section className="py-20 min-h-screen pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onClick={handleBackToHome} label="Exit Quiz" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('quiz.title')}
            </span>
          </h1>
          <p className="text-gray-400">{t('quiz.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Timer className="w-5 h-5 text-purple-400" />
          <span className={`text-lg font-mono ${
            timeRemaining < 60 ? 'text-red-400' : 'text-gray-300'
          }`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">
              {t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {quizQuestions.length}
            </span>
            <span className="text-gray-400">
              {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="card-glass p-8 mb-8"
        >
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswerSelect(i)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswers[currentQuestion] === i
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === i
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedAnswers[currentQuestion] === i && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-between">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`btn-secondary flex items-center gap-2 ${
              currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: currentQuestion === 0 ? 1 : 1.05 }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            {t('quiz.previous')}
          </motion.button>

          {currentQuestion === quizQuestions.length - 1 ? (
            <motion.button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5" />
              {t('quiz.submit')}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`btn-primary flex items-center gap-2 ${
                selectedAnswers[currentQuestion] === undefined ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: selectedAnswers[currentQuestion] === undefined ? 1 : 1.05 }}
            >
              {t('quiz.next')}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <BackButton onClick={handleBackToHome} label="Exit Quiz" />
        </div>
      </div>
    </section>
  );
}

function LoginPage({ setCurrentPage, setIsLoggedIn, setCurrentUser }: { 
  setCurrentPage: (page: Page) => void;
  setIsLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: any) => void;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    setTimeout(() => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        setCurrentUser(user);
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      } else {
        setError(t('common.error') + ': Invalid email or password');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <section className="py-20 min-h-screen pt-32 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="flex justify-center mb-6">
          <BackButton onClick={() => setCurrentPage('home')} label="Back to Home" />
        </div>

        <div className="card-glass p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('auth.loginTitle')}</h1>
            <p className="text-gray-400">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-white/20" />
                {t('auth.rememberMe')}
              </label>
              <button type="button" className="text-sm text-purple-400 hover:underline">
                {t('auth.forgotPassword')}
              </button>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                t('auth.signIn')
              )}
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-purple-400 hover:underline"
              >
                {t('nav.signup')}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <BackButton onClick={() => setCurrentPage('home')} label="Back to Home" />
        </div>
      </motion.div>
    </section>
  );
}

function SignupPage({ setCurrentPage, setIsLoggedIn, setCurrentUser }: { 
  setCurrentPage: (page: Page) => void;
  setIsLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: any) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('common.error') + ': Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(t('common.error') + ': Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      setError(t('common.error') + ': Email already registered');
      setIsLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      setIsLoading(false);
    }, 800);
  };

  return (
    <section className="py-20 min-h-screen pt-32 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="card-glass p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('auth.signupTitle')}</h1>
            <p className="text-gray-400">{t('auth.signupSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modern"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-modern"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-white/20" required />
              <span className="text-sm text-gray-400">
                {t('auth.agreeTerms')}{' '}
                <button type="button" className="text-purple-400 hover:underline">
                  {t('auth.termsOfService')}
                </button>{' '}
                {t('auth.and')}{' '}
                <button type="button" className="text-purple-400 hover:underline">
                  {t('auth.privacyPolicy')}
                </button>
              </span>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                t('auth.signUp')
              )}
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              {t('auth.hasAccount')}{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-purple-400 hover:underline"
              >
                {t('nav.login')}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <BackButton onClick={() => setCurrentPage('home')} label="Back to Home" />
        </div>
      </motion.div>
    </section>
  );
}

function DevelopersSection() {
  const developers = [
    'Salsabeel Badr',
    'Jana Atef',
    'Doaa Khalil',
    'Amira Tawfiq',
    'Rabab Mohamed',
    'Nada Mohamed',
    'Sarah Mustafa',
    'Eman Saber',
    'Zahwa Ahmed',
  ];

  return (
    <section className="bg-gray-900/50 border-t border-purple-500/10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          {developers.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                WebForg
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6">{t('footer.description')}</p>
            <div className="flex gap-4">
              {[Globe, Award, Users, Clock, Star].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <h3 className="font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {['Home', 'Courses', 'Dashboard', 'Quiz', 'About'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="font-bold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {['Blog', 'Documentation', 'Help Center', 'Community', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="font-bold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 WebForg. {t('footer.copyright')}.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500" /> for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection setCurrentPage={setCurrentPage} />
            <FeaturesSection />
          </>
        );
      case 'courses':
        return <CoursesSection setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />;
      case 'quiz':
        return <QuizSection />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />;
      default:
        return <HeroSection setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      
      {!isLoading && (
        <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden w-full">
          <Navbar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main className="w-full overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full overflow-x-hidden"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <DevelopersSection />
        </div>
      )}
    </>
  );
}

export default App;