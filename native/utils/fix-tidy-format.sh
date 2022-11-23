if [ $# -ne 0 ]; then
    commit=$1 # can also pass ranges: HEAD~3..HEAD
else
    commit=HEAD
fi
changes=`git diff-tree --no-commit-id --name-only -r $commit`
filtered=`node .github/workflows/filter_by_cdb.js $changes`
if [[ "$filtered-xxx" == "-xxx" ]]; then
    echo "No source to be fixed"
else
    clang-tidy --format-style=file --fix $2 $filtered
    clang-format -i $filtered
fi
