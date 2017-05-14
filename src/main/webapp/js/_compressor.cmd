@echo off
set CUR=%~dp0
set COMP=c:\applications\closure-compiler-v20170423.jar
set COMP_OPT=--compilation_level SIMPLE --warning_level DEFAULT --language_out=ES5
set LIBS=lib\*.js lib\car\*.js

cd %CUR%
type %LIBS% index.js > index-all.js 2> nul
java -jar %COMP% %COMP_OPT% --js index-all.js --js_output_file index-min.js

type %LIBS% play.js > play-all.js 2> nul
java -jar %COMP% %COMP_OPT% --js play-all.js --js_output_file play-min.js

:type %LIBS% edit.js > edit-all.js 2> nul
:java -jar %COMP% %COMP_OPT% --js edit-all.js --js_output_file edit-min.js

del *-all.js
pause
