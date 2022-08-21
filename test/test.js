/**
 * Externalise-Sourcemap Test Suite
 * Copyright (c) Maytham Alsudany 2022
 *
 * Credit: Uses test file from https://github.com/thlorenz/exorcist
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see \<http://www.gnu.org/licenses/\>.
 */

const externaliseSourcemap = require('..').default
const fs = require('fs')
const expect = require('chai').expect

const JS_WITH_SOURCE_MAP = fs.readFileSync('./test/samples/js-source-map.js').toString()
const JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP = JSON.parse(fs.readFileSync('./test/samples/js-source-map.js.map').toString())
const JS_WITH_SOURCE_MAP_EXPECTED_MODIFIED = fs.readFileSync('./test/samples/js-source-map-modified.js').toString()
const JS_WITH_SOURCE_MAP_EXPECTED_REMOVED = fs.readFileSync('./test/samples/js-source-map-removed.js').toString()
const JS_WITHOUT_SOURCE_MAP = fs.readFileSync('./test/samples/js-no-source-map.js').toString()

describe('externalise-sourcemap', function () {

    describe('when asked to return an object', function () {

        it('should extract sourcemap as object with default options', function () {

            const input = JS_WITH_SOURCE_MAP
            const expectedOutput = { sourcemap: JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP }
            const result = externaliseSourcemap(input)

            expect(result).to.deep.equal(expectedOutput)

        })
        it('should extract sourcemap as object', function () {

            const input = JS_WITH_SOURCE_MAP
            const expectedOutput = { sourcemap: JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: true,
                sourcemapObject: true,
            })

            expect(result).to.deep.equal(expectedOutput)

        })
        it('should return empty object when no sourcemap is found', function () {

            const input = JS_WITHOUT_SOURCE_MAP
            const expectedOutput = { sourcemap: {} }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: true,
                sourcemapObject: true,
            })

            expect(result).to.deep.equal(expectedOutput)

        })

    })
    describe('when asked to return a string', function () {

        it('should extract sourcemap as string', function () {

            const input = JS_WITH_SOURCE_MAP
            const expectedOutput = { sourcemap: JSON.stringify(JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP) }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: true,
                sourcemapObject: false,
            })

            expect(result).to.deep.equal(expectedOutput)

        })
        it('should return empty string when no sourcemap is found', function () {

            const input = JS_WITHOUT_SOURCE_MAP
            const expectedOutput = { sourcemap: '' }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: true,
                sourcemapObject: false,
            })
            expect(result).to.deep.equal(expectedOutput)

        })

    })
    describe('when asked to return modified code alongside sourcemap', function () {

        it('should replace sourcemap comment using given path', function () {

            const input = JS_WITH_SOURCE_MAP
            const expectedOutput = {
                sourcemap: JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP,
                code: JS_WITH_SOURCE_MAP_EXPECTED_MODIFIED,
            }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: false,
                sourcemapObject: true,
                path: 'maps/myScript.js.map',
            })

            expect(result).to.deep.equal(expectedOutput)

        })

        it('should remove sourcemap comment entirely if no path is given', function () {

            const input = JS_WITH_SOURCE_MAP
            const expectedOutput = {
                sourcemap: JS_WITH_SOURCE_MAP_EXPECTED_SOURCEMAP,
                code: JS_WITH_SOURCE_MAP_EXPECTED_REMOVED,
            }
            const result = externaliseSourcemap(input, {
                sourcemapOnly: false,
                sourcemapObject: true,
            })

            expect(result).to.deep.equal(expectedOutput)

        })

    })

})
