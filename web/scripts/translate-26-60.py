#!/usr/bin/env python3
"""Translate remaining tests 26-60 with retry logic"""

import json
import sys
import time
from pathlib import Path
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(line_buffering=True)

def translate_with_retry(text, lang, max_retries=3):
    """Translate with retry logic"""
    for attempt in range(max_retries):
        try:
            translator = GoogleTranslator(source='ko', target=lang)
            result = translator.translate(text)
            time.sleep(0.1)  # Small delay
            return result
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"\n  ⚠️  Retry {attempt+1}/{max_retries}...", end='', flush=True)
                time.sleep(1)  # Wait before retry
            else:
                print(f"\n  ❌ Failed: {e}", flush=True)
                return text  # Return original if all retries fail

ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

with open(ko_path) as f:
    ko = json.load(f)
with open(en_path) as f:
    en = json.load(f)
with open(ja_path) as f:
    ja = json.load(f)

# Translate tests 26-60
for test_num in range(26, 61):
    test_id = str(test_num)
    if test_id not in ko['tests']:
        continue

    print(f"\nTest {test_id}/60...", flush=True)
    questions_ko = ko['tests'][test_id]['questions']

    questions_en = []
    questions_ja = []

    for i, q in enumerate(questions_ko):
        print(f"  {i+1}/{len(questions_ko)}", end='', flush=True)
        questions_en.append(translate_with_retry(q, 'en'))
        print('.', end='', flush=True)
        questions_ja.append(translate_with_retry(q, 'ja'))
        print('.', end=' ', flush=True)

    en['tests'][test_id]['questions'] = questions_en
    ja['tests'][test_id]['questions'] = questions_ja
    print("✓", flush=True)

    # Save every 5 tests
    if test_num % 5 == 0:
        print(f"💾 Checkpoint at Test {test_num}...", flush=True)
        with open(en_path, 'w') as f:
            json.dump(en, f, ensure_ascii=False, indent=2)
        with open(ja_path, 'w') as f:
            json.dump(ja, f, ensure_ascii=False, indent=2)

print("\n💾 Final save...", flush=True)
with open(en_path, 'w') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print("✨ All 60 tests translated!", flush=True)
