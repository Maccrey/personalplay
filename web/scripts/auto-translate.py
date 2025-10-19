#!/usr/bin/env python3
"""
간단한 한→영→일 번역 (기본 패턴 기반)
60개 테스트의 모든 질문을 번역합니다.
"""

import json

# 핵심 번역 사전
TRANSLATIONS = {
    'en': {
        # 질문 접미사
        '나요?': '',
        '하나요?': '',
        '인가요?': '',
        '가요?': '',

        # 부사/형용사
        '먼저': 'first',
        '자주': 'often',
        '많이': 'much / a lot',
        '꼭': 'always',
        '직접': 'personally / yourself',
        '잘': 'well',
        '쉽게': 'easily',
        '바로': 'immediately',
        '진심으로': 'sincerely',

        # 동사구
        '연락하': 'contact',
        '신경을 쓰': 'care about',
        '화해하': 'reconcile',
        '챙기': 'remember / take care of',
        '확인하': 'check',
        '좋아하': 'like',
        '계획하': 'plan',
        '궁금하': 'curious about',
        '질투': 'jealous',
        '필요하': 'need',
        '말하': 'say',
        '노력하': 'try / make an effort',
        '제안하': 'suggest',
        '들어주': 'listen',
        '지키': 'keep',
        '달려가': 'rush to',
        '사과하': 'apologize',
        '사귀': 'make friends',
        '여행': 'travel',
        '중재': 'mediate',
        '조언': 'advise',
        '기뻐하': 'be happy',

        # 명사
        '데이트': 'date',
        '선물': 'gift',
        '싸움': 'fight',
        '기념일': 'anniversary',
        '연인': 'partner / lover',
        '스킨십': 'physical affection',
        '과거': 'past',
        '개인 시간': 'personal time',
        '친구': 'friend',
        '모임': 'gathering',
        '고민': 'worry / concern',
        '비밀': 'secret',
        '생일': 'birthday',
        '성공': 'success',
    },
    'ja': {
        # 질문 접미사
        '나요?': 'か？',
        '하나요?': 'ますか？',
        '인가요?': 'ですか？',
        '가요?': 'ますか？',

        # 부사/형용사
        '먼저': '先に',
        '자주': 'よく',
        '많이': 'たくさん',
        '꼭': '必ず',
        '직접': '自分で',
        '잘': 'よく',
        '쉽게': '簡単に',
        '바로': 'すぐに',
        '진심으로': '心から',

        # 동사구
        '연락하': '連絡し',
        '신경을 쓰': '気を使い',
        '화해하': '仲直りし',
        '챙기': '覚えてい',
        '확인하': 'チェックし',
        '좋아하': '好き',
        '계획하': '計画し',
        '궁금하': '気になり',
        '질투': '嫉妬',
        '필요하': '必要',
        '말하': '言い',
        '노력하': '努力し',
        '제안하': '提案し',
        '들어주': '聞いてあげ',
        '지키': '守り',
        '달려가': '駆けつけ',
        '사과하': '謝り',
        '사귀': '友達を作り',
        '여행': '旅行',
        '중재': '仲裁',
        '조언': 'アドバイス',
        '기뻐하': '喜び',

        # 명사
        '데이트': 'デート',
        '선물': 'プレゼント',
        '싸움': '喧嘩',
        '기념일': '記念日',
        '연인': '恋人',
        'SNS': 'SNS',
        '스킨십': 'スキンシップ',
        '과거': '過去',
        '개인 시간': '個人の時間',
        '친구': '友達',
        '모임': '集まり',
        '고민': '悩み',
        '비밀': '秘密',
        '생일': '誕生日',
        '성공': '成功',
    }
}

def simple_translate(text, lang):
    """간단한 단어 치환 번역"""
    if lang == 'en':
        # 영어: "Do you ~?" 패턴
        result = text
        for ko, en in TRANSLATIONS['en'].items():
            result = result.replace(ko, en)
        # 질문 형태로 변환
        result = result.strip()
        if not result.startswith('Do '):
            result = f"Do you {result.lower()}"
        if not result.endswith('?'):
            result = result + '?'
        return result

    elif lang == 'ja':
        # 일본어: 단어 치환
        result = text
        for ko, ja in TRANSLATIONS['ja'].items():
            result = result.replace(ko, ja)
        if not result.endswith('？') and not result.endswith('か？'):
            result = result + 'か？'
        return result

    return text

def main():
    print("🌍 Auto Translation Starting...\n")

    # 파일 읽기
    with open('locales/ko.json', 'r', encoding='utf-8') as f:
        ko = json.load(f)
    with open('locales/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('locales/ja.json', 'r', encoding='utf-8') as f:
        ja = json.load(f)

    total_questions = 0
    translated_en = 0
    translated_ja = 0

    # 각 테스트 번역
    for test_id, test_data in ko['tests'].items():
        questions = test_data.get('questions', [])
        total_questions += len(questions)

        # 영어 번역
        en_questions = [simple_translate(q, 'en') for q in questions]
        en['tests'][test_id]['questions'] = en_questions
        translated_en += len(en_questions)

        # 일본어 번역
        ja_questions = [simple_translate(q, 'ja') for q in questions]
        ja['tests'][test_id]['questions'] = ja_questions
        translated_ja += len(ja_questions)

        if int(test_id) % 10 == 0:
            print(f"✓ Test {test_id}/60 translated")

    # 파일 저장
    with open('locales/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, ensure_ascii=False, indent=2)

    with open('locales/ja.json', 'w', encoding='utf-8') as f:
        json.dump(ja, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Translation Completed!")
    print(f"   Total questions: {total_questions}")
    print(f"   English: {translated_en} questions")
    print(f"   Japanese: {translated_ja} questions")
    print(f"\n📝 Updated files:")
    print(f"   - locales/en.json")
    print(f"   - locales/ja.json")

if __name__ == '__main__':
    main()
