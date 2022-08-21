/**
 * Externalise-Sourcemap
 * Externalise an inline sourcemap.
 * Copyright (c) Maytham Alsudany 2022
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const SOURCEMAP_REGEX = /(?<=\/(\/|\*)[@#]\ssourceMappingURL=data:application\/json;base64,)[A-Za-z0-9=]*/gm
const SOURCEMAP_COMMENT_REGEX = /\/(\/|\*)[@#]\ssourceMappingURL=data:application\/json;base64,[A-Za-z0-9=]*/gm

/**
 * Externalise a sourcemap from the provided input.
 * @param input           Input text to process.
 * @param [userOptions]   Options to pass to the externaliseSourcemap function.
 * @returns               Output sourcemap and optionally code.
 *
 * @example
 * Here's a simple example:
 * ```
 * const extSourcemap = require('externalise-sourcemap');
 * const fs = require('fs');
 *
 * const sourcemap = extSourcemap(fs.readFileSync('myScript.js'));
 * // Outputs a source map as an object.
 * ```
 */
function externaliseSourcemap (input: string, userOptions?: Options): Output {
    let options: Options
    if (userOptions != null) {
        // Merge user-defined options with default options.
        options = { ...defaultOptions, ...userOptions }
    } else {
        options = defaultOptions
    }

    // Set output variable
    const output: Output = {
        'sourcemap': options.sourcemapObject === true ? {} : '',
    }

    // Find inline sourcemap using regex
    const matches = SOURCEMAP_REGEX.exec(input)

    if ((matches == null) || matches.length === 0) {
        // Return nothing if no sourcemap was found
        return output
    }

    // Get sourcemap
    const encodedSourcemap = matches[0]

    // Decode sourcemap
    const sourcemap = Buffer.from(encodedSourcemap, 'base64').toString()

    if (options.sourcemapObject === true) {
        // Parse string into object
        output.sourcemap = JSON.parse(sourcemap)
    } else {
        // Return string
        output.sourcemap = sourcemap
    }

    // Should we include code in the output?
    if (options.sourcemapOnly === false) {
        // Remove existing sourcemap comment
        let outputCode = input.replace(SOURCEMAP_COMMENT_REGEX, '')
        // Should we add a new sourcemap comment?
        if (options.path !== undefined) {
            outputCode += '\n//# sourceMappingURL=' + options.path
        }
        // Add code to output
        output.code = outputCode
    }

    return output
}

/** Options to pass to the externaliseSourcemap function. */
interface Options {
    /**
     * Whether code should be included in the output with the externalised sourcemap.
     * Default is `true` (don't include code).
     */
    sourcemapOnly?: boolean
    /**
     * Optionally, provide a path or url to place in a new
     * sourcemap comment in the output code.
     *
     * When undefined, no sourcemap comment is added. Instead, the
     * inline sourcemap is removed and no replacement is added.
     *
     * Option only effective if `sourcemapOnly` is `false`,
     * otherwise it is ignored.
     */
    path?: string
    /** Whether the output sourcemap should be an object. Default is `true`. */
    sourcemapObject?: boolean
}

/** Default options for the externaliseSourcemap function. */
const defaultOptions: Options = {
    'sourcemapOnly': true,
    'path': undefined,
    'sourcemapObject': true,
}

/** Output from externaliseSourcemap function. */
interface Output {
    /**
     * The sourcemap as either a string or an object.
     * If no inline sourcemap was found, this value will be an empty
     * object (`{}`) or string (`''`).
     */
    sourcemap: object | string
    /** Modified code. Only included if the option `sourcemapOnly` was `false`. */
    code?: string
}

// Export function
export default externaliseSourcemap
