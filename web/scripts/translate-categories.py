#!/usr/bin/env python3
"""
Translate category fields for all tests
"""

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

# Category translations
CATEGORY_MAP = {
    'love': {
        'en': 'love',
        'ja': 'love'
    },
    'personality': {
        'en': 'personality',
        'ja': 'personality'
    },
    'learning': {
        'en': 'learning',
        'ja': 'learning'
    },
    'lifestyle': {
        'en': 'lifestyle',
        'ja': 'lifestyle'
    },
    'meme-trend': {
        'en': 'meme-trend',
        'ja': 'meme-trend'
    },
    'hobby-entertainment': {
        'en': 'hobby-entertainment',
        'ja': 'hobby-entertainment'
    }
}

ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

print("Loading locale files...", flush=True)
with open(ko_path, encoding='utf-8') as f:
    ko = json.load(f)
with open(en_path, encoding='utf-8') as f:
    en = json.load(f)
with open(ja_path, encoding='utf-8') as f:
    ja = json.load(f)

count = 0
for test_id in ko['tests']:
    category_ko = ko['tests'][test_id].get('category', '')

    if category_ko and category_ko in CATEGORY_MAP:
        # Update EN
        if test_id in en['tests']:
            en['tests'][test_id]['category'] = CATEGORY_MAP[category_ko]['en']

        # Update JA
        if test_id in ja['tests']:
            ja['tests'][test_id]['category'] = CATEGORY_MAP[category_ko]['ja']

        count += 1
        print(f"✓ Test {test_id}: {category_ko} -> {CATEGORY_MAP[category_ko]['en']}", flush=True)

print(f"\n💾 Saving files...", flush=True)
with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w', encoding='utf-8') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print(f"✨ Updated {count} test categories!", flush=True)
