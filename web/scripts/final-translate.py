#!/usr/bin/env python3
"""Final complete translation of all 60 tests"""

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

total_questions = sum(len(ko['tests'][str(i)]['questions']) for i in range(1, 61))
print(f"Total questions: {total_questions}", flush=True)
print(f"Total translations: {total_questions * 2}\n", flush=True)

count = 0
for test_num in range(1, 61):
    test_id = str(test_num)
    print(f"Test {test_id}/60...", flush=True)

    questions_ko = ko['tests'][test_id]['questions']
    questions_en = []
    questions_ja = []

    for i, q in enumerate(questions_ko):
        count += 1
        print(f"  [{count}/{total_questions}] {i+1}/{len(questions_ko)}", end=' ', flush=True)

        q_en = translate(q, 'en')
        questions_en.append(q_en)
        print('.', end='', flush=True)

        q_ja = translate(q, 'ja')
        questions_ja.append(q_ja)
        print('. ✓', flush=True)

    en['tests'][test_id]['questions'] = questions_en
    ja['tests'][test_id]['questions'] = questions_ja

    # Save every 10 tests
    if test_num % 10 == 0:
        print(f"  💾 Saving checkpoint...", flush=True)
        with open(en_path, 'w') as f:
            json.dump(en, f, ensure_ascii=False, indent=2)
        with open(ja_path, 'w') as f:
            json.dump(ja, f, ensure_ascii=False, indent=2)

print("\n💾 Final save...", flush=True)
with open(en_path, 'w') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print("✨ Done!", flush=True)
