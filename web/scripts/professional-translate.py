#!/usr/bin/env python3
"""
Professional translation script using Google Translate
Translates all test questions from Korean to English and Japanese
"""

import json
import os
from pathlib import Path

# Try to use googletrans library (free Google Translate API)
try:
    from googletrans import Translator
    translator = Translator()
    USE_GOOGLETRANS = True
except ImportError:
    print("googletrans not installed. Install with: pip install googletrans==4.0.0-rc1")
    USE_GOOGLETRANS = False
    translator = None

def translate_text(text, dest_lang):
    """Translate text to destination language using Google Translate"""
    if not USE_GOOGLETRANS or not translator:
        return text

    try:
        # Translate from Korean to target language
        result = translator.translate(text, src='ko', dest=dest_lang)
        return result.text
    except Exception as e:
        print(f"Translation error for '{text}': {e}")
        return text

def translate_questions(ko_data, dest_lang):
    """Translate all questions in the data structure"""
    translated_data = json.loads(json.dumps(ko_data))  # Deep copy

    total_questions = 0
    translated_count = 0

    if 'tests' in translated_data:
        for test_id, test_data in translated_data['tests'].items():
            if 'questions' in test_data:
                print(f"\nTranslating Test {test_id} to {dest_lang}...")
                for i, question in enumerate(test_data['questions']):
                    total_questions += 1
                    translated = translate_text(question, dest_lang)
                    translated_data['tests'][test_id]['questions'][i] = translated
                    translated_count += 1
                    print(f"  Q{i+1}: {question[:50]}... → {translated[:50]}...")

    print(f"\n✅ Translated {translated_count}/{total_questions} questions to {dest_lang}")
    return translated_data

def main():
    if not USE_GOOGLETRANS:
        print("\n❌ Please install googletrans first:")
        print("   pip install googletrans==4.0.0-rc1")
        return

    # Load Korean (source) data
    ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
    en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
    ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

    print("Loading Korean source data...")
    with open(ko_path, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    # Load existing English and Japanese data (to preserve non-question content)
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    # Translate to English
    print("\n" + "="*60)
    print("TRANSLATING TO ENGLISH")
    print("="*60)
    en_translated = translate_questions(ko_data, 'en')

    # Merge with existing English data (preserve metadata, nav, etc.)
    for test_id, test_data in en_translated['tests'].items():
        if test_id in en_data['tests']:
            en_data['tests'][test_id]['questions'] = test_data['questions']

    # Save English
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Saved to {en_path}")

    # Translate to Japanese
    print("\n" + "="*60)
    print("TRANSLATING TO JAPANESE")
    print("="*60)
    ja_translated = translate_questions(ko_data, 'ja')

    # Merge with existing Japanese data
    for test_id, test_data in ja_translated['tests'].items():
        if test_id in ja_data['tests']:
            ja_data['tests'][test_id]['questions'] = test_data['questions']

    # Save Japanese
    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Saved to {ja_path}")

    print("\n" + "="*60)
    print("✨ TRANSLATION COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Review the translations in locales/en.json and locales/ja.json")
    print("2. Upload to Firestore: npm run migrate")
    print("3. Test on your website")

if __name__ == '__main__':
    main()
