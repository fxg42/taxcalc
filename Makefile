SRC = $(wildcard src/**/*.js)
LIB = $(SRC:src/main/%.js=lib/%.js)
SPEC = $(SRC:src/spec/%.js=spec/%.js)

all: lib spec test

lib: $(LIB)
lib/%.js: src/main/%.js
	mkdir -p $(@D)
	./node_modules/.bin/6to5 $< -o $@

spec: $(SPEC)
spec/%.js: src/spec/%.js
	mkdir -p $(@D)
	./node_modules/.bin/6to5 $< -o $@

test:
	./node_modules/.bin/jasmine

PHONY: all test
