// Each digit has 7 segments:
//  _
// |_|
// |_|
//
// The segments are represented as follows:
// 0: top
// 1: top-left
// 2: top-right
// 3: middle
// 4: bottom-left
// 5: bottom-right
// 6: bottom
//
// By default, all the segments are working, but we can specify which segments are not working.
//
// Based on which segments work, we can determine which digits might be displayed when we see
// a certain pattern of segments lit up.
const RED = '\x1b[0;31m'
const GREEN = '\x1b[1;32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const CYAN = '\x1b[36m'
const WHITE = '\x1b[37m'
const RESET = '\x1b[0m'// Resets to default color

const zero = new Set([0, 1, 2, 4, 5, 6]);
const one = new Set([2, 5]);
const two = new Set([0, 2, 3, 4, 6]);
const three = new Set([0, 2, 3, 5, 6]);
const four = new Set([1, 2, 3, 5]);
const five = new Set([0, 1, 3, 5, 6]);
const six = new Set([0, 1, 3, 4, 5, 6]);
const seven = new Set([0, 2, 5]);
const eight = new Set([0, 1, 2, 3, 4, 5, 6]);
const nine = new Set([0, 1, 2, 3, 5]);

const allShapes = [zero, one, two, three, four, five, six, seven, eight, nine];

class Digit {
    constructor(brokenSegments = []) {
        this.possibleShape = new Set();
        this.brokenSegments = new Set(brokenSegments);
    }

    // iSee(value)
    // When we see a certain pattern of segements lit up, those segments could represent one
    // or more digits. Use this function to set the digit we are trying to match.
    iSee(value) {
        if (value === undefined || value === null) {
            this.possibleShape = new Set();
            return;
        }

        if (allShapes[value] === undefined) {
            throw new Error('Invalid digit: ' + value);
        }
        
        this.possibleShape = new Set(allShapes[value]);
    }

    // couldBe(value) -> boolean
    // This function checks if the digit we are trying to match could be the digit we are
    // seeing. It returns true if the digit we are trying to match could be the digit we are
    // seeing, and false otherwise.
    couldBe(value) {
        if (allShapes[value] === undefined) {
            return false;
        }

        const digit = allShapes[value];
        for (let segment = 0; segment < 7; ++segment) {
            if (this.brokenSegments.has(segment)) {
                continue;
            }

            if (this.possibleShape.has(segment) !== digit.has(segment)) {
                return false;
            }
        }
        return true;
    }

    // alsoCouldBe() -> [int]
    // This function returns an array of digits that could be the digit we are trying to match.
    // It returns an empty array if there are no digits that could be the digit we are trying
    // to match.
    alsoCouldBe() {
        const possibleValues = [];
        for (let value = 0; value < 10; ++value) {
            if (this.couldBe(value)) {
                possibleValues.push(value);
            }
        }
        return possibleValues;
    }

    getStringRows() {
        return [
            this.brokenSegments.has(0) ? '   ' : this.possibleShape.has(0) ? GREEN + ' _ ' : RED + ' _ ',
            (this.brokenSegments.has(1) ? ' ' : this.possibleShape.has(1) ? GREEN + '|' : RED + '|') +
            (this.brokenSegments.has(3) ? ' ' : this.possibleShape.has(3) ? GREEN + '_' : RED + '_') +
            (this.brokenSegments.has(2) ? ' ' : this.possibleShape.has(2) ? GREEN + '|' : RED + '|'),
            (this.brokenSegments.has(4) ? ' ' : this.possibleShape.has(4) ? GREEN + '|' : RED + '|') +
            (this.brokenSegments.has(6) ? ' ' : this.possibleShape.has(6) ? GREEN + '_' : RED + '_') +
            (this.brokenSegments.has(5) ? ' ' : this.possibleShape.has(5) ? GREEN + '|' : RED + '|')
        ];
    }

    // toString() -> string
    // This function returns a string representation of the digit display. On segments should be
    // white, off segments should be red, and broken segments should be black.
    toString() {
        return this.getStringRows().join('\n') + RESET;
    }
};

class LCD {
    constructor(digits) {
        this.digits = digits;
    }

    // iSee(value:string)
    iSee(value) {
        for (const [index, digit] of this.digits.entries()) {
            const v = parseInt(value[index]);
            if (isNaN(v)) {
                digit.iSee();
            } else {
                digit.iSee(v);
            }
        }
    }

    // alsoCouldBe() -> [string]
    alsoCouldBe() {
        const alternatives = this.digits.map(digit => digit.alsoCouldBe());
        let result = [''];
        for (const altValues of alternatives) {
            result = altValues.flatMap(v => result.map(r => `${r}${v}`));
        }
        return result;
    }

    // toString() -> string
    // This function returns a string representation of the LCD display. On segments should be
    // white, off segments should be red, and broken segments should be black.
    toString() {
        const rows = this.digits.map(digit => digit.getStringRows());
        const result = [];
        for (let row = 0; row < 3; ++row) {
            result.push(rows.map(r => r[row]).join(' '));
        }
        return result.join('\n') + RESET;
    }
}

// Example usage:
// const digit = new Digit([0, 2, 5]);
// digit.iSee(2);

// const output = digit.toString()
// console.log(output);
// console.log(`Saw: ${2}. Also could be: ${digit.alsoCouldBe()}`);

// const lcd = new LCD([
//     new Digit([]),
//     new Digit([2, 5]),
//     new Digit([1, 4]),
//     new Digit([0, 2, 5]),
//     new Digit([0, 1, 4, 6]),
//     new Digit([])
// ]);
// lcd.iSee('653542');
// const possibilities = lcd.alsoCouldBe();
// console.log(lcd.toString());
// console.log(`Could be ${possibilities.length} values:\n`, possibilities.join(', '));

export { Digit, LCD };