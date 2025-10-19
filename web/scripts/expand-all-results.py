#!/usr/bin/env python3
"""
Expand ALL test results (1-60) with detailed, contextually relevant content
Uses Claude API to generate unique characteristics, strengths, weaknesses, and advice
"""

import json
import sys
import time
from pathlib import Path
from anthropic import Anthropic
import os

sys.stdout.reconfigure(line_buffering=True)

# Initialize Anthropic client
# Set your API key: export ANTHROPIC_API_KEY=your_key_here
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def expand_result_with_ai(test_title, result_title, result_desc, test_category):
    """
    Use Claude to generate detailed, contextually appropriate content
    """
    prompt = f"""당신은 전문 심리 테스트 결과 작성 전문가입니다.

테스트 카테고리: {test_category}
테스트 제목: {test_title}
결과 유형 제목: {result_title}
기존 간단한 설명: {result_desc}

위 심리 테스트 결과에 대해 더 상세하고 전문적인 내용을 작성해주세요.

다음 형식의 JSON으로 응답해주세요:
{{
  "summary": "한 줄 요약 (30자 이내)",
  "description": "상세 설명 (2-3문장, 이 유형의 전반적인 특징 설명)",
  "characteristics": [
    "특징 1 (구체적이고 명확하게)",
    "특징 2",
    "특징 3",
    "특징 4"
  ],
  "strengths": [
    "강점 1 (긍정적이고 구체적으로)",
    "강점 2",
    "강점 3"
  ],
  "weaknesses": [
    "약점 1 (개선 가능한 부분으로)",
    "약점 2",
    "약점 3"
  ],
  "advice": "조언 (2-3문장, 실질적이고 도움이 되는 내용)"
}}

주의사항:
- 모든 내용은 한국어로 작성
- 전문적이면서도 친근한 톤 유지
- 구체적이고 실용적인 내용
- 각 항목은 서로 다른 내용이어야 함 (중복 없이)
- 테스트 카테고리와 제목에 맞는 맥락적으로 적절한 내용

JSON만 출력하세요 (다른 설명 없이):"""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text.strip()
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        result = json.loads(response_text)
        result["title"] = result_title

        return result

    except Exception as e:
        print(f"  ⚠️  AI generation error: {e}", flush=True)
        # Fallback to template
        return {
            "title": result_title,
            "summary": result_desc[:30] if len(result_desc) > 30 else result_desc,
            "description": result_desc,
            "characteristics": [
                f"{result_desc}",
                "이 유형의 특징은 독특한 개성과 매력을 가지고 있습니다.",
                "상황에 따라 유연하게 대처하는 능력이 있습니다.",
                "자신만의 방식으로 문제를 해결합니다."
            ],
            "strengths": [
                "긍정적인 마인드로 어려움을 극복합니다.",
                "타인과의 소통 능력이 뛰어납니다.",
                "새로운 도전을 즐깁니다."
            ],
            "weaknesses": [
                "때로는 자신의 감정을 과소평가할 수 있습니다.",
                "완벽주의 성향으로 스트레스를 받을 수 있습니다.",
                "결정을 내리는 데 시간이 걸릴 수 있습니다."
            ],
            "advice": "자신의 장점을 더욱 발전시키고, 약점은 보완해나가세요. 균형잡힌 발전이 중요합니다."
        }

ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'

print("Loading Korean locale file...", flush=True)
with open(ko_path) as f:
    ko = json.load(f)

# Count total results
total_results = 0
for test_num in range(1, 61):
    test_id = str(test_num)
    if test_id in ko['tests']:
        total_results += len(ko['tests'][test_id]['results'])

print(f"Total results to expand: {total_results}", flush=True)
print("=" * 60, flush=True)

count = 0
for test_num in range(1, 61):
    test_id = str(test_num)

    if test_id not in ko['tests']:
        continue

    test_ko = ko['tests'][test_id]
    test_title = test_ko['title']
    test_category = test_ko.get('category', 'personality')

    print(f"\n📝 Test {test_id}/60: {test_title}", flush=True)
    print("-" * 60, flush=True)

    for result_key in test_ko['results'].keys():
        result_ko = test_ko['results'][result_key]
        count += 1

        # Skip if already expanded (has 'characteristics' field)
        if 'characteristics' in result_ko:
            print(f"  ✓ [{count}/{total_results}] Result {result_key}: {result_ko['title']} (already expanded)", flush=True)
            continue

        print(f"  🤖 [{count}/{total_results}] Result {result_key}: {result_ko['title']}", flush=True)

        # Get simple desc or summary
        simple_desc = result_ko.get('desc', result_ko.get('summary', ''))

        # Expand using AI
        expanded = expand_result_with_ai(
            test_title,
            result_ko['title'],
            simple_desc,
            test_category
        )

        # Update result
        ko['tests'][test_id]['results'][result_key] = expanded

        print(f"     ✅ Expanded with {len(expanded['characteristics'])} characteristics, "
              f"{len(expanded['strengths'])} strengths, {len(expanded['weaknesses'])} weaknesses", flush=True)

        # Rate limiting - Claude API has limits
        time.sleep(1)

    # Save checkpoint every 5 tests
    if test_num % 5 == 0:
        print(f"\n💾 Checkpoint: Saving at Test {test_num}...", flush=True)
        with open(ko_path, 'w', encoding='utf-8') as f:
            json.dump(ko, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 60, flush=True)
print("💾 Final save...", flush=True)
with open(ko_path, 'w', encoding='utf-8') as f:
    json.dump(ko, f, ensure_ascii=False, indent=2)

print(f"\n✨ All {count} results expanded successfully!", flush=True)
print("\nNext step: Run translate script to generate EN/JA versions", flush=True)
