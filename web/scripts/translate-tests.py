#!/usr/bin/env python3
"""
테스트 질문 및 결과를 영어와 일본어로 자동 번역
간단한 매핑 기반 번역 (실제 프로덕션에서는 번역 API 사용 권장)
"""

import json
import sys

# 기본 질문 번역 사전 (자주 사용되는 패턴)
COMMON_TRANSLATIONS = {
    'en': {
        '데이트에 먼저 연락하나요?': 'Do you contact first for a date?',
        '선물에 신경을 쓰나요?': 'Do you care about gifts?',
        '싸움 후 먼저 화해하나요?': 'Do you reconcile first after a fight?',
        '기념일을 꼭 챙기나요?': 'Do you always remember anniversaries?',
        '연인의 SNS를 자주 확인하나요?': 'Do you often check your partner\'s SNS?',
        '스킨십을 좋아하나요?': 'Do you like physical affection?',
        '데이트 코스를 직접 계획하나요?': 'Do you plan date courses yourself?',
        '연인의 과거가 궁금한가요?': 'Are you curious about your partner\'s past?',
        '질투를 많이 하나요?': 'Do you get jealous often?',
        '연애 중에도 개인 시간이 필요한가요?': 'Do you need personal time even while dating?',
        '연인에게 자주 사랑한다고 말하나요?': 'Do you often say "I love you" to your partner?',
        '연인의 친구들과 친해지려고 노력하나요?': 'Do you try to get along with your partner\'s friends?',
    },
    'ja': {
        '데이트에 먼저 연락하나요?': 'デートの連絡は先にしますか？',
        '선물에 신경을 쓰나요?': 'プレゼントに気を使いますか？',
        '싸움 후 먼저 화해하나요?': '喧嘩の後、先に仲直りしますか？',
        '기념일을 꼭 챙기나요?': '記念日は必ず覚えていますか？',
        '연인의 SNS를 자주 확인하나요?': '恋人のSNSをよくチェックしますか？',
        '스킨십을 좋아하나요?': 'スキンシップが好きですか？',
        '데이트 코스를 직접 계획하나요?': 'デートコースを自分で計画しますか？',
        '연인의 과거가 궁금한가요?': '恋人の過去が気になりますか？',
        '질투를 많이 하나요?': '嫉妬をよくしますか？',
        '연애 중에도 개인 시간이 필요한가요?': '恋愛中でも個人の時間が必要ですか？',
        '연인에게 자주 사랑한다고 말하나요?': '恋人に頻繁に愛していると言いますか？',
        '연인의 친구들과 친해지려고 노력하나요?': '恋人の友達と仲良くしようと努力しますか？',
    }
}

# 일반적인 질문 패턴 번역
def translate_question(question, lang):
    """질문을 번역 (매핑 기반 + 패턴 기반)"""

    # 직접 매핑이 있으면 사용
    if question in COMMON_TRANSLATIONS.get(lang, {}):
        return COMMON_TRANSLATIONS[lang][question]

    # 패턴 기반 번역
    if lang == 'en':
        # 한국어 → 영어 패턴
        patterns = [
            ('~나요?', ''),
            ('~하나요?', ''),
            ('먼저', 'first'),
            ('자주', 'often'),
            ('많이', 'a lot'),
            ('꼭', 'always'),
        ]

        # 간단한 번역 (실제로는 더 정교한 번역 필요)
        if '나요?' in question or '하나요?' in question:
            return f"Do you {question.replace('나요?', '').replace('하나요?', '')}?"

    elif lang == 'ja':
        # 한국어 → 일본어 패턴
        if '나요?' in question or '하나요?' in question:
            return f"{question.replace('나요?', '').replace('하나요?', '')}か？"

    # 번역을 찾지 못하면 원문 반환 (나중에 수동 번역 필요 표시)
    return f"[TODO: {question}]"

def translate_tests():
    """모든 테스트 번역"""

    # 한국어 원본 읽기
    with open('locales/ko.json', 'r', encoding='utf-8') as f:
        ko = json.load(f)

    # 영어 파일 읽기
    with open('locales/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)

    # 일본어 파일 읽기
    with open('locales/ja.json', 'r', encoding='utf-8') as f:
        ja = json.load(f)

    print("🌍 Starting translation...\n")

    translated_count = 0
    todo_count = 0

    # 각 테스트에 대해
    for test_id, test_data in ko.get('tests', {}).items():
        ko_questions = test_data.get('questions', [])

        # 영어 번역
        en_questions = []
        for q in ko_questions:
            translated = translate_question(q, 'en')
            en_questions.append(translated)
            if '[TODO:' in translated:
                todo_count += 1
            else:
                translated_count += 1

        # 일본어 번역
        ja_questions = []
        for q in ko_questions:
            translated = translate_question(q, 'ja')
            ja_questions.append(translated)
            if '[TODO:' in translated:
                todo_count += 1
            else:
                translated_count += 1

        # 영어 파일 업데이트
        if test_id in en['tests']:
            en['tests'][test_id]['questions'] = en_questions

        # 일본어 파일 업데이트
        if test_id in ja['tests']:
            ja['tests'][test_id]['questions'] = ja_questions

        if int(test_id) % 10 == 0:
            print(f"✓ Translated test {test_id}/60")

    # 파일 저장
    with open('locales/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, ensure_ascii=False, indent=2)

    with open('locales/ja.json', 'w', encoding='utf-8') as f:
        json.dump(ja, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Translation completed!")
    print(f"   - Translated: {translated_count} questions")
    print(f"   - TODO (manual translation needed): {todo_count} questions")
    print(f"\n📝 Files updated:")
    print(f"   - locales/en.json")
    print(f"   - locales/ja.json")

    if todo_count > 0:
        print(f"\n⚠️  {todo_count} questions need manual translation (marked with [TODO:])")

if __name__ == '__main__':
    translate_tests()
