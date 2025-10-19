// Firestore 데이터 마이그레이션 스크립트
const { db } = require('../lib/firebase-admin');
const tests = require('../data/tests.json');
const categories = require('../data/categories.json');
const fs = require('fs');
const path = require('path');

async function migrateData() {
  console.log('🚀 Starting Firestore migration...\n');

  try {
    // 1. 테스트 데이터 업로드
    console.log('📝 Uploading tests data...');
    for (const test of tests.tests) {
      await db.collection('tests').doc(test.id).set(test);
      console.log(`✅ Test ${test.id}: ${test.title}`);
    }
    console.log(`✨ ${tests.tests.length} tests uploaded successfully!\n`);

    // 2. 카테고리 데이터 업로드
    console.log('📁 Uploading categories data...');
    for (const category of categories.categories) {
      await db.collection('categories').doc(category.id).set(category);
      console.log(`✅ Category ${category.id}: ${category.name}`);
    }
    console.log(`✨ ${categories.categories.length} categories uploaded successfully!\n`);

    // 3. 다국어 번역 데이터 업로드
    console.log('🌍 Uploading translation data...');
    const locales = ['ko', 'en', 'ja'];

    for (const locale of locales) {
      const localePath = path.join(__dirname, '../locales', `${locale}.json`);
      const translations = JSON.parse(fs.readFileSync(localePath, 'utf8'));

      await db.collection('translations').doc(locale).set(translations);
      console.log(`✅ Translations: ${locale}`);
    }
    console.log(`✨ ${locales.length} translation files uploaded successfully!\n`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Tests: ${tests.tests.length}`);
    console.log(`   - Categories: ${categories.categories.length}`);
    console.log(`   - Translations: ${locales.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// 스크립트 실행
migrateData()
  .then(() => {
    console.log('\n✅ All done! You can now use Firestore.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
