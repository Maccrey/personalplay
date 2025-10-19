#!/usr/bin/env python3
import json

# Read the tests.json file
with open('/Users/maccrey/Development/myself-test/web/data/tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract tests and build the structure
tests_structure = {}

for test in data['tests']:
    test_id = test['id']

    # Build results dictionary
    results = {}
    for result in test['results']:
        results[result['key']] = {
            'title': result['title'],
            'desc': result['desc']
        }

    # Build test structure
    tests_structure[test_id] = {
        'title': test['title'],
        'questions': test['questions'],
        'results': results
    }

# Save to a temporary file for verification
output = {'tests': tests_structure}
with open('/Users/maccrey/Development/myself-test/tests_korean.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Successfully extracted {len(tests_structure)} tests")
print(f"Test IDs: {sorted([int(x) for x in tests_structure.keys()])}")
