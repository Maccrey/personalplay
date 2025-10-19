#!/usr/bin/env python3
"""
Batch translation using deep-translator (Google Translate)
Faster version with progress updates
"""

import json
import sys
import time
from pathlib import Path
from deep_translator import GoogleTranslator

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

def translate_text(text, dest_lang):
    """Translate text using Google Translate"""
    try:
        translator = GoogleTranslator(source='ko', target=dest_lang)
        result = translator.translate(text)
        time.sleep(0.05)  # Reduced delay
        return result
    except Exception as e:
        print(f"ERROR: {e}", flush=True)
        return text

def main():
    print("="*70, flush=True)
    print("🌐 GOOGLE TRANSLATE BATCH TRANSLATION", flush=True)
    print("="*70, flush=True)

    ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'
    en_path = Path(__file__).parent.parent / 'locales' / 'en.json'
    ja_path = Path(__file__).parent.parent / 'locales' / 'ja.json'

    print("\n📂 Loading files...", flush=True)
    with open(ko_path, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    total = sum(len(t.get('questions', [])) for t in ko_data.get('tests', {}).values())
    print(f"📊 Total questions to translate: {total}", flush=True)
    print(f"📊 Total translations: {total * 2} (EN + JA)", flush=True)
    print("", flush=True)

    count = 0
    for test_id in sorted(ko_data.get('tests', {}).keys(), key=int):
        test_data = ko_data['tests'][test_id]
        if 'questions' not in test_data:
            continue

        print(f"\n{'='*70}", flush=True)
        print(f"Test {test_id}: {test_data.get('title', 'Unknown')}", flush=True)
        print(f"{'='*70}", flush=True)

        questions_ko = test_data['questions']
        questions_en = []
        questions_ja = []

        for i, q_ko in enumerate(questions_ko):
            count += 1
            progress = f"[{count}/{total}]"

            print(f"\n{progress} Q{i+1}/{len(questions_ko)}", flush=True)
            print(f"  KO: {q_ko}", flush=True)

            # English
            q_en = translate_text(q_ko, 'en')
            questions_en.append(q_en)
            print(f"  EN: {q_en}", flush=True)

            # Japanese
            q_ja = translate_text(q_ko, 'ja')
            questions_ja.append(q_ja)
            print(f"  JA: {q_ja}", flush=True)

        # Update data
        en_data['tests'][test_id]['questions'] = questions_en
        ja_data['tests'][test_id]['questions'] = questions_ja

    print(f"\n{'='*70}", flush=True)
    print("💾 SAVING FILES", flush=True)
    print(f"{'='*70}", flush=True)

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved: {en_path}", flush=True)

    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved: {ja_path}", flush=True)

    print(f"\n{'='*70}", flush=True)
    print("✨ TRANSLATION COMPLETE!", flush=True)
    print(f"{'='*70}\n", flush=True)

if __name__ == '__main__':
    main()
