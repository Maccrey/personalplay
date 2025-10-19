#!/usr/bin/env python3
"""
Translate all expanded results from Korean to English and Japanese
Handles the new structure: summary, description, characteristics, strengths, weaknesses, advice
"""

import json
import sys
import time
from pathlib import Path
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(line_buffering=True)

def translate(text, lang):
    """Translate text to target language"""
    try:
        translator = GoogleTranslator(source='ko', target=lang)
        result = translator.translate(text)
        time.sleep(0.05)  # Rate limiting
        return result
    except Exception as e:
        print(f"  ⚠️  Translation error: {e}", flush=True)
        time.sleep(1)
        return text

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

# Count total items to translate
total_items = 0
for test_num in range(1, 61):
    test_id = str(test_num)
    if test_id in ko['tests']:
        for result_key in ko['tests'][test_id]['results'].keys():
            result_ko = ko['tests'][test_id]['results'][result_key]
            # Count: title, summary, description, characteristics[], strengths[], weaknesses[], advice
            total_items += 4  # title, summary, description, advice
            total_items += len(result_ko.get('characteristics', []))
            total_items += len(result_ko.get('strengths', []))
            total_items += len(result_ko.get('weaknesses', []))

print(f"Total items to translate: {total_items}", flush=True)
print(f"Total translations: {total_items * 2} (EN + JA)", flush=True)
print("=" * 70, flush=True)

count = 0
for test_num in range(1, 61):
    test_id = str(test_num)

    if test_id not in ko['tests']:
        continue

    test_ko = ko['tests'][test_id]
    test_title = test_ko['title']

    print(f"\n📝 Test {test_id}/60: {test_title}", flush=True)
    print("-" * 70, flush=True)

    for result_key in test_ko['results'].keys():
        result_ko = test_ko['results'][result_key]

        print(f"\n  🔄 Result {result_key}: {result_ko['title']}", flush=True)

        # Initialize result structures for EN and JA
        result_en = {}
        result_ja = {}

        # Translate title
        count += 1
        print(f"    [{count}/{total_items}] Title...", end=' ', flush=True)
        result_en['title'] = translate(result_ko['title'], 'en')
        result_ja['title'] = translate(result_ko['title'], 'ja')
        print("✓", flush=True)

        # Translate summary
        count += 1
        print(f"    [{count}/{total_items}] Summary...", end=' ', flush=True)
        result_en['summary'] = translate(result_ko.get('summary', ''), 'en')
        result_ja['summary'] = translate(result_ko.get('summary', ''), 'ja')
        print("✓", flush=True)

        # Translate description
        count += 1
        print(f"    [{count}/{total_items}] Description...", end=' ', flush=True)
        result_en['description'] = translate(result_ko.get('description', ''), 'en')
        result_ja['description'] = translate(result_ko.get('description', ''), 'ja')
        print("✓", flush=True)

        # Translate characteristics array
        characteristics_en = []
        characteristics_ja = []
        for i, char in enumerate(result_ko.get('characteristics', [])):
            count += 1
            print(f"    [{count}/{total_items}] Characteristic {i+1}/{len(result_ko['characteristics'])}...", end=' ', flush=True)
            characteristics_en.append(translate(char, 'en'))
            characteristics_ja.append(translate(char, 'ja'))
            print("✓", flush=True)
        result_en['characteristics'] = characteristics_en
        result_ja['characteristics'] = characteristics_ja

        # Translate strengths array
        strengths_en = []
        strengths_ja = []
        for i, strength in enumerate(result_ko.get('strengths', [])):
            count += 1
            print(f"    [{count}/{total_items}] Strength {i+1}/{len(result_ko['strengths'])}...", end=' ', flush=True)
            strengths_en.append(translate(strength, 'en'))
            strengths_ja.append(translate(strength, 'ja'))
            print("✓", flush=True)
        result_en['strengths'] = strengths_en
        result_ja['strengths'] = strengths_ja

        # Translate weaknesses array
        weaknesses_en = []
        weaknesses_ja = []
        for i, weakness in enumerate(result_ko.get('weaknesses', [])):
            count += 1
            print(f"    [{count}/{total_items}] Weakness {i+1}/{len(result_ko['weaknesses'])}...", end=' ', flush=True)
            weaknesses_en.append(translate(weakness, 'en'))
            weaknesses_ja.append(translate(weakness, 'ja'))
            print("✓", flush=True)
        result_en['weaknesses'] = weaknesses_en
        result_ja['weaknesses'] = weaknesses_ja

        # Translate advice
        count += 1
        print(f"    [{count}/{total_items}] Advice...", end=' ', flush=True)
        result_en['advice'] = translate(result_ko.get('advice', ''), 'en')
        result_ja['advice'] = translate(result_ko.get('advice', ''), 'ja')
        print("✓", flush=True)

        # Update EN and JA locale files
        en['tests'][test_id]['results'][result_key] = result_en
        ja['tests'][test_id]['results'][result_key] = result_ja

    # Save checkpoint every 5 tests
    if test_num % 5 == 0:
        print(f"\n💾 Checkpoint: Saving at Test {test_num}...", flush=True)
        with open(en_path, 'w', encoding='utf-8') as f:
            json.dump(en, f, ensure_ascii=False, indent=2)
        with open(ja_path, 'w', encoding='utf-8') as f:
            json.dump(ja, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 70, flush=True)
print("💾 Final save...", flush=True)
with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w', encoding='utf-8') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print(f"\n✨ All {count} items translated successfully!", flush=True)
print(f"   Total translations: {count * 2} (EN + JA)", flush=True)
print("\nNext step: Update UI to display expanded results", flush=True)
