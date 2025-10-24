#!/usr/bin/env python3
"""
Helper script that uses Anthropic to translate the base Korean test catalog
into other languages. Outputs JSON files that mirror the input structure.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from time import sleep

import anthropic


DEFAULT_TARGETS = {
    "en": "English",
    "ja": "Japanese",
}


def resolve_path(path_str: str, base_dir: Path) -> Path:
    """Return an absolute Path from a user provided string."""
    candidate = Path(path_str)
    return candidate if candidate.is_absolute() else (base_dir / candidate)


def create_client() -> anthropic.Anthropic:
    """Instantiate the Anthropic client or exit with a helpful message."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ANTHROPIC_API_KEY is not set. Export it before running this script.")
    return anthropic.Anthropic(api_key=api_key)


def translate_batch(client: anthropic.Anthropic, texts, source_lang: str, target_lang: str, batch_name: str = ""):
    """Translate a batch of texts while preserving the JSON structure."""
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
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = message.content[0].text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("\n```", 1)[0]

        return json.loads(response_text)
    except Exception as exc:
        print(f"Error translating {batch_name}: {exc}")
        return None


def translate_test(client, test_data, source_lang: str, target_label: str, test_id: str, delay: float):
    """Translate a single test definition and honour rate limiting."""
    print(f"Translating test {test_id} -> {target_label}...")
    to_translate = {
        "title": test_data["title"],
        "questions": test_data["questions"],
        "results": test_data["results"],
    }
    translated = translate_batch(client, to_translate, source_lang, target_label, f"test {test_id}")
    sleep(delay)
    return translated


def save_translations(data, output_path: Path):
    """Persist translated data as pretty-printed JSON."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump({"tests": data}, handle, ensure_ascii=False, indent=2)


def main():
    repo_root = Path(__file__).resolve().parent

    parser = argparse.ArgumentParser(description="Translate tests_korean.json into other locales.")
    parser.add_argument("--input", default="tests_korean.json", help="Relative or absolute path to the source JSON.")
    parser.add_argument(
        "--languages",
        nargs="+",
        choices=sorted(DEFAULT_TARGETS.keys()),
        default=list(DEFAULT_TARGETS.keys()),
        help="Target language codes to generate.",
    )
    parser.add_argument("--source-label", default="Korean", help="Human readable source language name.")
    parser.add_argument("--delay", type=float, default=0.5, help="Seconds to sleep between Claude calls.")
    parser.add_argument(
        "--output-dir",
        default=".",
        help="Directory to contain generated files (defaults to the repo root).",
    )
    args = parser.parse_args()

    client = create_client()
    source_path = resolve_path(args.input, repo_root)
    output_dir = resolve_path(args.output_dir, repo_root)

    if not source_path.exists():
        sys.exit(f"Source file not found: {source_path}")

    with source_path.open("r", encoding="utf-8") as handle:
        korean_tests = json.load(handle)["tests"]

    totals = {}
    print("=" * 60)
    print(f"Translating from {args.source_label} - {len(korean_tests)} tests detected")

    for lang_code in args.languages:
        label = DEFAULT_TARGETS.get(lang_code, lang_code)
        print("\n" + "=" * 60)
        print(f"Target: {label}")
        print("=" * 60)

        translated_tests = {}
        for test_id in sorted(korean_tests.keys(), key=int):
            translated = translate_test(client, korean_tests[test_id], args.source_label, label, test_id, args.delay)
            if translated:
                translated_tests[test_id] = translated
            else:
                print(f"Skipping test {test_id} in {label} due to translation failure.")

        output_file = output_dir / f"tests_{lang_code}.json"
        save_translations(translated_tests, output_file)
        totals[lang_code] = len(translated_tests)
        print(f"\n{label}: generated {len(translated_tests)} translations -> {output_file}")

    print("\n" + "=" * 60)
    print("Translation complete")
    for lang_code, count in totals.items():
        label = DEFAULT_TARGETS.get(lang_code, lang_code)
        print(f"{label}: {count} tests")


if __name__ == "__main__":
    main()
