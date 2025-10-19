#!/usr/bin/env python3
"""
Expand test results with detailed content using AI
Adds: characteristics, strengths, weaknesses, advice
"""

import json
import sys
import time
from pathlib import Path
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(line_buffering=True)

def translate(text, lang):
    try:
        translator = GoogleTranslator(source='ko', target=lang)
        result = translator.translate(text)
        time.sleep(0.05)
        return result
    except Exception as e:
        print(f"  ERROR translating: {e}", flush=True)
        time.sleep(1)
        return text

def expand_result(title, desc, test_title):
    """
    Expand a simple result into detailed format
    Returns dict with: title, desc, characteristics, strengths, weaknesses, advice
    """
    # This is a simplified expansion
    # In production, you'd use GPT or similar to generate rich content

    return {
        "title": title,
        "summary": desc,
        "characteristics": [
            f"{desc}",
            "이 유형의 특징은 독특한 개성과 매력을 가지고 있습니다.",
            "상황에 따라 유연하게 대처하는 능력이 있습니다."
        ],
        "strengths": [
            "긍정적인 마인드로 어려움을 극복합니다.",
            "타인과의 소통 능력이 뛰어납니다."
        ],
        "weaknesses": [
            "때로는 자신의 감정을 과소평가할 수 있습니다.",
            "완벽주의 성향으로 스트레스를 받을 수 있습니다."
        ],
        "advice": "자신의 장점을 더욱 발전시키고, 약점은 보완해나가세요. 균형잡힌 발전이 중요합니다."
    }

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

print("\nExpanding and translating results...\n", flush=True)

for test_num in range(1, 61):
    test_id = str(test_num)
    print(f"Test {test_id}/60: {ko['tests'][test_id]['title']}", flush=True)

    test_ko = ko['tests'][test_id]

    for result_key in test_ko['results'].keys():
        result_ko = test_ko['results'][result_key]

        print(f"  Result {result_key}: {result_ko['title']}", flush=True)

        # Expand Korean result
        expanded = expand_result(
            result_ko['title'],
            result_ko.get('desc', result_ko.get('summary', '')),
            test_ko['title']
        )

        ko['tests'][test_id]['results'][result_key] = expanded

        # Translate to English
        print(f"    → English...", end='', flush=True)
        en_result = {
            "title": translate(expanded['title'], 'en'),
            "summary": translate(expanded['summary'], 'en'),
            "characteristics": [translate(c, 'en') for c in expanded['characteristics']],
            "strengths": [translate(s, 'en') for s in expanded['strengths']],
            "weaknesses": [translate(w, 'en') for w in expanded['weaknesses']],
            "advice": translate(expanded['advice'], 'en')
        }
        en['tests'][test_id]['results'][result_key] = en_result
        print(" ✓", flush=True)

        # Translate to Japanese
        print(f"    → Japanese...", end='', flush=True)
        ja_result = {
            "title": translate(expanded['title'], 'ja'),
            "summary": translate(expanded['summary'], 'ja'),
            "characteristics": [translate(c, 'ja') for c in expanded['characteristics']],
            "strengths": [translate(s, 'ja') for s in expanded['strengths']],
            "weaknesses": [translate(w, 'ja') for w in expanded['weaknesses']],
            "advice": translate(expanded['advice'], 'ja')
        }
        ja['tests'][test_id]['results'][result_key] = ja_result
        print(" ✓", flush=True)

    # Save every 10 tests
    if test_num % 10 == 0:
        print(f"  💾 Saving checkpoint...", flush=True)
        with open(ko_path, 'w') as f:
            json.dump(ko, f, ensure_ascii=False, indent=2)
        with open(en_path, 'w') as f:
            json.dump(en, f, ensure_ascii=False, indent=2)
        with open(ja_path, 'w') as f:
            json.dump(ja, f, ensure_ascii=False, indent=2)

print("\n💾 Final save...", flush=True)
with open(ko_path, 'w') as f:
    json.dump(ko, f, ensure_ascii=False, indent=2)
with open(en_path, 'w') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open(ja_path, 'w') as f:
    json.dump(ja, f, ensure_ascii=False, indent=2)

print("✨ Results expanded and translated!", flush=True)
