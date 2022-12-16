# jest-coverage-chart

Static site that shows Jest coverage changes over time.

Collected from JSON that been stitched together from multiple Jest invocations for a multi-module Nx repository: https://github.com/nrwl/nx-examples

Bash to take that repo from the start of Jan 2022 through to Dec 2022 collecting the coverage:

```
#!/usr/bin/env bash

mkdir -p coverage/sum
mkdir -p coverage/history

d="2022-01-15"
while [[ "$d" < "2022-12-31" ]]; do

  git checkout yarn.lock
  git checkout -f master
  git checkout -f `git rev-list -n 1 --before="$d" master`
  ddate=$(git log -1 --format=%cd --date=format:'%Y-%m-%d' | sed "s/:/-/g" | sed "s/+/-/g")
  echo "Date: $d $ddate"
  yarn install --prefer-offline

  find . -name "coverage-summary.json" -type f -delete
  npx nx run-many --target=test --skip-nx-cache --all --codeCoverage --coverageReporters="json-summary"

  rm coverage/sum/*

  for file in $(find coverage -name "coverage-summary.json"); do
      path=$(echo "$file" | sed "s#coverage/##" | sed "s#/coverage-summary.json##")
      path2=$(echo "$path" | sed "s#/#_#g")
      cat "$file" | jq ".total" | jq "{\"$path\": .}" > "coverage/sum/$path2.json"
      echo $path2
  done
  jq --slurp 'add' coverage/sum/*.json | jq "{\"$ddate\": .}" > "coverage/history/$ddate.json"

  d=$(date -I -d "$d + 30 day")
done

echo "finishing..."

jq --slurp 'add' coverage/history/*.json > "coverage_history.json"
```

Non-standard apt-installable deps: `jq`

Also, some hacks for now:

* Yarn rather than npm hard coded.
* Dates hard coded.
* Interval between times hard coded to 30 days.
* Nx (via npx) invocation of Jest hard coded.

