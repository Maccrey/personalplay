/**
 * Category display data (icons, colors, etc.)
 */

export const CATEGORY_DATA = {
  'love': {
    icon: '❤️',
    color: '#FF6B9D',
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C850C0 100%)'
  },
  'personality': {
    icon: '🧠',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #667EEA 100%)'
  },
  'learning': {
    icon: '📚',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  },
  'lifestyle': {
    icon: '🌟',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  },
  'meme-trend': {
    icon: '🔥',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
  },
  'hobby-entertainment': {
    icon: '🎮',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  'other': {
    icon: '📋',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  }
};

/**
 * Get category display data
 * @param {string} categoryId - Category ID
 * @returns {Object} Category display data
 */
export function getCategoryData(categoryId) {
  return CATEGORY_DATA[categoryId] || CATEGORY_DATA.other;
}
