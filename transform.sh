#!/bin/bash

for i in ui/*.js
do
  echo -e "var jQuery = require('jquery');\n\n" | cat - $i | tee $i > /dev/null
done
