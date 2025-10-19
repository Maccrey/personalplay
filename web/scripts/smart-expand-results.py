#!/usr/bin/env python3
"""
Smart template-based result expansion
Creates unique, contextually relevant content based on keywords in existing descriptions
"""

import json
import sys
from pathlib import Path
import re

sys.stdout.reconfigure(line_buffering=True)

# Keyword-based content templates for different aspects
PERSONALITY_KEYWORDS = {
    '열정': {
        'chars': ['적극적이고 에너지 넘치는 성향', '목표를 향해 열정적으로 나아가는 스타일', '주변 사람들에게 긍정적인 영향을 줌'],
        'strengths': ['높은 동기부여와 추진력', '어려움 앞에서도 포기하지 않는 끈기', '주변에 활력을 불어넣는 능력'],
        'weaknesses': ['때로는 과도한 열정으로 번아웃 위험', '섬세한 부분을 놓칠 수 있음'],
        'advice': '열정을 유지하면서도 적절한 휴식을 취하세요. 장기적인 관점에서 균형을 맞추는 것이 중요합니다.'
    },
    '차분': {
        'chars': ['침착하고 안정적인 성향', '상황을 객관적으로 판단하는 능력', '감정 조절이 뛰어남'],
        'strengths': ['냉정한 판단력과 분석 능력', '스트레스 상황에서도 평정심 유지', '신뢰감을 주는 태도'],
        'weaknesses': ['때로는 너무 신중해 기회를 놓칠 수 있음', '감정 표현이 부족해 보일 수 있음'],
        'advice': '안정성도 중요하지만, 때로는 과감한 도전도 필요합니다. 자신의 감정을 적절히 표현하는 연습을 해보세요.'
    },
    '소통': {
        'chars': ['타인과의 교류를 즐기는 성향', '공감 능력이 뛰어남', '대화를 통해 관계를 발전시킴'],
        'strengths': ['뛰어난 커뮤니케이션 능력', '다양한 사람들과 잘 어울림', '팀워크와 협력 능력'],
        'weaknesses': ['혼자만의 시간이 부족할 수 있음', '타인의 의견에 과도하게 영향받을 수 있음'],
        'advice': '좋은 소통 능력을 유지하면서도, 자신만의 의견과 가치관을 확립하는 것이 중요합니다.'
    },
    '독립': {
        'chars': ['자기주도적이고 독립적인 성향', '스스로 결정하고 책임지는 태도', '자신만의 길을 개척함'],
        'strengths': ['강한 자립심과 주체성', '창의적인 문제 해결 능력', '자기 관리 능력'],
        'weaknesses': ['때로는 도움을 요청하기 어려워함', '고집이 세다는 평가를 받을 수 있음'],
        'advice': '독립성을 유지하면서도, 필요할 때는 타인의 도움을 받아들이는 유연함을 가지세요.'
    },
    '창의': {
        'chars': ['독창적이고 혁신적인 사고방식', '새로운 아이디어를 잘 떠올림', '틀에 박히지 않은 접근'],
        'strengths': ['풍부한 상상력과 창의성', '문제를 다양한 각도에서 바라봄', '혁신적인 해결책 제시'],
        'weaknesses': ['현실적인 제약을 간과할 수 있음', '체계적인 실행력이 부족할 수 있음'],
        'advice': '창의성을 발휘하되, 실현 가능성도 함께 고려하세요. 아이디어를 구체화하는 능력을 키우면 더욱 빛날 것입니다.'
    },
    '계획': {
        'chars': ['체계적이고 조직적인 성향', '목표 달성을 위한 로드맵을 잘 수립함', '철저한 준비성'],
        'strengths': ['뛰어난 계획 수립 능력', '시간 관리와 우선순위 설정에 능함', '목표 달성률이 높음'],
        'weaknesses': ['예상치 못한 변수에 당황할 수 있음', '완벽주의로 스트레스 받을 수 있음'],
        'advice': '계획성을 유지하되, 변화에 대응하는 유연성도 함께 키워보세요. 때로는 즉흥적인 순간도 즐기는 여유를 가지세요.'
    },
}

def extract_keywords(text):
    """Extract relevant keywords from description"""
    keywords = []
    for keyword in PERSONALITY_KEYWORDS.keys():
        if keyword in text:
            keywords.append(keyword)
    return keywords

