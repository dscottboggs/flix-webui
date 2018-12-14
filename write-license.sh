#!/usr/bin/env zsh

set -euxo pipefail

function prepend_agpl() {
  file=$1

}

cd src/
for js_file in *.js; do
  tmp_file=".$js_file.tmp"
  cat $js_file > $tmp_file
  echo '// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification
' > $js_file
  cat $tmp_file >> $js_file
  rm $tmp_file
done
cd -
