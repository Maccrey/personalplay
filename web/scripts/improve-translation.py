#!/usr/bin/env python3
"""
번역 품질 개선 - 실제 사람이 읽을 수 있는 수준으로
"""

import json
import re

# 고품질 질문 번역 (수동으로 정리)
HIGH_QUALITY_PATTERNS = {
    'en': [
        (r'Do you (.+)에 (.+) (.+)\?', r'Do you \2 \1 \3?'),  # 조사 제거
        (r'Do you (.+)를 (.+)\?', r'Do you \2 \1?'),
        (r'Do you (.+)을 (.+)\?', r'Do you \2 \1?'),
        (r'Do you (.+)이 (.+)\?', r'Is \1 \2?'),
        (r'Do you (.+)가 (.+)\?', r'Is \1 \2?'),
    ],
    'ja': [
        (r'(.+)에 (.+) (.+)か？', r'\1\2\3か？'),  # 조사 제거
        (r'(.+)를 (.+)か？', r'\1を\2か？'),
        (r'(.+)을 (.+)か？', r'\1を\2か？'),
    ]
}

# 명확한 전체 문장 번역
SENTENCE_TRANSLATIONS = {
    'en': {
        '데이트에 먼저 연락하나요?': 'Do you contact first for dates?',
        '선물에 신경을 쓰나요?': 'Do you care about gifts?',
        '싸움 후 먼저 화해하나요?': 'Do you make up first after a fight?',
        '기념일을 꼭 챙기나요?': 'Do you always remember anniversaries?',
        '연인의 SNS를 자주 확인하나요?': 'Do you often check your partner\'s social media?',
        '스킨십을 좋아하나요?': 'Do you like physical affection?',
        '데이트 코스를 직접 계획하나요?': 'Do you plan dates yourself?',
        '연인의 과거가 궁금한가요?': 'Are you curious about your partner\'s past?',
        '질투를 많이 하나요?': 'Do you get jealous often?',
        '연애 중에도 개인 시간이 필요한가요?': 'Do you need personal time while dating?',
        '연인에게 자주 사랑한다고 말하나요?': 'Do you often say "I love you"?',
        '연인의 친구들과 친해지려고 노력하나요?': 'Do you try to get along with your partner\'s friends?',
        '모임에 먼저 제안하나요?': 'Do you suggest gatherings first?',
        '친구의 고민을 잘 들어주나요?': 'Do you listen to friends\' concerns well?',
        '비밀을 잘 지키나요?': 'Do you keep secrets well?',
        '친구들과 자주 연락하나요?': 'Do you contact friends often?',
        '친구가 힘들 때 바로 달려가나요?': 'Do you rush to help when friends are in trouble?',
        '친구에게 먼저 사과하나요?': 'Do you apologize to friends first?',
        '친구의 생일을 꼭 챙기나요?': 'Do you always remember friends\' birthdays?',
        '새로운 친구를 쉽게 사귀나요?': 'Do you make new friends easily?',
        '친구와 여행을 자주 가나요?': 'Do you travel with friends often?',
        '친구들 사이에서 중재를 잘 하나요?': 'Do you mediate well between friends?',
        '친구에게 솔직한 조언을 하나요?': 'Do you give honest advice to friends?',
        '친구의 성공을 진심으로 기뻐하나요?': 'Do you sincerely celebrate friends\' success?',
    },
    'ja': {
        '데이트에 먼저 연락하나요?': 'デートに先に連絡しますか？',
        '선물에 신경을 쓰나요?': 'プレゼントに気を使いますか？',
        '싸움 후 먼저 화해하나요?': '喧嘩の後先に仲直りしますか？',
        '기념일을 꼭 챙기나요?': '記念日を必ず覚えていますか？',
        '연인의 SNS를 자주 확인하나요?': '恋人のSNSをよくチェックしますか？',
        '스킨십을 좋아하나요?': 'スキンシップが好きですか？',
        '데이트 코스를 직접 계획하나요?': 'デートコースを自分で計画しますか？',
        '연인의 과거가 궁금한가요?': '恋人の過去が気になりますか？',
        '질투를 많이 하나요?': '嫉妬をたくさんしますか？',
        '연애 중에도 개인 시간이 필요한가요?': '恋愛中でも個人の時間が必要ですか？',
        '연인에게 자주 사랑한다고 말하나요?': '恋人によく愛していると言いますか？',
        '연인의 친구들과 친해지려고 노력하나요?': '恋人の友達と仲良くしようと努力しますか？',
        '모임에 먼저 제안하나요?': '集まりを先に提案しますか？',
        '친구의 고민을 잘 들어주나요?': '友達の悩みをよく聞いてあげますか？',
        '비밀을 잘 지키나요?': '秘密をよく守りますか？',
        '친구들과 자주 연락하나요?': '友達とよく連絡しますか？',
        '친구가 힘들 때 바로 달려가나요?': '友達が辛い時すぐに駆けつけますか？',
        '친구에게 먼저 사과하나요?': '友達に先に謝りますか？',
        '친구의 생일을 꼭 챙기나요?': '友達の誕生日を必ず覚えていますか？',
        '새로운 친구를 쉽게 사귀나요?': '新しい友達を簡単に作りますか？',
        '친구와 여행을 자주 가나요?': '友達とよく旅行に行きますか？',
        '친구들 사이에서 중재를 잘 하나요?': '友達の間でよく仲裁しますか？',
        '친구에게 솔직한 조언을 하나요?': '友達に正直なアドバイスをしますか？',
        '친구의 성공을 진심으로 기뻐하나요?': '友達の成功を心から喜びますか？',
    }
}

def improve_translation(text, lang):
    """번역 품질 개선"""
    # 먼저 전체 문장 매칭
    if text in SENTENCE_TRANSLATIONS.get(lang, {}):
        return SENTENCE_TRANSLATIONS[lang][text]

    # 패턴 정리
    result = text
    for pattern, replacement in HIGH_QUALITY_PATTERNS.get(lang, []):
        result = re.sub(pattern, replacement, result)

    return result

def main():
    print("🔧 Improving translation quality...\n")

    # 파일 읽기
    with open('locales/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('locales/ja.json', 'r', encoding='utf-8') as f:
        ja = json.load(f)

    improved_en = 0
    improved_ja = 0

    # 각 테스트 개선
    for test_id, test_data in en['tests'].items():
        questions = test_data.get('questions', [])
        improved = [improve_translation(q, 'en') for q in questions]
        en['tests'][test_id]['questions'] = improved
        improved_en += len(improved)

    for test_id, test_data in ja['tests'].items():
        questions = test_data.get('questions', [])
        improved = [improve_translation(q, 'ja') for q in questions]
        ja['tests'][test_id]['questions'] = improved
        improved_ja += len(improved)

    # 저장
    with open('locales/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, ensure_ascii=False, indent=2)

    with open('locales/ja.json', 'w', encoding='utf-8') as f:
        json.dump(ja, f, ensure_ascii=False, indent=2)

    print(f"✅ Improved translations!")
    print(f"   English: {improved_en} questions")
    print(f"   Japanese: {improved_ja} questions")

if __name__ == '__main__':
    main()