def generate_expanded_content(title, desc, test_title):
    """Generate contextually appropriate expanded content"""

    # Extract keywords
    combined_text = f"{title} {desc} {test_title}"
    keywords = extract_keywords(combined_text)

    # If no keywords match, use generic approach
    if not keywords:
        # Use title/desc length and characters to generate variety
        seed = len(title) + len(desc)
        variation = seed % 3

        characteristics = [
            f"{desc}",
            ["이 유형은 독특한 개성을 가지고 있습니다.", "자신만의 스타일을 추구합니다.", "균형잡힌 사고방식을 가지고 있습니다."][variation],
            ["상황에 맞게 유연하게 대처합니다.", "일관성 있는 행동 패턴을 보입니다.", "새로운 환경에도 잘 적응합니다."][variation],
            ["타인을 배려하는 마음을 가지고 있습니다.", "자신의 가치관이 명확합니다.", "끊임없이 성장하려 노력합니다."][variation]
        ]

        strengths = [
            ["긍정적인 마인드로 어려움을 극복합니다.", "실용적인 문제 해결 능력을 가지고 있습니다.", "목표 지향적인 태도를 보입니다."][variation],
            ["타인과의 관계에서 신뢰를 얻습니다.", "새로운 경험을 즐깁니다.", "책임감이 강합니다."][variation],
            ["자기 계발에 관심이 많습니다.", "균형잡힌 판단력을 가지고 있습니다.", "진정성 있는 태도를 보입니다."][variation]
        ]

        weaknesses = [
            ["때로는 자신의 감정을 표현하는 데 어려움을 겪을 수 있습니다.", "스트레스 관리가 필요할 수 있습니다.", "타인의 시선을 의식할 수 있습니다."][variation],
            ["완벽을 추구하다 지칠 수 있습니다.", "결정을 내리는 데 시간이 걸릴 수 있습니다.", "자신에게 너무 엄격할 수 있습니다."][variation],
            ["변화를 받아들이기 어려울 수 있습니다.", "우선순위 설정에 고민할 수 있습니다.", "혼자 모든 것을 해결하려 할 수 있습니다."][variation]
        ]

        advice = [
            "자신의 장점을 더욱 발전시키고, 약점은 보완해나가세요. 균형잡힌 성장이 중요합니다.",
            "자신만의 속도로 나아가되, 때로는 주변의 조언에도 귀 기울이세요. 함께 성장하는 것도 가치있습니다.",
            "현재의 모습도 충분히 좋지만, 더 나은 자신을 위해 노력하는 과정을 즐기세요. 작은 변화들이 모여 큰 성장을 만듭니다."
        ][variation]

    else:
        # Use keyword-based templates
        primary_keyword = keywords[0]
        template = PERSONALITY_KEYWORDS[primary_keyword]

        characteristics = [
            desc,
            template['chars'][0],
            template['chars'][1] if len(template['chars']) > 1 else "자신만의 강점을 잘 활용합니다.",
            template['chars'][2] if len(template['chars']) > 2 else "지속적으로 발전해나가는 모습을 보입니다."
        ]

        strengths = template['strengths'][:3]
        weaknesses = template['weaknesses'][:3] if len(template['weaknesses']) >= 3 else template['weaknesses'] + ["자기 인식을 높이면 개선 가능합니다."]
        advice = template['advice']

    # Create summary (first 50 chars of desc)
    summary = desc if len(desc) <= 50 else desc[:47] + "..."

    return {
        "title": title,
        "summary": summary,
        "description": desc,
        "characteristics": characteristics,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "advice": advice
    }

ko_path = Path(__file__).parent.parent / 'locales' / 'ko.json'

print("Loading Korean locale file...", flush=True)
with open(ko_path, encoding='utf-8') as f:
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

    print(f"\n📝 Test {test_id}/60: {test_title}", flush=True)
    print("-" * 60, flush=True)

    for result_key in test_ko['results'].keys():
        result_ko = test_ko['results'][result_key]
        count += 1

        # Skip if already expanded
        if 'characteristics' in result_ko:
            print(f"  ✓ [{count}/{total_results}] Result {result_key}: {result_ko['title']} (already expanded)", flush=True)
            continue

        print(f"  🔨 [{count}/{total_results}] Result {result_key}: {result_ko['title']}", flush=True)

        # Get simple desc
        simple_desc = result_ko.get('desc', result_ko.get('summary', ''))

        # Expand using smart templates
        expanded = generate_expanded_content(
            result_ko['title'],
            simple_desc,
            test_title
        )

        # Update result
        ko['tests'][test_id]['results'][result_key] = expanded

        print(f"     ✅ Expanded", flush=True)

    # Save checkpoint every 10 tests
    if test_num % 10 == 0:
        print(f"\n💾 Checkpoint: Saving at Test {test_num}...", flush=True)
        with open(ko_path, 'w', encoding='utf-8') as f:
            json.dump(ko, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 60, flush=True)
print("💾 Final save...", flush=True)
with open(ko_path, 'w', encoding='utf-8') as f:
    json.dump(ko, f, ensure_ascii=False, indent=2)

print(f"\n✨ All {count} results expanded successfully!", flush=True)
print("\nNext step: Run translation script to generate EN/JA versions", flush=True)
