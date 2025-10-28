/**
 * Test data loader from JSON files
 * Replaces Firestore for test data
 */

import { getCategoryForTest } from './category-mapping';
import { getCategoryData } from './category-data';
import path from 'path';
import fs from 'fs';

let cachedTests = null;

/**
 * Load tests data from JSON file based on locale
 * @param {string} locale - Language code (ko, en, ja)
 * @returns {Promise<Object>} Tests data
 */
export async function loadTestsData(locale = 'ko') {
  // On the server, read the file directly from the filesystem
  if (typeof window === 'undefined') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', `tests-${locale}.json`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error(`Error reading tests data file for locale ${locale}:`, error);
      throw error;
    }
  }

  // On the client, fetch the file
  try {
    const response = await fetch(`/data/tests-${locale}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load tests data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading tests data for locale ${locale}:`, error);
    throw error;
  }
}

/**
 * Get all tests from JSON data
 * @param {string} locale - Language code
 * @returns {Promise<Array>} Array of test objects
 */
export async function getAllTests(locale = 'ko') {
  const data = await loadTestsData(locale);

  if (!data || !data.tests) {
    return [];
  }

  // Convert tests object to array and add category
  return Object.entries(data.tests).map(([id, test]) => ({
    id,
    ...test,
    category: getCategoryForTest(id)
  }));
}

/**
 * Get a single test by ID
 * @param {string} testId - Test ID
 * @param {string} locale - Language code
 * @returns {Promise<Object|null>} Test object or null
 */
export async function getTestById(testId, locale = 'ko') {
  const data = await loadTestsData(locale);

  if (!data || !data.tests || !data.tests[testId]) {
    return null;
  }

  return {
    id: testId,
    ...data.tests[testId],
    category: getCategoryForTest(testId)
  };
}

/**
 * Get tests by category
 * @param {string} category - Category name
 * @param {string} locale - Language code
 * @returns {Promise<Array>} Array of test objects in category
 */
export async function getTestsByCategory(category, locale = 'ko') {
  const allTests = await getAllTests(locale);
  return allTests.filter(test => test.category === category);
}

/**
 * Get translation for a specific key
 * @param {string} key - Translation key (e.g., 'home.title')
 * @param {string} locale - Language code
 * @returns {Promise<string>} Translated text
 */
export async function getTranslation(key, locale = 'ko') {
  const data = await loadTestsData(locale);

  const keys = key.split('.');
  let value = data;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if not found
    }
  }

  return value || key;
}

/**
 * Get all categories with their tests
 * @param {string} locale - Language code
 * @returns {Promise<Array>} Array of category objects with tests
 */
export async function getAllCategories(locale = 'ko') {
  const allTests = await getAllTests(locale);

  // Group tests by category
  const categoryMap = {};

  allTests.forEach(test => {
    const category = test.category || 'other';

    if (!categoryMap[category]) {
      const categoryData = getCategoryData(category);
      categoryMap[category] = {
        id: category,
        icon: categoryData.icon,
        color: categoryData.color,
        gradient: categoryData.gradient,
        tests: []
      };
    }

    categoryMap[category].tests.push(test);
  });

  // Convert to array
  return Object.values(categoryMap);
}

/**
 * Get a single category by ID with its tests
 * @param {string} categoryId - Category ID
 * @param {string} locale - Language code
 * @returns {Promise<Object|null>} Category object or null
 */
export async function getCategoryById(categoryId, locale = 'ko') {
  const tests = await getTestsByCategory(categoryId, locale);

  if (tests.length === 0) {
    return null;
  }

  const categoryData = getCategoryData(categoryId);

  return {
    id: categoryId,
    icon: categoryData.icon,
    color: categoryData.color,
    gradient: categoryData.gradient,
    tests
  };
}
