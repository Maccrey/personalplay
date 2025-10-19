#!/bin/bash
# Extract batches for translation
TEST_FILE="tests_korean.json"

# Split into 12 batches of 5 tests each
for i in {1..12}; do
    start=$(( ($i - 1) * 5 + 1 ))
    end=$(( $i * 5 ))
    if [ $end -gt 59 ]; then
        end=59
    fi

    echo "Creating batch $i: tests $start-$end"

    # Use jq to extract test range
    jq --arg start "$start" --arg end "$end" '
        .tests |
        to_entries |
        map(select((.key | tonumber) >= ($start | tonumber) and (.key | tonumber) <= ($end | tonumber))) |
        from_entries |
        {tests: .}
    ' "$TEST_FILE" > "batch_$(printf %02d $i).json"
done

echo "Created 12 batch files"
ls -lh batch_*.json
