#!/usr/bin/env python3
"""
FINAL COMPLETE TRANSLATION SCRIPT
Generates FULL, proper English and Japanese translations for ALL 59 tests
Including ALL questions, titles, and results
"""

import json
import sys

# Load Korean tests
with open('/Users/maccrey/Development/myself-test/tests_korean.json', 'r', encoding='utf-8') as f:
    ko_data = json.load(f)['tests']

# Load existing locale files
with open('/Users/maccrey/Development/myself-test/web/locales/ko.json', 'r', encoding='utf-8') as f:
    ko_locale = json.load(f)

with open('/Users/maccrey/Development/myself-test/web/locales/en.json', 'r', encoding='utf-8') as f:
    en_locale = json.load(f)

with open('/Users/maccrey/Development/myself-test/web/locales/ja.json', 'r', encoding='utf-8') as f:
    ja_locale = json.load(f)

print("="*80)
print("COMPLETE TRANSLATION GENERATION")
print("="*80)
print(f"\nProcessing {len(ko_data)} tests with full content translation...")

# Import comprehensive translation data
# This includes ALL questions and results for each test

from complete_translation_data import (
    ENGLISH_TITLES,
    JAPANESE_TITLES,
    translate_all_questions_en,
    translate_all_questions_ja,
    translate_all_results_en,
    translate_all_results_ja
)

# Generate complete translations
en_tests = {}
ja_tests = {}

for tid in sorted(ko_data.keys(), key=int):
    ko_test = ko_data[tid]

    # English
    en_tests[tid] = {
        "title": ENGLISH_TITLES[tid],
        "questions": translate_all_questions_en(tid, ko_test['questions']),
        "results": translate_all_results_en(tid, ko_test['results'])
    }

    # Japanese  
    ja_tests[tid] = {
        "title": JAPANESE_TITLES[tid],
        "questions": translate_all_questions_ja(tid, ko_test['questions']),
        "results": translate_all_results_ja(tid, ko_test['results'])
    }

# Update locale files
ko_locale['tests'] = ko_data
en_locale['tests'] = en_tests
ja_locale['tests'] = ja_tests

# Save
with open('/Users/maccrey/Development/myself-test/web/locales/ko.json', 'w', encoding='utf-8') as f:
    json.dump(ko_locale, f, ensure_ascii=False, indent=2)

with open('/Users/maccrey/Development/myself-test/web/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_locale, f, ensure_ascii=False, indent=2)

with open('/Users/maccrey/Development/myself-test/web/locales/ja.json', 'w', encoding='utf-8') as f:
    json.dump(ja_locale, f, ensure_ascii=False, indent=2)

print(f"\n✓ Successfully updated all 3 locale files")
print(f"  Korean:   {len(ko_data)} tests")
print(f"  English:  {len(en_tests)} tests")  
print(f"  Japanese: {len(ja_tests)} tests")
print(f"\n✓ ALL content translated (titles, questions, results)")

