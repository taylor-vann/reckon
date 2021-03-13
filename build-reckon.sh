#!/bin/bash

deno bundle --config ./tsconfig.json ./src/reckon.ts ./esmodules/reckon.js 
deno bundle --config ./tsconfig.json ./src/reckon.test.ts ./esmodules/reckon.test.js 
