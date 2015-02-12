SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: lib test

lib: $(LIB)
lib/%.js: src/%.js
	mkdir -p $(@D)
	./node_modules/.bin/6to5 $< -o $@

test:
	./node_modules/.bin/jasmine

PHONY: all test
