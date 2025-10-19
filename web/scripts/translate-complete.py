#!/usr/bin/env python3
"""Complete translation: questions + results (title + desc)"""

import json
import sys
from pathlib import Path
from deep_translator import GoogleTranslator
import time

sys.stdout.reconfigure(line_buffering=True)

def translate(text, lang):
    try:
        translator = GoogleTranslator(source='ko', target=lang)
        result = translator.translate(text)
        time.sleep(0.05)
        return result
    except Exception as e:
        print(f"  ERROR: {e}", flush=True)
        time.sleep(1)
        return text

ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

print("Loading files...", flush=True)
with open(ko_path) as f:
    ko = json.load(f)
with open(en_path) as f:
    en = json.load(f)
with open(ja_path) as f:
    ja = json.load(f)

# Count total items to translate
total_items = 0
for test_num in range(1, 61):
    test_id = str(test_num)
    total_items += len(ko['tests'][test_id]['questions'])
    total_items += len(ko['tests'][test_id]['results']) * 2  # title + desc

print(f"Total items: {total_items}", flush=True)
print(f"Total translations: {total_items * 2} (EN + JA)\n", flush=True)

count = 0
for test_num in range(1, 61):
    test_id = str(test_num)
    print(f"\nTest {test_id}/60", flush=True)
    print("="*50, flush=True)

    test_ko = ko['tests'][test_id]

    # Translate questions
    print(f"Questions ({len(test_ko['questions'])})", flush=True)
    questions_en = []
    questions_ja = []
    for i, q in enumerate(test_ko['questions']):
        count += 1
        print(f"  [{count}/{total_items}] Q{i+1}", end=' ', flush=True)
        questions_en.append(translate(q, 'en'))
        print('.', end='', flush=True)
        questions_ja.append(translate(q, 'ja'))
        print('. ✓', flush=True)

    en['tests'][test_id]['questions'] = questions_en
    ja['tests'][test_id]['questions'] = questions_ja

    # Translate results
    print(f"Results ({len(test_ko['results'])})", flush=True)
    for result_key, result_data in test_ko['results'].items():
        # Title
        count += 1
        print(f"  [{count}/{total_items}] Result {result_key} title", end=' ', flush=True)
        title_en = translate(result_data['title'], 'en')
        print('.', end='', flush=True)
        title_ja = translate(result_data['title'], 'ja')
        print('. ✓', flush=True)

        # Description
        count += 1
        print(f"  [{count}/{total_items}] Result {result_key} desc", end=' ', flush=True)
        desc_en = translate(result_data['desc'], 'en')
        print('.', end='', flush=True)
        desc_ja = translate(result_data['desc'], 'ja')
        print('. ✓', flush=True)

        # Update data
        en['tests'][test_id]['results'][result_key]['title'] = title_en
        en['tests'][test_id]['results'][result_key]['desc'] = desc_en
        ja['tests'][test_id]['results'][result_key]['title'] = title_ja
        ja['tests'][test_id]['results'][result_key]['desc'] = desc_ja

    # Save every 10 tests
    if test_num % 10 == 0:
        print(f"💾 Checkpoint at Test {test_num}...", flush=True)
        with open(en_path, 'w') as f:
            json.dump(en, f, ensure_ascii=False, indent=2)
        with open(ja_path, 'w') as f:
            json.dump(ja, f, ensure_ascii=False, indent=2)

print("\n" + "="*50, flush=True)
print("💾 Final save...", flush=True)
with open(en_path, 'w') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print("✨ Complete translation done!", flush=True)
print(f"   Questions: 750", flush=True)
print(f"   Results: ~120 (title + desc)", flush=True)
print(f"   Total items: {count}", flush=True)
