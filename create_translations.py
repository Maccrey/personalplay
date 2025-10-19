#!/usr/bin/env python3
"""
Manual translation creator for 59 tests
This script creates the translation data structures by processing batches
"""

import json

# English translations for all 59 tests
ENGLISH_TRANSLATIONS = {
    "1": {
        "title": "What's Your Dating Character?",
        "questions": [
            "Do you contact first for dates?",
            "Do you pay attention to gifts?",
            "Do you apologize first after fights?",
            "Do you always remember anniversaries?",
            "Do you often check your partner's SNS?",
            "Do you like physical affection?",
            "Do you plan date courses yourself?",
            "Are you curious about your partner's past?",
            "Do you get jealous often?",
            "Do you need personal time even while dating?",
            "Do you often say 'I love you' to your partner?",
            "Do you try to get close to your partner's friends?"
        ],
        "results": {
            "A": {
                "title": "Burning Dopamine Type",
                "desc": "Love is war and play! Passionate and proactive dating style. You express emotions richly and love creating romantic moments."
            },
            "B": {
                "title": "Calm Rational Type",
                "desc": "A cautious type where reason precedes emotion. You pursue stable and balanced relationships while respecting each other's personal space."
            }
        }
    },
    "2": {
        "title": "Friendship Style Test",
        "questions": [
            "Do you suggest gatherings first?",
            "Do you listen well to friends' concerns?",
            "Do you keep secrets well?",
            "Do you contact friends often?",
            "Do you rush to friends when they're struggling?",
            "Do you apologize to friends first?",
            "Do you always remember friends' birthdays?",
            "Do you make new friends easily?",
            "Do you travel with friends often?",
            "Do you mediate well between friends?",
            "Do you give honest advice to friends?",
            "Do you genuinely celebrate friends' successes?"
        ],
        "results": {
            "A": {
                "title": "Leader Type",
                "desc": "Type that leads gatherings. An energetic friend who takes care of friends well and leads the atmosphere."
            },
            "B": {
                "title": "Supporter Type",
                "desc": "Type that helps from behind. A reliable friend who quietly supports friends and becomes a strength when needed."
            }
        }
    },
    "3": {
        "title": "Workplace Personality Test",
        "questions": [
            "Do you plan work in advance?",
            "Do you share opinions in meetings?",
            "Do you work overtime well?",
            "Do you volunteer for new projects?",
            "Do you collaborate well with colleagues?",
            "Do you study work-related topics separately?",
            "Do you meet deadlines with time to spare?",
            "Do you ask supervisors questions often?",
            "Do you hang out with colleagues during lunch?",
            "Do you enjoy participating in company dinners?",
            "Do you suggest process improvements?",
            "Do you multitask well?"
        ],
        "results": {
            "A": {
                "title": "Proactive Type",
                "desc": "Type that moves proactively. You actively seek and handle tasks with leadership that drives the team forward."
            },
            "B": {
                "title": "Balanced Type",
                "desc": "Type that finds balance. A realist who values work-life harmony and focuses only as much as needed."
            }
        }
    },
    "4": {
        "title": "Leisure Preference Test",
        "questions": [
            "Do you like being alone?",
            "Do you enjoy activities?",
            "Do you prefer planned trips?",
            "Do you sometimes stay home all weekend?",
            "Do you start new hobbies often?",
            "Do you prefer hanging out with friends?",
            "Do you like spending time in nature?",
            "Do you enjoy cultural activities (exhibitions, performances)?",
            "Do you exercise regularly?",
            "Do you enjoy gaming or Netflix?",
            "Do you sleep in on weekends?",
            "Do you like exploring good restaurants?"
        ],
        "results": {
            "A": {
                "title": "Adventurer",
                "desc": "Type that enjoys new experiences. Active and energetic, always seeking new stimulation."
            },
            "B": {
                "title": "Healing Type",
                "desc": "Type that enjoys comfortable rest. A pacifist who cherishes quiet recharging time at home."
            }
        }
    },
    "5": {
        "title": "Meme Tendency Test",
        "questions": [
            "Do you share memes often?",
            "Do you quickly follow internet trends?",
            "Do you tease friends with memes?",
            "Do you always know the latest memes?",
            "Have you ever created memes yourself?",
            "Do you often post memes in group chats?",
            "Is it comfortable to communicate with memes?",
            "Do you follow meme accounts?",
            "Do you have a meme library?",
            "Do you check meme trends daily?",
            "Do you understand all memes friends send?",
            "Can you instantly find the right meme for situations?"
        ],
        "results": {
            "A": {
                "title": "Meme Master",
                "desc": "A digital native who solves all situations with memes! You catch and utilize the latest trends faster than anyone."
            },
            "B": {
                "title": "Meme Beginner",
                "desc": "Occasionally funny. A casual user who enjoys memes but doesn't dive deep into them."
            }
        }
    }
}

# Load Korean tests
with open('tests_korean.json', 'r', encoding='utf-8') as f:
    korean_data = json.load(f)

print("Loaded Korean tests:", len(korean_data['tests']))
print("Have English translations for:", len(ENGLISH_TRANSLATIONS))

# This script will be extended with all 59 translations
# For now, save what we have
with open('tests_english_partial.json', 'w', encoding='utf-8') as f:
    json.dump({"tests": ENGLISH_TRANSLATIONS}, f, ensure_ascii=False, indent=2)

print("\nSaved partial English translations")
print("Next: Complete all 59 test translations")
