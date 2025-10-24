#!/usr/bin/env python3
"""
Utility script to append additional love/relationship tests and translations.

The script updates:
- web/data/tests.json (server-side build data)
- web/public/data/tests-ko.json
- web/public/data/tests-en.json
- web/public/data/tests-ja.json
- web/locales/ko.json
- web/locales/en.json
- web/locales/ja.json
"""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


RESULTS_TEMPLATE = {
    "ko": {
        "A": {
            "title": "직진 로맨틱형",
            "summary": "먼저 다가가며 관계를 이끄는 스타일입니다.",
            "description": "당신은 사랑을 느끼면 바로 행동으로 옮깁니다. 적극적인 표현과 빠른 결단으로 상대의 마음을 두근거리게 만드는 타입입니다.",
            "characteristics": [
                "먼저 연락하고 만남을 주도합니다.",
                "감정 표현이 솔직하고 사랑을 숨기지 않습니다.",
                "상대와의 시간을 최우선으로 생각합니다.",
                "관계를 빠르게 발전시키는 편입니다."
            ],
            "strengths": [
                "상대에게 확신과 안정감을 줍니다.",
                "관계를 활기차게 유지합니다.",
                "문제가 생기면 바로 해결하려고 합니다."
            ],
            "weaknesses": [
                "상대가 부담을 느낄 수 있습니다.",
                "속도가 너무 빠를 수 있습니다.",
                "감정 기복이 클 수 있습니다."
            ],
            "advice": "앞으로도 주도적인 장점을 살리되, 상대의 페이스도 살펴보세요. 잠시 호흡을 맞추는 여유가 관계를 더욱 단단하게 합니다."
        },
        "B": {
            "title": "균형 잡힌 파트너형",
            "summary": "상황에 따라 속도와 온도를 맞추는 유연한 스타일입니다.",
            "description": "당신은 상대와의 템포를 자연스럽게 맞추며 안정적인 관계를 만들어 가는 사람입니다. 감정과 현실을 모두 고려하는 균형 감각이 돋보입니다.",
            "characteristics": [
                "대화와 행동에서 균형감을 유지합니다.",
                "상대의 감정을 세심하게 살핍니다.",
                "갈등이 생기면 차분하게 이야기합니다.",
                "함께 성장하는 관계를 중요하게 생각합니다."
            ],
            "strengths": [
                "신뢰감이 높고 의지가 되는 파트너입니다.",
                "갈등을 원만하게 해결하려고 노력합니다.",
                "현실적인 계획을 세우는 데 능숙합니다."
            ],
            "weaknesses": [
                "감정을 숨기고 속으로만 고민할 수 있습니다.",
                "결정을 내리는 데 시간이 걸릴 수 있습니다.",
                "때때로 열정을 낮춰 보일 수 있습니다."
            ],
            "advice": "가끔은 마음속 이야기를 조금 더 솔직하게 표현해보세요. 진심 어린 한마디가 관계를 더 가깝게 만듭니다."
        },
        "C": {
            "title": "따뜻한 관찰형",
            "summary": "천천히 다가가며 관계의 안정감을 중시하는 스타일입니다.",
            "description": "당신은 충분한 시간과 믿음을 쌓은 뒤에 마음을 여는 타입입니다. 신중함 덕분에 한 번 연애를 시작하면 매우 깊고 오래가는 편입니다.",
            "characteristics": [
                "상대의 반응을 지켜보며 템포를 조절합니다.",
                "관계를 시작하기 전에 스스로 확신을 얻고 싶어 합니다.",
                "감정보다 배려와 책임을 우선합니다.",
                "작은 약속을 소중히 지킵니다."
            ],
            "strengths": [
                "믿음직하고 성실한 파트너입니다.",
                "상대의 감정을 깊이 공감합니다.",
                "관계를 오래 유지하는 힘이 있습니다."
            ],
            "weaknesses": [
                "마음을 표현하는 데 시간이 걸립니다.",
                "주도적으로 나서는 일이 적을 수 있습니다.",
                "변화에 대한 두려움이 있을 수 있습니다."
            ],
            "advice": "당신의 따뜻함은 큰 장점입니다. 다만 가끔은 먼저 손을 내밀어 속마음을 보여주세요. 작은 표현이 큰 신뢰로 돌아옵니다."
        }
    },
    "en": {
        "A": {
            "title": "Bold Romantic",
            "summary": "You take the lead and move quickly when you feel a spark.",
            "description": "Once you feel love, you turn it into action right away. Your confident gestures and fast decisions keep the relationship exciting.",
            "characteristics": [
                "You reach out first and plan the dates.",
                "You are honest with your affection and never hide it.",
                "Time with your partner is your top priority.",
                "Relationships tend to speed up around you."
            ],
            "strengths": [
                "You offer firm reassurance and passion.",
                "You keep the relationship lively and fun.",
                "You face issues head-on and try to solve them quickly."
            ],
            "weaknesses": [
                "Your pace can feel overwhelming.",
                "Things may move too fast at times.",
                "You might experience strong emotional swings."
            ],
            "advice": "Keep using your initiative, but take moments to match your partner’s pace. A short pause to check in can make the bond even stronger."
        },
        "B": {
            "title": "Balanced Partner",
            "summary": "You naturally adjust the tempo and warmth of the relationship.",
            "description": "You read the situation well and build a stable relationship. Your ability to balance feelings and reality makes you a reliable partner.",
            "characteristics": [
                "You maintain harmony in both words and actions.",
                "You pay close attention to your partner’s emotions.",
                "Conflicts are handled through calm conversations.",
                "You value growing together as a couple."
            ],
            "strengths": [
                "You are trustworthy and steady.",
                "You look for fair resolutions to disagreements.",
                "You are skilled at creating realistic plans."
            ],
            "weaknesses": [
                "You sometimes keep concerns to yourself.",
                "Decisions can take time.",
                "Your passion may appear muted."
            ],
            "advice": "Try voicing your honest feelings a bit more. A heartfelt sentence can bring you even closer together."
        },
        "C": {
            "title": "Warm Observer",
            "summary": "You move slowly and value security above everything else.",
            "description": "You prefer to build trust before opening your heart. Once you commit, you invest deeply and stay devoted for the long run.",
            "characteristics": [
                "You watch and adjust to your partner’s rhythm.",
                "You seek inner certainty before starting something serious.",
                "Care and responsibility come before spontaneity.",
                "You keep promises and pay attention to small details."
            ],
            "strengths": [
                "You are dependable and sincere.",
                "You empathize with your partner’s feelings.",
                "You create relationships that last."
            ],
            "weaknesses": [
                "It can take time to show your heart.",
                "You may hesitate to take the lead.",
                "You might fear sudden changes."
            ],
            "advice": "Your warmth is a precious strength. Just remember to take the first step occasionally and share what you feel. Small expressions build big trust."
        }
    },
    "ja": {
        "A": {
            "title": "一直線ロマンチック型",
            "summary": "ときめきを感じたら迷わず行動するタイプです。",
            "description": "恋を感じたらすぐに行動に移します。積極的な表現と素早い決断で、相手の心をドキドキさせるスタイルです。",
            "characteristics": [
                "自分から連絡し、デートをリードします。",
                "感情表現がストレートで愛情を隠しません。",
                "大切な人との時間を最優先します。",
                "関係がスピーディーに進みがちです。"
            ],
            "strengths": [
                "相手に安心感と情熱を与えます。",
                "関係をいつも明るく楽しく保ちます。",
                "問題が起きるとすぐに解決しようとします。"
            ],
            "weaknesses": [
                "相手がプレッシャーを感じることがあります。",
                "ペースが速すぎることがあります。",
                "感情の波が大きい場合があります。"
            ],
            "advice": "あなたのリード力は大きな魅力です。ときどき相手のペースも意識してみましょう。少し立ち止まって息を合わせることで、絆がさらに深まります。"
        },
        "B": {
            "title": "バランス型パートナー",
            "summary": "状況に合わせてテンポや温度を調整できる柔軟なタイプです。",
            "description": "相手の気持ちを読み取りながら、安定した関係を築く人です。感情と現実の両方を大切にできるバランス感覚が光ります。",
            "characteristics": [
                "会話と行動のバランスが整っています。",
                "相手の気持ちに細かく気づきます。",
                "衝突が起きても落ち着いて話し合います。",
                "一緒に成長する関係を重視します。"
            ],
            "strengths": [
                "信頼できる落ち着いたパートナーです。",
                "対立を穏やかに解決しようとします。",
                "現実的な計画を立てるのが得意です。"
            ],
            "weaknesses": [
                "本音をため込むことがあります。",
                "決断に時間がかかることがあります。",
                "情熱が控えめに見えることがあります。"
            ],
            "advice": "たまには心の中の気持ちを素直に伝えてみてください。心からの一言が、2人の距離をぐっと縮めてくれます。"
        },
        "C": {
            "title": "あたたかい観察型",
            "summary": "ゆっくり距離を縮め、安心感を大切にするタイプです。",
            "description": "十分な時間と信頼を積み重ねてから心を開きます。一度付き合うと深く長く向き合う真面目なスタイルです。",
            "characteristics": [
                "相手の反応を見ながらテンポを調整します。",
                "本気の関係を始める前に自分の中で確信を得たいタイプです。",
                "感情よりも思いやりと責任を重視します。",
                "小さな約束も大切に守ります。"
            ],
            "strengths": [
                "誠実で頼れるパートナーです。",
                "相手の気持ちに深く共感します。",
                "長く続く関係を築く力があります。"
            ],
            "weaknesses": [
                "心を開くまでに時間がかかります。",
                "自分からリードする場面が少ないかもしれません。",
                "急な変化に不安を感じやすいです。"
            ],
            "advice": "あなたのあたたかさは大きな魅力です。ときには自分から一歩踏み出し、心の内を共有してみましょう。小さな表現が大きな信頼につながります。"
        }
    }
}


