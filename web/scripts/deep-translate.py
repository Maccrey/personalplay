#!/usr/bin/env python3
"""
Professional translation using deep-translator (Google Translate)
Translates all test questions from Korean to English and Japanese
"""

import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

def translate_text(text, dest_lang):
    """Translate text using Google Translate via deep-translator"""
    try:
        translator = GoogleTranslator(source='ko', target=dest_lang)
        result = translator.translate(text)
        # Small delay to avoid rate limiting
        time.sleep(0.1)
        return result
    except Exception as e:
        print(f"  ⚠️  Translation error: {e}")
        return text

def translate_questions(ko_data, en_data, ja_data):
    """Translate all questions from Korean to English and Japanese"""

    total_tests = len(ko_data.get('tests', {}))
    total_questions = 0

    # Count total questions
    for test_id, test_data in ko_data.get('tests', {}).items():
        if 'questions' in test_data:
            total_questions += len(test_data['questions'])

    print(f"\n📊 Found {total_tests} tests with {total_questions} questions total")
    print(f"   That's {total_questions * 2} translations to do (English + Japanese)")
    print("\n" + "="*70)

    question_num = 0

    for test_id, test_data in ko_data.get('tests', {}).items():
        if 'questions' not in test_data:
            continue

        print(f"\n📝 Test {test_id}: {test_data.get('title', 'Unknown')}")
        print("-" * 70)

        questions_ko = test_data['questions']
        questions_en = []
        questions_ja = []

        for i, question_ko in enumerate(questions_ko):
            question_num += 1
            progress = f"[{question_num}/{total_questions}]"

            print(f"\n  {progress} Q{i+1}")
            print(f"  🇰🇷 KO: {question_ko}")

            # Translate to English
            question_en = translate_text(question_ko, 'en')
            questions_en.append(question_en)
            print(f"  🇺🇸 EN: {question_en}")

            # Translate to Japanese
            question_ja = translate_text(question_ko, 'ja')
            questions_ja.append(question_ja)
            print(f"  🇯🇵 JA: {question_ja}")

        # Update English data
        if test_id in en_data.get('tests', {}):
            en_data['tests'][test_id]['questions'] = questions_en

        # Update Japanese data
        if test_id in ja_data.get('tests', {}):
            ja_data['tests'][test_id]['questions'] = questions_ja

    return en_data, ja_data

def main():
    print("\n" + "="*70)
    print("🌐 PROFESSIONAL TRANSLATION WITH GOOGLE TRANSLATE")
    print("="*70)

    # File paths
    ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
    en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
    ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

    # Load data
    print("\n📂 Loading translation files...")
    with open(ko_path, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    print(f"   ✅ Loaded ko.json ({len(ko_data.get('tests', {}))} tests)")
    print(f"   ✅ Loaded en.json ({len(en_data.get('tests', {}))} tests)")
    print(f"   ✅ Loaded ja.json ({len(ja_data.get('tests', {}))} tests)")

    # Translate
    start_time = time.time()
    en_data, ja_data = translate_questions(ko_data, en_data, ja_data)
    elapsed_time = time.time() - start_time

    # Save results
    print("\n" + "="*70)
    print("💾 SAVING TRANSLATIONS")
    print("="*70)

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ Saved: {en_path}")

    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved: {ja_path}")

    # Summary
    print("\n" + "="*70)
    print("✨ TRANSLATION COMPLETE!")
    print("="*70)
    print(f"⏱️  Time elapsed: {elapsed_time:.1f} seconds")
    print(f"\n📋 Next steps:")
    print(f"   1. Review translations in:")
    print(f"      - {en_path}")
    print(f"      - {ja_path}")
    print(f"   2. Upload to Firestore:")
    print(f"      cd {Path(__file__).parent.parent}")
    print(f"      npm run migrate")
    print(f"   3. Build and deploy:")
    print(f"      npm run build")
    print(f"      git add locales/")
    print(f"      git commit -m 'fix(i18n): improve translations with Google Translate'")
    print(f"      git push")
    print()

if __name__ == '__main__':
    main()
