#!/usr/bin/env bash
from="1 May, 2018"
to="15 Dec, 2018"
users=$(git shortlog -sn --no-merges  | awk '{printf "%s %s\n", $2, $3}')
IFS=$'\n'
echo -e "User name;Files changed;Lines added;Lines deleted;Total lines (delta);Add./Del. ratio (1:n);Commit count"

for userName in $users
do
     result=$(git log --author="$userName" --no-merges --shortstat  | grep -E "fil(e|es) changed" | awk '{files+=$1; inserted+=$4; deleted+=$6; delta+=$4-$6; ratio=deleted/inserted} END {printf "%s;%s;%s;%s;%s", files, inserted, deleted, delta, ratio }' -)
     countCommits=$(git shortlog -sn --no-merges  --author="$userName" | awk '{print $1}')
     if [[ ${result} != ';;;;' ]]
     then
        echo -e "$userName;$result;$countCommits"
     fi
done