NEW_TESTS_RAW = [
    {
        "titles": {
            "ko": "첫인상 연애 매력도 테스트",
            "en": "First-Impression Charm Check",
            "ja": "第一印象恋愛チャームテスト",
        },
        "questions": {
            "ko": [
                "첫 만남에서 웃으며 먼저 인사하나요?",
                "처음 만난 사람과도 자연스럽게 대화를 이어가나요?",
                "상대의 작은 디테일까지 빠르게 눈에 들어오나요?",
                "첫 만남 준비를 위해 옷차림과 향기를 신경 쓰나요?",
                "상대가 말할 때 적극적으로 고개를 끄덕이고 반응하나요?",
                "처음부터 칭찬을 자연스럽게 건네는 편인가요?",
                "첫 만남 후 바로 다음 약속을 제안하고 싶어지나요?",
                "첫인상에서 '편안함'을 주고 싶다고 생각하나요?",
            ],
            "en": [
                "Do you greet with a big smile the first time you meet someone?",
                "Can you keep the conversation flowing even with someone you just met?",
                "Do you quickly notice small details about the other person?",
                "Do you put thought into your outfit and scent for first meetings?",
                "Do you react actively while the other person is talking?",
                "Do you naturally give compliments right from the start?",
                "Do you want to suggest a next hangout right after the first meeting?",
                "Do you aim to make people feel comfortable on first impression?",
            ],
            "ja": [
                "初対面で笑顔で先にあいさつしますか？",
                "初めて会う人とも自然に会話を続けられますか？",
                "相手の小さなディテールにもすぐ気づきますか？",
                "初対面のために服装や香りまで気を配りますか？",
                "相手が話すとき、積極的にうなずいたり反応しますか？",
                "最初から自然に褒め言葉を伝えるほうですか？",
                "初対面のあと、すぐ次の約束を提案したくなりますか？",
                "第一印象で「安心感」を与えたいと思いますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연락 템포 궁합 테스트",
            "en": "Messaging Tempo Match Test",
            "ja": "連絡テンポ相性テスト",
        },
        "questions": {
            "ko": [
                "하루에 연락을 여러 번 주고받는 것이 편한가요?",
                "읽고 바로 답장을 보내는 편인가요?",
                "연인이 답장을 늦게 보내면 마음이 불안해지나요?",
                "상대가 바쁘다면 먼저 연락을 자제할 수 있나요?",
                "하루 마무리 인사 메시지를 꼭 전하고 싶나요?",
                "이모티콘이나 귀여운 말투를 자주 사용하는 편인가요?",
                "연락이 뜸해지면 먼저 연락 이유를 묻고 싶나요?",
                "연락 템포가 맞지 않으면 빨리 맞추려 노력하나요?",
            ],
            "en": [
                "Do you like exchanging messages several times a day?",
                "Do you usually reply right after reading a message?",
                "Do you get anxious when your partner replies slowly?",
                "Can you hold back if you know your partner is busy?",
                "Do you like sending a good-night message every day?",
                "Do you use emojis or cute wording often?",
                "If the conversation slows down, do you want to ask what happened?",
                "Do you try to sync the messaging pace quickly if it feels off?",
            ],
            "ja": [
                "1日に何度もメッセージをやり取りするのが心地いいですか？",
                "メッセージを読んだらすぐに返信するほうですか？",
                "恋人の返信が遅いと不安になりますか？",
                "相手が忙しいとわかれば自分から連絡を控えられますか？",
                "一日の終わりにおやすみメッセージを送りたいですか？",
                "絵文字やかわいい言葉遣いをよく使いますか？",
                "連絡が減ると先に理由を聞きたくなりますか？",
                "テンポが合わないと感じたらすぐ合わせようとしますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "데이트 플래너 역량 테스트",
            "en": "Date Planner Skills Test",
            "ja": "デートプランナー能力テスト",
        },
        "questions": {
            "ko": [
                "데이트 전에 장소와 동선을 꼼꼼하게 조사하나요?",
                "예약이 필요한 식당이나 전시를 먼저 체크하나요?",
                "상대의 취향에 맞춰 데이트 콘셉트를 바꾸나요?",
                "날씨에 따라 플랜 B를 준비하는 편인가요?",
                "데이트 중에도 일정이 매끄럽게 이어지도록 신경 쓰나요?",
                "데이트 비용 분배 계획을 미리 생각해두나요?",
                "특별한 포토 스팟이나 추억 포인트를 찾아두나요?",
                "예상치 못한 변수에도 유연하게 대응할 자신이 있나요?",
            ],
            "en": [
                "Do you thoroughly research locations and routes before a date?",
                "Do you check reservations for restaurants or exhibitions in advance?",
                "Do you adjust the date concept to match your partner’s taste?",
                "Do you prepare a plan B in case of weather changes?",
                "Do you care about keeping the schedule smooth during the date?",
                "Do you think ahead about how to split the costs?",
                "Do you look for special photo spots or memory points?",
                "Can you handle unexpected situations flexibly?",
            ],
            "ja": [
                "デート前に場所や動線をしっかり調べますか？",
                "予約が必要なレストランや展示を事前にチェックしますか？",
                "相手の好みに合わせてデートのコンセプトを変えますか？",
                "天気によってプランBを準備するほうですか？",
                "デート中もスケジュールがスムーズになるよう気を配りますか？",
                "デート費用の分担方法をあらかじめ考えますか？",
                "特別なフォトスポットや思い出ポイントを探しますか？",
                "予想外の出来事にも柔軟に対応できる自信がありますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 갈등 해결 스타일 테스트",
            "en": "Relationship Conflict Style Test",
            "ja": "恋愛コンフリクト解決スタイルテスト",
        },
        "questions": {
            "ko": [
                "갈등이 생기면 바로 이야기하고 싶나요?",
                "감정이 고조될 때 잠시 시간을 갖는 것이 도움이 되나요?",
                "상대의 입장을 먼저 듣고 정리하는 편인가요?",
                "사소한 오해라도 풀고 자는 편인가요?",
                "갈등 중에도 존중하는 표현을 잊지 않나요?",
                "문제가 반복되면 해결책을 기록하거나 정리하나요?",
                "감정적인 말보다 구체적인 상황을 설명하려 하나요?",
                "사과와 화해를 위한 자신만의 루틴이 있나요?",
            ],
            "en": [
                "Do you want to talk things out right when conflict arises?",
                "Does taking a short break help when emotions run high?",
                "Do you listen to your partner’s side before responding?",
                "Do you prefer clearing up even minor misunderstandings before bed?",
                "Do you avoid disrespectful language even during disagreements?",
                "Do you document or organize solutions if issues repeat?",
                "Do you focus on specific situations rather than emotional words?",
                "Do you have a routine for apology and reconciliation?",
            ],
            "ja": [
                "衝突が起きたらすぐ話し合いたいですか？",
                "感情が高ぶったときは少し時間を置くと落ち着けますか？",
                "相手の立場を先に聞いて整理するほうですか？",
                "小さな誤解でも寝る前に解消したいですか？",
                "喧嘩の最中でも相手への敬意を忘れませんか？",
                "問題が繰り返されるとき、解決策をメモしたり整理しますか？",
                "感情的な言葉よりも具体的な状況説明を意識しますか？",
                "謝罪や仲直りのための自分なりのルーティンがありますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "스킨십 속도 밸런스 테스트",
            "en": "Physical Intimacy Pace Test",
            "ja": "スキンシップ速度バランステスト",
        },
        "questions": {
            "ko": [
                "상대와 손을 잡는 타이밍을 신중히 생각하나요?",
                "스킨십 단계에 대해 미리 대화하는 편인가요?",
                "상대의 반응을 보며 속도를 조절할 자신이 있나요?",
                "스킨십보다 대화를 더 중요하게 느끼나요?",
                "자연스럽게 스킨십을 이끌어가는 편인가요?",
                "스킨십 후 상대의 감정을 다시 확인하나요?",
                "공공장소에서 스킨십을 할 때 주변 시선을 의식하나요?",
                "스킨십 템포가 맞지 않으면 솔직하게 이야기하나요?",
            ],
            "en": [
                "Do you think carefully about when to hold hands?",
                "Do you discuss physical boundaries in advance?",
                "Can you adjust the pace by reading your partner’s reaction?",
                "Do you value conversation more than skinship?",
                "Do you often lead physical affection naturally?",
                "Do you check in with your partner after physical closeness?",
                "Are you conscious of public attention during skinship?",
                "If the pace feels mismatched, do you talk about it honestly?",
            ],
            "ja": [
                "手をつなぐタイミングを慎重に考えますか？",
                "スキンシップの段階について前もって話し合うほうですか？",
                "相手の反応を見ながらペースを調整できますか？",
                "スキンシップより会話を重視するほうですか？",
                "自然にスキンシップをリードするタイプですか？",
                "スキンシップの後、相手の気持ちを改めて確かめますか？",
                "公共の場でのスキンシップでは周囲の目を気にしますか？",
                "ペースが合わないと感じたら率直に話しますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 감정 표현 스타일 테스트",
            "en": "Love Expression Style Test",
            "ja": "恋愛感情表現スタイルテスト",
        },
        "questions": {
            "ko": [
                "사랑한다는 말을 자주 표현하는 편인가요?",
                "메시지나 손편지로 마음을 전하는 것을 좋아하나요?",
                "감정이 달라졌다고 느끼면 바로 공유하나요?",
                "상대의 표현 방식에 맞춰주려고 노력하나요?",
                "스킨십으로 감정을 표현하는 것이 편하나요?",
                "행동으로 돌려주는 것을 중요하게 생각하나요?",
                "감정이 상했을 때 솔직히 털어놓는 편인가요?",
                "상대가 표현을 덜해도 이유를 이해하려고 하나요?",
            ],
            "en": [
                "Do you say \"I love you\" frequently?",
                "Do you enjoy expressing your feelings through messages or letters?",
                "Do you share it right away if your emotions change?",
                "Do you try to adapt to your partner’s expression style?",
                "Are you comfortable showing love through physical affection?",
                "Do you believe actions speak louder than words?",
                "Do you open up when you feel hurt?",
                "Do you try to understand why your partner might express less?",
            ],
            "ja": [
                "「愛してる」とよく口にしますか？",
                "メッセージや手紙で気持ちを伝えるのが好きですか？",
                "感情の変化を感じたらすぐ共有しますか？",
                "相手の表現スタイルに合わせようとしますか？",
                "スキンシップで愛情を示すのは得意ですか？",
                "行動で返すことを大事にしますか？",
                "傷ついたときは正直に打ち明けますか？",
                "相手の表現が少ないとき、理由を理解しようとしますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "장거리 연애 준비도 테스트",
            "en": "Long-Distance Readiness Test",
            "ja": "遠距離恋愛準備度テスト",
        },
        "questions": {
            "ko": [
                "자주 만나지 못해도 관계를 유지할 자신이 있나요?",
                "화상 통화나 음성 메시지를 즐기는 편인가요?",
                "서로 다른 일정 속에서도 연결감을 느끼나요?",
                "장거리 연애 규칙을 함께 정리할 의지가 있나요?",
                "만나지 못하는 시간에 개인 성장 목표를 세우나요?",
                "불안할 때 감정을 솔직히 털어놓나요?",
                "서프라이즈 방문이나 선물을 자주 계획하나요?",
                "장거리 기간이 끝난 후의 그림을 함께 그려보나요?",
            ],
            "en": [
                "Do you feel confident about maintaining a relationship without frequent meetups?",
                "Do you enjoy video calls or voice messages?",
                "Can you feel connected even with different daily schedules?",
                "Are you willing to set clear long-distance rules together?",
                "Do you set personal growth goals for the time apart?",
                "Do you share your worries honestly when you feel anxious?",
                "Do you plan surprise visits or gifts?",
                "Do you imagine your life together after the distance ends?",
            ],
            "ja": [
                "頻繁に会えなくても関係を維持できる自信がありますか？",
                "ビデオ通話や音声メッセージを楽しむほうですか？",
                "別々のスケジュールでもつながりを感じられますか？",
                "遠距離恋愛のルールを一緒に決める意欲がありますか？",
                "会えない期間に自分の成長目標を立てますか？",
                "不安なときは率直に気持ちを打ち明けますか？",
                "サプライズ訪問やプレゼントを考えますか？",
                "遠距離が終わったあとの姿を一緒に思い描きますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "결혼 마인드 체크 테스트",
            "en": "Marriage Mindset Check",
            "ja": "結婚マインドチェックテスト",
        },
        "questions": {
            "ko": [
                "결혼 후의 생활 모습을 자주 상상해보나요?",
                "재정 계획이나 예산을 함께 상의하고 싶나요?",
                "가족 행사나 명절에 대해 어떻게 할지 이야기한 적이 있나요?",
                "서로의 직업과 꿈을 지속적으로 응원할 준비가 되었나요?",
                "생활 방식의 차이를 조율할 자신이 있나요?",
                "양가 가족과의 관계도 중요하게 생각하나요?",
                "결혼 전 필요한 체크리스트를 만들어보고 싶나요?",
                "결혼을 결정할 때 중요한 가치를 서로 공유했나요?",
            ],
            "en": [
                "Do you often picture daily life after marriage?",
                "Do you want to discuss financial plans together?",
                "Have you talked about how to handle family events or holidays?",
                "Are you ready to support each other’s careers and dreams continuously?",
                "Do you feel confident about adjusting different lifestyles?",
                "Do you consider relationships with both families important?",
                "Do you want to create a pre-marriage checklist together?",
                "Have you shared the core values that guide your marriage decision?",
            ],
            "ja": [
                "結婚後の生活をよく想像しますか？",
                "財政計画や予算を一緒に話し合いたいですか？",
                "家族行事やお正月をどうするか話し合ったことがありますか？",
                "お互いの仕事や夢を継続的に応援する準備はできていますか？",
                "生活スタイルの違いを調整できる自信がありますか？",
                "両家との関係も大切だと思いますか？",
                "結婚前に必要なチェックリストを作りたいですか？",
                "結婚を決めるときの大切な価値観を共有しましたか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 리더십 자가 진단",
            "en": "Relationship Leadership Self-Check",
            "ja": "恋愛リーダーシップ診断",
        },
        "questions": {
            "ko": [
                "데이트나 여행 계획을 주도하는 것을 즐기나요?",
                "중요한 결정을 내릴 때 먼저 의견을 제시하나요?",
                "연인이 고민할 때 해결책을 제안하나요?",
                "관계의 방향성을 가끔 먼저 이야기하나요?",
                "상대에게 목표나 계획을 함께 세우자고 제안하나요?",
                "어려운 순간에도 침착하게 상황을 정리하나요?",
                "리더십을 발휘하면서도 상대 의견을 경청하나요?",
                "책임감 때문에 부담을 느끼는 순간이 있나요?",
            ],
            "en": [
                "Do you enjoy leading date or trip plans?",
                "Do you share your opinion first when big decisions are needed?",
                "Do you suggest solutions when your partner is worried?",
                "Do you sometimes initiate talks about the direction of the relationship?",
                "Do you propose setting goals or plans together?",
                "Can you stay calm and organize things in tough moments?",
                "Even while leading, do you actively listen to your partner?",
                "Do you sometimes feel pressure from your sense of responsibility?",
            ],
            "ja": [
                "デートや旅行の計画をリードするのが好きですか？",
                "大事な決断が必要なとき、先に自分の意見を伝えますか？",
                "恋人が悩んでいるとき、解決策を提案しますか？",
                "関係の方向性について自分から話すことがありますか？",
                "目標や計画を一緒に立てようと提案しますか？",
                "困難なときも落ち着いて状況を整理できますか？",
                "リードしながらも相手の意見に耳を傾けますか？",
                "責任感の重さでプレッシャーを感じることはありますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "기념일 이벤트 창의력 테스트",
            "en": "Anniversary Event Creativity Test",
            "ja": "記念日イベント創造力テスト",
        },
        "questions": {
            "ko": [
                "기념일마다 특별한 이벤트를 기획하고 싶나요?",
                "작은 날에도 편지나 선물을 준비하는 편인가요?",
                "서프라이즈를 위해 비밀 준비를 즐기나요?",
                "상대의 취향을 반영한 선물을 고르는 것이 즐겁나요?",
                "기념일 사진이나 영상 기록을 챙기나요?",
                "특별한 데이트 코스를 직접 만들어본 적이 있나요?",
                "기념일이 다가오기 전에 미리 아이디어 노트를 적어두나요?",
                "기념일 실패 경험이 있다면 바로 보완책을 생각하나요?",
            ],
            "en": [
                "Do you want to plan something special for every anniversary?",
                "Do you prepare letters or gifts even for small milestones?",
                "Do you enjoy secretly preparing surprises?",
                "Do you like picking gifts tailored to your partner’s taste?",
                "Do you make sure to capture anniversary photos or videos?",
                "Have you ever created a custom anniversary date course?",
                "Do you jot down ideas ahead of upcoming anniversaries?",
                "If an anniversary plan fails, do you think of improvements right away?",
            ],
            "ja": [
                "記念日のたびにスペシャルなイベントを企画したいですか？",
                "小さな記念日でも手紙やプレゼントを用意しますか？",
                "サプライズのためにこっそり準備するのが好きですか？",
                "相手の好みに合わせた贈り物を選ぶのが楽しいですか？",
                "記念日の写真や動画をしっかり残しますか？",
                "オリジナルの記念日デートコースを作ったことがありますか？",
                "記念日が近づくとアイデアメモを取っておきますか？",
                "もし記念日プランが失敗したらすぐ改善策を考えますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "커플 여행 케미 테스트",
            "en": "Couple Travel Chemistry Test",
            "ja": "カップルトラベルケミーテスト",
        },
        "questions": {
            "ko": [
                "여행지 선택에서 서로 취향을 조율할 수 있나요?",
                "여행 중 예산을 함께 관리하는 것이 편한가요?",
                "예상치 못한 일정 변경에도 유연하게 대처하나요?",
                "여행 중 간단한 역할 분담을 제안하나요?",
                "사진이나 기록을 남기는 것을 중요하게 생각하나요?",
                "휴식과 액티비티의 균형을 맞출 수 있나요?",
                "여행 중 갈등이 생기면 바로 풀려고 하나요?",
                "여행 후 함께 후기나 추억을 정리하나요?",
            ],
            "en": [
                "Can you coordinate travel destinations to fit both tastes?",
                "Do you feel comfortable managing the budget together while traveling?",
                "Do you handle unexpected schedule changes flexibly?",
                "Do you suggest sharing simple roles during the trip?",
                "Is documenting the trip through photos or notes important to you?",
                "Can you balance rest time and activities?",
                "Do you try to resolve conflicts immediately while traveling?",
                "Do you recap memories together after returning?",
            ],
            "ja": [
                "旅行先の選択でお互いの好みを調整できますか？",
                "旅行中の予算管理を一緒にするのは平気ですか？",
                "予定外の変更にも柔軟に対応しますか？",
                "旅行中、簡単な役割分担を提案しますか？",
                "写真やメモで旅行を記録するのを大事にしますか？",
                "休息とアクティビティのバランスを取れますか？",
                "旅行中に衝突が起きたらすぐに解決しようとしますか？",
                "帰ってから一緒に振り返りや思い出整理をしますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 재정 감각 테스트",
            "en": "Couple Finance Sense Test",
            "ja": "恋愛ファイナンス感覚テスト",
        },
        "questions": {
            "ko": [
                "데이트 비용 분담에 대해 솔직히 이야기하나요?",
                "서로의 소비 습관을 알고 조율하려 하나요?",
                "공동 목표를 위해 저축 계획을 세워본 적이 있나요?",
                "큰 지출 전에는 미리 상의하는 편인가요?",
                "상대의 경제 상황을 존중하고 배려하나요?",
                "가성비 좋은 데이트 아이디어를 자주 찾나요?",
                "서로의 재무 목표를 공유해본 적이 있나요?",
                "돈 때문에 생긴 갈등을 차분히 해결할 자신이 있나요?",
            ],
            "en": [
                "Do you talk honestly about splitting date expenses?",
                "Do you try to understand and align each other’s spending habits?",
                "Have you ever created a savings plan for a shared goal?",
                "Do you discuss big purchases in advance?",
                "Do you respect and consider your partner’s financial situation?",
                "Do you often come up with budget-friendly date ideas?",
                "Have you shared your financial goals with each other?",
                "Can you calmly resolve conflicts caused by money?",
            ],
            "ja": [
                "デート代の分担について率直に話しますか？",
                "互いの消費習慣を理解し調整しようとしますか？",
                "共通の目標のために貯蓄計画を立てたことがありますか？",
                "大きな支出の前には事前に相談しますか？",
                "相手の経済状況を尊重し配慮しますか？",
                "コスパの良いデートアイデアをよく探しますか？",
                "お互いの資金計画や目標を共有したことがありますか？",
                "お金が原因の衝突を落ち着いて解決できる自信がありますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "커플 취미 공유도 테스트",
            "en": "Shared Hobby Compatibility Test",
            "ja": "カップル趣味共有度テスト",
        },
        "questions": {
            "ko": [
                "연인의 취미를 함께 경험해보고 싶나요?",
                "새로운 취미를 추천받으면 시도하는 편인가요?",
                "취미 활동을 일정으로 정해 함께 즐기고 싶나요?",
                "각자의 취미 시간을 존중하면서도 연결점을 찾나요?",
                "함께 배울 수 있는 클래스나 워크숍을 찾아보나요?",
                "취미 활동 중에도 서로의 피드백을 나누나요?",
                "취미가 맞지 않아도 열린 마음으로 응원하나요?",
                "장기적으로 함께할 취미를 찾고 싶나요?",
            ],
            "en": [
                "Do you want to experience your partner’s hobbies together?",
                "Do you try new hobbies when your partner recommends them?",
                "Do you like scheduling hobby time to enjoy together?",
                "Do you respect solo hobby time while still finding common ground?",
                "Do you look into classes or workshops you can learn together?",
                "Do you exchange feedback while doing shared hobbies?",
                "If the hobby doesn’t match, do you still cheer each other on?",
                "Do you want to find a long-term hobby to enjoy as a couple?",
            ],
            "ja": [
                "恋人の趣味を一緒に体験してみたいですか？",
                "薦められた新しい趣味は試してみるほうですか？",
                "趣味の時間をスケジュールに入れて一緒に楽しみたいですか？",
                "それぞれの趣味時間を尊重しつつ共通点を探しますか？",
                "一緒に学べるクラスやワークショップを探しますか？",
                "趣味の活動中に感想やフィードバックを伝え合いますか？",
                "趣味が合わなくてもオープンに応援しますか？",
                "長く続けられる共通の趣味を見つけたいですか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 리프레시 루틴 테스트",
            "en": "Relationship Refresh Routine Test",
            "ja": "恋愛リフレッシュルーティンテスト",
        },
        "questions": {
            "ko": [
                "주기적으로 둘만의 시간을 재정비하나요?",
                "데이트 장소나 콘셉트를 자주 바꾸나요?",
                "함께 새로운 활동을 시도하는 것을 즐기나요?",
                "바쁜 시기에도 연락 루틴을 유지하려고 하나요?",
                "감사 인사나 칭찬을 꾸준히 나누나요?",
                "관계 점검 대화를 정기적으로 하나요?",
                "서로의 휴식 시간을 존중해주는 편인가요?",
                "권태기가 올 때 대비한 나만의 방법이 있나요?",
            ],
            "en": [
                "Do you regularly reset and prioritize couple time?",
                "Do you change date spots or concepts often?",
                "Do you enjoy trying new activities together?",
                "Do you keep a consistent messaging routine even when busy?",
                "Do you make a habit of sharing gratitude or compliments?",
                "Do you schedule check-in conversations about the relationship?",
                "Do you respect each other’s downtime?",
                "Do you have your own way to handle a slump in the relationship?",
            ],
            "ja": [
                "定期的に2人だけの時間を整えますか？",
                "デート場所やコンセプトをよく変えますか？",
                "一緒に新しいアクティビティを試すのが好きですか？",
                "忙しくても連絡のルーティンを保とうとしますか？",
                "感謝やほめ言葉を習慣的に伝えますか？",
                "関係について定期的に話し合いますか？",
                "お互いの休息時間を尊重しますか？",
                "倦怠期に備えた自分なりの方法がありますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 서프라이즈 선호도 테스트",
            "en": "Surprise Romance Preference Test",
            "ja": "恋愛サプライズ好みテスト",
        },
        "questions": {
            "ko": [
                "갑작스러운 이벤트를 받으면 기쁘게 반응하나요?",
                "상대를 놀라게 할 아이디어를 자주 떠올리나요?",
                "서프라이즈를 위해 작은 거짓말을 감수하나요?",
                "상대의 스케줄을 파악해 깜짝 만남을 준비하나요?",
                "선물이나 편지를 몰래 숨겨두는 편인가요?",
                "서프라이즈 실패를 해도 금방 웃어넘길 수 있나요?",
                "상대가 원하는 힌트를 눈치채는 편인가요?",
                "서프라이즈 뒤 마음을 충분히 표현하나요?",
            ],
            "en": [
                "Do you react happily to unexpected surprises?",
                "Do you often think of ideas to surprise your partner?",
                "Would you tell a small lie to pull off a surprise?",
                "Do you check your partner’s schedule to set up surprise meetings?",
                "Do you hide gifts or letters in secret spots?",
                "If a surprise fails, can you laugh it off quickly?",
                "Are you good at noticing hints about what your partner wants?",
                "Do you express your feelings fully after the surprise?",
            ],
            "ja": [
                "突然のイベントを受けると嬉しく反応しますか？",
                "相手を驚かせるアイデアをよく思いつきますか？",
                "サプライズのためなら小さな嘘も受け入れますか？",
                "相手のスケジュールを把握してサプライズを準備しますか？",
                "プレゼントや手紙をこっそり隠すほうですか？",
                "サプライズに失敗してもすぐ笑って流せますか？",
                "相手が望むヒントに気づくタイプですか？",
                "サプライズのあと、気持ちを十分に伝えますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 질투 민감도 테스트",
            "en": "Jealousy Sensitivity Test",
            "ja": "恋愛嫉妬感受性テスト",
        },
        "questions": {
            "ko": [
                "연인이 이성 친구와 자주 만나면 신경이 쓰이나요?",
                "연인이 휴대폰을 자주 숨기면 바로 물어보나요?",
                "질투심이 들 때 솔직히 이야기하나요?",
                "상대의 SNS 행동을 자주 체크하나요?",
                "연인이 칭찬받을 때 기쁜 마음이 더 크나요?",
                "질투를 느껴도 감정을 조절할 자신이 있나요?",
                "질투를 통해 서로의 마음을 다시 확인하고 싶나요?",
                "질투로 갈등이 생기면 빠르게 회복하나요?",
            ],
            "en": [
                "Do you get bothered if your partner meets an opposite-sex friend often?",
                "If your partner hides their phone, do you ask about it right away?",
                "Do you talk honestly when you feel jealous?",
                "Do you check your partner’s social media frequently?",
                "Are you mostly happy when your partner gets complimented?",
                "Can you control your emotions even when jealousy rises?",
                "Do you see jealousy as a chance to reconnect?",
                "Do you recover quickly after jealousy causes conflict?",
            ],
            "ja": [
                "恋人が異性の友達とよく会うと気になりますか？",
                "恋人がスマホを隠すとすぐ理由を聞きますか？",
                "嫉妬を感じたとき、正直に伝えますか？",
                "相手のSNS活動を頻繁にチェックしますか？",
                "恋人が褒められると自分も嬉しい気持ちが大きいですか？",
                "嫉妬を感じても感情をコントロールできますか？",
                "嫉妬を通じてお互いの気持ちを再確認したいですか？",
                "嫉妬が原因の衝突からすぐに回復しますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 대화 습관 테스트",
            "en": "Couple Conversation Habits Test",
            "ja": "恋人との会話習慣テスト",
        },
        "questions": {
            "ko": [
                "하루 있었던 일을 서로 자세히 이야기하나요?",
                "상대가 말할 때 눈을 맞추고 경청하나요?",
                "대화 중 상대의 감정을 읽으려고 하나요?",
                "미래 계획이나 고민을 자주 공유하나요?",
                "대화가 막히면 다른 주제를 자연스럽게 제시하나요?",
                "문제가 생기면 대화 시간을 따로 마련하나요?",
                "농담과 진지한 이야기를 잘 구분해서 전달하나요?",
                "좋은 소식을 들으면 먼저 함께 나누고 싶나요?",
            ],
            "en": [
                "Do you talk in detail about your day to each other?",
                "Do you maintain eye contact and listen actively?",
                "Do you try to read your partner’s emotions during conversations?",
                "Do you frequently share future plans or concerns?",
                "If the conversation stalls, do you introduce new topics smoothly?",
                "Do you set aside time to talk when issues arise?",
                "Can you balance jokes and serious topics appropriately?",
                "When you hear good news, do you want to share it with your partner first?",
            ],
            "ja": [
                "一日の出来事をお互い詳しく話しますか？",
                "相手が話すとき、目を見てしっかり聞きますか？",
                "会話中に相手の感情を読み取ろうとしますか？",
                "将来の計画や悩みをよく共有しますか？",
                "会話が途切れたら別の話題を自然に出しますか？",
                "問題が起きたら対話の時間を別に設けますか？",
                "冗談と真剣な話をうまく使い分けて伝えますか？",
                "良い知らせを聞くと真っ先に共有したいですか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "미래 계획 공유력 테스트",
            "en": "Future Vision Sharing Test",
            "ja": "未来プラン共有力テスト",
        },
        "questions": {
            "ko": [
                "5년 후 함께하고 싶은 모습에 대해 이야기하나요?",
                "서로의 커리어 계획을 상세히 공유하나요?",
                "살고 싶은 도시나 라이프스타일을 이야기해본 적이 있나요?",
                "가족 계획에 대한 생각을 털어놓을 준비가 되었나요?",
                "함께 이루고 싶은 버킷리스트를 작성하나요?",
                "서로의 가치관 차이를 발견하면 대화를 이어가나요?",
                "장기 목표를 위해 역할을 나누려 하나요?",
                "미래를 상상하면 설렘보다 현실적인 걱정을 먼저 하나요?",
            ],
            "en": [
                "Do you talk about how you want to be together in five years?",
                "Do you share detailed plans about your careers?",
                "Have you discussed cities or lifestyles you want to try?",
                "Are you ready to open up about family plans?",
                "Do you create a bucket list of things to achieve together?",
                "When you notice value differences, do you keep the conversation going?",
                "Do you try to divide roles for long-term goals?",
                "When imagining the future, do practical worries come before excitement?",
            ],
            "ja": [
                "5年後一緒にありたい姿について話しますか？",
                "お互いのキャリア計画を詳しく共有しますか？",
                "住んでみたい都市やライフスタイルを話したことがありますか？",
                "家族計画について語り合う準備はできていますか？",
                "一緒に叶えたいバケットリストを作りますか？",
                "価値観の違いに気づいたら会話を続けますか？",
                "長期目標のために役割分担を考えますか？",
                "未来を想像するとき、ワクワクより現実的な心配が先に来ますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 자기 확신도 테스트",
            "en": "Relationship Self-Confidence Test",
            "ja": "恋愛セルフコンフィデンステスト",
        },
        "questions": {
            "ko": [
                "연애에서 자신의 매력을 잘 알고 있다고 느끼나요?",
                "상대의 칭찬을 자연스럽게 받아들이나요?",
                "갈등이 생겨도 관계를 지킬 수 있다는 자신감이 있나요?",
                "함께 있어도 나만의 시간을 잘 챙기나요?",
                "상대의 피드백을 긍정적으로 받아들이나요?",
                "자신의 감정 상태를 잘 설명할 수 있나요?",
                "소중한 사람을 위해 변화를 시도할 용기가 있나요?",
                "관계가 흔들려도 스스로를 탓하지 않나요?",
            ],
            "en": [
                "Do you feel aware of your charm in relationships?",
                "Do you accept compliments from your partner naturally?",
                "Are you confident you can protect the relationship during conflicts?",
                "Do you maintain personal time even when you’re together?",
                "Do you take your partner’s feedback in a positive way?",
                "Can you explain your emotional state clearly?",
                "Are you brave enough to try changes for someone important?",
                "Even when things shake, do you avoid blaming yourself entirely?",
            ],
            "ja": [
                "恋愛で自分の魅力をよく理解していると感じますか？",
                "相手の褒め言葉を自然に受け入れますか？",
                "衝突があっても関係を守れる自信がありますか？",
                "一緒にいても自分の時間を大切にしますか？",
                "相手のフィードバックを前向きに受け止めますか？",
                "自分の感情状態をわかりやすく説明できますか？",
                "大切な人のために変化を試す勇気がありますか？",
                "関係が揺らいでも自分を責めすぎませんか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 버킷리스트 타입 테스트",
            "en": "Couple Bucket List Type Test",
            "ja": "恋愛バケットリストタイプテスト",
        },
        "questions": {
            "ko": [
                "연애 버킷리스트를 직접 작성해본 적이 있나요?",
                "새로운 장소나 경험을 함께 시도하고 싶나요?",
                "커플 취미 리스트를 만들어 공유하나요?",
                "연애 버킷리스트를 이룰 때 기록을 남기나요?",
                "버킷리스트 달성을 위해 역할을 나누나요?",
                "버킷리스트가 바뀌면 주기적으로 업데이트하나요?",
                "꿈을 이루기 위해 소소한 일정을 세우나요?",
                "리스트를 보며 서로에게 동기부여를 주나요?",
            ],
            "en": [
                "Have you ever created a couple’s bucket list?",
                "Do you want to try new places or experiences together?",
                "Do you make and share a list of hobbies to try as a couple?",
                "Do you document achievements when you check off list items?",
                "Do you divide roles to achieve certain bucket list goals?",
                "Do you update the list regularly if goals change?",
                "Do you set mini-schedules to make the dreams happen?",
                "Does the list motivate both of you when you review it?",
            ],
            "ja": [
                "恋愛バケットリストを書いたことがありますか？",
                "一緒に新しい場所や体験を試したいですか？",
                "カップルでやりたい趣味のリストを作り共有しますか？",
                "リストを達成するとき記録を残しますか？",
                "バケットリストの達成のために役割分担をしますか？",
                "目標が変わるとリストを定期的に更新しますか？",
                "夢を叶えるための小さなスケジュールを立てますか？",
                "リストを見ながらお互い励まし合いますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "연애 회복 탄력성 테스트",
            "en": "Love Resilience Test",
            "ja": "恋愛レジリエンステスト",
        },
        "questions": {
            "ko": [
                "갈등 후 감정을 빠르게 정리하는 편인가요?",
                "힘든 일이 있어도 관계를 지키고 싶나요?",
                "상대와 함께 성장할 방법을 계속 찾나요?",
                "실수를 인정하고 사과하는 데 주저하지 않나요?",
                "위기 상황에서도 상대의 장점을 떠올리나요?",
                "감정이 힘들 때 친구나 상담을 활용하나요?",
                "관계 회복을 위해 구체적 다짐을 적어보나요?",
                "과거 경험을 교훈으로 삼아 긍정적으로 나아가나요?",
            ],
            "en": [
                "Do you recover emotionally quickly after conflict?",
                "Do you still want to protect the relationship when things get tough?",
                "Do you keep looking for ways to grow together?",
                "Are you willing to admit mistakes and apologize?",
                "Even in tough moments, do you recall your partner’s strengths?",
                "Do you turn to friends or counseling when emotions are heavy?",
                "Do you write concrete promises for repairing the relationship?",
                "Do you learn from past experiences and move forward positively?",
            ],
            "ja": [
                "衝突のあと感情を早く整理するほうですか？",
                "大変なことがあっても関係を守りたいですか？",
                "一緒に成長する方法を探し続けますか？",
                "失敗を認めて謝ることに躊躇しませんか？",
                "危機のときでも相手の長所を思い出しますか？",
                "つらいとき友人や相談を活用しますか？",
                "関係修復のための具体的な約束を書きますか？",
                "過去の経験を教訓にして前向きに進みますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "커플 SNS 운영 감각 테스트",
            "en": "Couple SNS Style Test",
            "ja": "カップルSNS運営感覚テスト",
        },
        "questions": {
            "ko": [
                "커플 사진이나 스토리를 자주 공유하나요?",
                "연인의 SNS 게시물을 빠르게 확인하나요?",
                "SNS 공개 범위를 함께 상의하나요?",
                "커플 해시태그나 템플릿을 즐겨 사용하나요?",
                "사생활 노출에 대해 서로 기준을 맞췄나요?",
                "부정적인 댓글이나 시선을 신경 쓰나요?",
                "SNS로 기념일 콘텐츠를 만드는 것을 좋아하나요?",
                "SNS 휴식이 필요할 때 솔직히 이야기하나요?",
            ],
            "en": [
                "Do you often share couple photos or stories online?",
                "Do you check your partner’s posts quickly?",
                "Do you discuss privacy levels for social media?",
                "Do you enjoy using couple hashtags or templates?",
                "Have you aligned on what is okay to reveal online?",
                "Do negative comments or looks bother you?",
                "Do you enjoy creating anniversary content on SNS?",
                "Do you speak up when you need a break from social media?",
            ],
            "ja": [
                "カップル写真やストーリーをよく共有しますか？",
                "恋人のSNS投稿をすぐ確認しますか？",
                "SNSの公開範囲を一緒に相談しますか？",
                "カップルハッシュタグやテンプレを楽しんで使いますか？",
                "プライバシーの基準をすり合わせていますか？",
                "否定的なコメントや視線が気になりますか？",
                "SNSで記念日コンテンツを作るのが好きですか？",
                "SNS休憩が必要なとき正直に伝えますか？",
            ],
        },
    },
    {
        "titles": {
            "ko": "동거 준비 성향 테스트",
            "en": "Cohabitation Readiness Test",
            "ja": "同棲準備度テスト",
        },
        "questions": {
            "ko": [
                "생활 패턴 차이를 미리 이야기해본 적이 있나요?",
                "집안일 분담 계획을 함께 세우고 싶나요?",
                "금전 관리 방식을 합의할 준비가 되었나요?",
                "각자의 개인 공간을 어떻게 마련할지 생각해봤나요?",
                "생활 규칙이나 매너에 대해 대화가 가능한가요?",
                "가구나 인테리어를 함께 고르는 것을 즐기나요?",
                "갈등이 생겼을 때 해소 루틴을 갖고 있나요?",
                "동거 후 미래 계획에 대한 기대감이 있나요?",
            ],
            "en": [
                "Have you discussed differences in daily routines beforehand?",
                "Do you want to plan household chore sharing together?",
                "Are you ready to agree on a money management style?",
                "Have you thought about how to create personal space for each other?",
                "Can you have open talks about house rules and manners?",
                "Do you enjoy choosing furniture or interior design together?",
                "Do you have a routine to resolve conflicts at home?",
                "Do you feel excited about plans after moving in together?",
            ],
            "ja": [
                "生活リズムの違いについて話し合ったことがありますか？",
                "家事の分担計画を一緒に立てたいですか？",
                "お金の管理方法に合意する準備がありますか？",
                "お互いの個人スペースをどう作るか考えましたか？",
                "生活ルールやマナーについて話し合えますか？",
                "家具やインテリアを一緒に選ぶのが好きですか？",
                "家で衝突が起きたときの解決ルーティンがありますか？",
                "同棲後の未来計画にワクワクしていますか？",
            ],
        },
    },
]

NEW_TESTS = []
for index, test in enumerate(NEW_TESTS_RAW, start=100):
    updated = dict(test)
    updated["id"] = str(index)
    NEW_TESTS.append(updated)


def update_tests_json():
    path = ROOT / "web" / "data" / "tests.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    existing_ids = {test["id"] for test in data["tests"]}
    for test in NEW_TESTS:
        if test["id"] in existing_ids:
            raise ValueError(f"Test {test['id']} already exists in tests.json")
        data["tests"].append({
            "id": test["id"],
            "title": test["titles"]["ko"],
            "questions": test["questions"]["ko"],
            "results": [
                {"key": key, "title": RESULTS_TEMPLATE["ko"][key]["title"], "desc": RESULTS_TEMPLATE["ko"][key]["summary"]}
                for key in ("A", "B", "C")
            ],
        })
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_public_tests(lang: str):
    path = ROOT / "web" / "public" / "data" / f"tests-{lang}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    for test in NEW_TESTS:
        if test["id"] in data["tests"]:
            raise ValueError(f"Test {test['id']} already exists in tests-{lang}.json")
        entry = {
            "title": test["titles"][lang],
            "questions": test["questions"][lang],
            "results": deepcopy(RESULTS_TEMPLATE[lang]),
        }
        data["tests"][test["id"]] = entry
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_locale(lang: str):
    path = ROOT / "web" / "locales" / f"{lang}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    tests_section = data.setdefault("tests", {})
    for test in NEW_TESTS:
        if test["id"] in tests_section:
            raise ValueError(f"Test {test['id']} already exists in {lang}.json")
        tests_section[test["id"]] = {
            "title": test["titles"][lang],
            "questions": test["questions"][lang],
            "results": deepcopy(RESULTS_TEMPLATE[lang]),
        }
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    update_tests_json()
    for lang in ("ko", "en", "ja"):
        update_public_tests(lang)
        update_locale(lang)


if __name__ == "__main__":
    main()
