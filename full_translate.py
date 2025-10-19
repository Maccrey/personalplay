#!/usr/bin/env python3
"""
Complete translation generator for all 59 tests
Generates English and Japanese versions
"""

import json
import re

# Common translation patterns
YES_NO_PATTERNS = {
    'ko': ['나요?', '하나요?', '있나요?', '는가요?', '인가요?', '한가요?'],
    'en': 'Do you',
    'ja': 'しますか？'
}

def translate_question_en(q):
    """Simple pattern-based translation for questions"""
    # This is a placeholder - in production, you'd use proper translation service
    # For now, returning placeholder to show structure
    return f"[EN] {q}"

def translate_question_ja(q):
    """Simple pattern-based translation for questions"""
    return f"[JA] {q}"

def translate_text_en(text):
    """Translate Korean text to English"""
    return f"[EN] {text}"

def translate_text_ja(text):
    """Translate Korean text to Japanese"""
    return f"[JA] {text}"

# Load Korean tests
with open('tests_korean.json', 'r', encoding='utf-8') as f:
    korean_data = json.load(f)

korean_tests = korean_data['tests']

# Create English translations
english_tests = {}
for test_id, test_data in korean_tests.items():
    english_tests[test_id] = {
        'title': translate_text_en(test_data['title']),
        'questions': [translate_question_en(q) for q in test_data['questions']],
        'results': {}
    }

    for result_key, result_data in test_data['results'].items():
        english_tests[test_id]['results'][result_key] = {
            'title': translate_text_en(result_data['title']),
            'desc': translate_text_en(result_data['desc'])
        }

# Create Japanese translations
japanese_tests = {}
for test_id, test_data in korean_tests.items():
    japanese_tests[test_id] = {
        'title': translate_text_ja(test_data['title']),
        'questions': [translate_question_ja(q) for q in test_data['questions']],
        'results': {}
    }

    for result_key, result_data in test_data['results'].items():
        japanese_tests[test_id]['results'][result_key] = {
            'title': translate_text_ja(result_data['title']),
            'desc': translate_text_ja(result_data['desc'])
        }

# Save translations
with open('tests_english.json', 'w', encoding='utf-8') as f:
    json.dump({'tests': english_tests}, f, ensure_ascii=False, indent=2)

with open('tests_japanese.json', 'w', encoding='utf-8') as f:
    json.dump({'tests': japanese_tests}, f, ensure_ascii=False, indent=2)

print(f"Created translations for {len(korean_tests)} tests")
print(f"  Korean: {len(korean_tests)} tests")
print(f"  English: {len(english_tests)} tests")
print(f"  Japanese: {len(japanese_tests)} tests")
print("\nNote: Translations are placeholders. Real translations needed.")
