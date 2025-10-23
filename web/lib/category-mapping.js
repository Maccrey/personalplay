/**
 * Category mapping for all tests
 * Maps test IDs to their categories
 */

export const TEST_CATEGORIES = {
  // Love & Relationships (연애 & 관계)
  '1': 'love',
  '24': 'love',
  '31': 'love',
  '32': 'love',
  '33': 'love',
  '37': 'love',
  '38': 'love',

  // Personality & Psychology (성격 & 심리)
  '6': 'personality',
  '22': 'personality',
  '34': 'personality',
  '35': 'personality',
  '36': 'personality',
  '60': 'personality',

  // Learning & Education (학습 & 교육)
  '23': 'learning',
  '25': 'learning',
  '26': 'learning',
  '27': 'learning',
  '28': 'learning',
  '29': 'learning',
  '30': 'learning',

  // Lifestyle (라이프스타일)
  '2': 'lifestyle',
  '3': 'lifestyle',
  '4': 'lifestyle',
  '8': 'lifestyle',
  '9': 'lifestyle',
  '10': 'lifestyle',
  '11': 'lifestyle',
  '12': 'lifestyle',
  '13': 'lifestyle',
  '14': 'lifestyle',
  '15': 'lifestyle',
  '16': 'lifestyle',
  '17': 'lifestyle',
  '18': 'lifestyle',
  '19': 'lifestyle',
  '20': 'lifestyle',
  '21': 'lifestyle',

  // Trends & Memes (트렌드 & 밈)
  '5': 'meme-trend',
  '7': 'meme-trend',
  '39': 'meme-trend',
  '40': 'meme-trend',
  '41': 'meme-trend',
  '42': 'meme-trend',
  '43': 'meme-trend',
  '44': 'meme-trend',
  '45': 'meme-trend',
  '46': 'meme-trend',
  '47': 'meme-trend',
  '48': 'meme-trend',
  '49': 'meme-trend',

  // Hobbies & Entertainment (취미 & 엔터)
  '50': 'hobby-entertainment',
  '51': 'hobby-entertainment',
  '52': 'hobby-entertainment',
  '53': 'hobby-entertainment',
  '54': 'hobby-entertainment',
  '55': 'hobby-entertainment',
  '56': 'hobby-entertainment',
  '57': 'hobby-entertainment',
  '58': 'hobby-entertainment',
  '59': 'hobby-entertainment',
};

/**
 * Get category for a test ID
 * @param {string} testId - Test ID
 * @returns {string} Category ID
 */
export function getCategoryForTest(testId) {
  return TEST_CATEGORIES[testId] || 'other';
}
