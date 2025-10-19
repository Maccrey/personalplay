#!/usr/bin/env python3
import json

# Load Korean tests
with open('/Users/maccrey/Development/myself-test/tests_korean.json', 'r', encoding='utf-8') as f:
    korean_data = json.load(f)

korean_tests = korean_data['tests']

# Print test IDs and titles for batch processing
print("Total tests:", len(korean_tests))
print("\nTest IDs and titles:")
print("=" * 80)

for test_id in sorted(korean_tests.keys(), key=int):
    test = korean_tests[test_id]
    print(f"Test {test_id}: {test['title']}")
    print(f"  Questions: {len(test['questions'])}")
    print(f"  Results: {len(test['results'])}")
    print()

# Create batches of 5 tests for easier processing
batch_size = 5
test_ids = sorted(korean_tests.keys(), key=int)

print("\n" + "=" * 80)
print("BATCH BREAKDOWN (for translation)")
print("=" * 80)

for i in range(0, len(test_ids), batch_size):
    batch_ids = test_ids[i:i+batch_size]
    print(f"\nBatch {i//batch_size + 1}: Tests {batch_ids[0]}-{batch_ids[-1]}")

    # Save batch to separate file
    batch_tests = {tid: korean_tests[tid] for tid in batch_ids}
    batch_filename = f'/Users/maccrey/Development/myself-test/batch_{i//batch_size + 1:02d}.json'

    with open(batch_filename, 'w', encoding='utf-8') as f:
        json.dump({"tests": batch_tests}, f, ensure_ascii=False, indent=2)

    print(f"  Saved to: {batch_filename}")

print(f"\nCreated {(len(test_ids) + batch_size - 1) // batch_size} batch files")
