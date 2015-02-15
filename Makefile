SRC = $(wildcard src/**/*.js)
LIB = $(SRC:src/main/%.js=lib/%.js)
SPEC = $(SRC:src/spec/%.js=spec/%.js)
6TO5 = ./node_modules/.bin/6to5
JASMINE = ./node_modules/.bin/jasmine

all: lib spec test

lib: $(LIB)
lib/%.js: src/main/%.js
	mkdir -p $(@D)
	$(6TO5) $< -o $@

spec: $(SPEC)
spec/%.js: src/spec/%.js
	$(6TO5) $< -o $@

test:
	$(JASMINE)

PHONY: all test
