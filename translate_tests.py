#!/usr/bin/env python3
import json
import anthropic
import os
from time import sleep

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def translate_batch(texts, source_lang, target_lang, batch_name=""):
    """Translate a batch of texts"""
    texts_json = json.dumps(texts, ensure_ascii=False, indent=2)

    prompt = f"""Translate the following JSON structure from {source_lang} to {target_lang}.
Keep the JSON structure EXACTLY the same, only translate the text values.
For personality test content:
- Make titles engaging and culturally appropriate
- Keep questions clear and natural
- Ensure result descriptions are accurate and appealing
- Maintain the tone and style appropriate for {target_lang} speakers

JSON to translate:
{texts_json}

Return ONLY the translated JSON, no explanations."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("\n```", 1)[0]

        return json.loads(response_text)
    except Exception as e:
        print(f"Error translating {batch_name}: {e}")
        return None

def translate_test(test_data, source_lang, target_lang, test_id):
    """Translate a single test"""
    print(f"Translating test {test_id} to {target_lang}...")

    # Create structure to translate
    to_translate = {
        "title": test_data["title"],
        "questions": test_data["questions"],
        "results": test_data["results"]
    }

    translated = translate_batch(to_translate, source_lang, target_lang, f"test {test_id}")
    sleep(0.5)  # Rate limiting
    return translated

# Load Korean tests
with open('/Users/maccrey/Development/myself-test/tests_korean.json', 'r', encoding='utf-8') as f:
    korean_data = json.load(f)

korean_tests = korean_data['tests']

# Translate to English
print("=" * 60)
print("TRANSLATING TO ENGLISH")
print("=" * 60)
english_tests = {}

for test_id in sorted(korean_tests.keys(), key=int):
    translated = translate_test(korean_tests[test_id], "Korean", "English", test_id)
    if translated:
        english_tests[test_id] = translated
    else:
        print(f"WARNING: Failed to translate test {test_id} to English")

# Save English tests
with open('/Users/maccrey/Development/myself-test/tests_english.json', 'w', encoding='utf-8') as f:
    json.dump({"tests": english_tests}, f, ensure_ascii=False, indent=2)

print(f"\nEnglish: Successfully translated {len(english_tests)}/59 tests")

# Translate to Japanese
print("\n" + "=" * 60)
print("TRANSLATING TO JAPANESE")
print("=" * 60)
japanese_tests = {}

for test_id in sorted(korean_tests.keys(), key=int):
    translated = translate_test(korean_tests[test_id], "Korean", "Japanese", test_id)
    if translated:
        japanese_tests[test_id] = translated
    else:
        print(f"WARNING: Failed to translate test {test_id} to Japanese")

# Save Japanese tests
with open('/Users/maccrey/Development/myself-test/tests_japanese.json', 'w', encoding='utf-8') as f:
    json.dump({"tests": japanese_tests}, f, ensure_ascii=False, indent=2)

print(f"\nJapanese: Successfully translated {len(japanese_tests)}/59 tests")

print("\n" + "=" * 60)
print("TRANSLATION COMPLETE")
print("=" * 60)
print(f"Korean: 59 tests")
print(f"English: {len(english_tests)} tests")
print(f"Japanese: {len(japanese_tests)} tests")
