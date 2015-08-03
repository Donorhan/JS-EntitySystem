../libs/closure-library/closure/bin/build/depswriter.py  --root_with_prefix="../src/ ../../../../src/" > ./deps.js

java -jar ../libs/closure-compiler.jar \
	--compilation_level SIMPLE_OPTIMIZATIONS \
	--language_in=ECMASCRIPT5_STRICT \
	--warning_level VERBOSE \
	--only_closure_dependencies\
	--summary_detail_level 3 \
	--process_closure_primitives true \
	--closure_entry_point="ES.World"\
    --js='../src/**.js' \
    --js='../libs/closure-library/**.js' \
    --js='!../libs/closure-library/**_test.js' \
    --js='!../libs/closure-library/**_test.js' \
	--js_output_file EntitySystem.js
