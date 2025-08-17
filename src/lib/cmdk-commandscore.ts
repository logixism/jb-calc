// ------------------- Constants -------------------

const enum Score {
  CONTINUE_MATCH = 1,
  SPACE_WORD_JUMP = 0.9,
  NON_SPACE_WORD_JUMP = 0.8,
  CHARACTER_JUMP = 0.17,
  TRANSPOSITION = 0.1,
}

const enum Penalty {
  SKIPPED = 0.999,
  CASE_MISMATCH = 0.9999,
  DISTANCE_FROM_START = 0.9,
  NOT_COMPLETE = 0.99,
}

// ------------------- Regex -------------------

const IS_GAP_REGEXP: RegExp = /[\\\/_+.#"@\[\(\{&]/;
const COUNT_GAPS_REGEXP: RegExp = /[\\\/_+.#"@\[\(\{&]/g;
const IS_SPACE_REGEXP: RegExp = /[\s-]/;
const COUNT_SPACE_REGEXP: RegExp = /[\s-]/g;

// ------------------- Core -------------------

function commandScoreInner(
  string: string,
  abbreviation: string,
  lowerString: string,
  lowerAbbreviation: string,
  stringIndex: number,
  abbreviationIndex: number,
  memoizedResults: Record<string, number>,
): number {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length) {
      return Score.CONTINUE_MATCH;
    }
    return Penalty.NOT_COMPLETE;
  }

  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== undefined) {
    return memoizedResults[memoizeKey];
  }

  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;

  while (index >= 0) {
    let score = commandScoreInner(
      string,
      abbreviation,
      lowerString,
      lowerAbbreviation,
      index + 1,
      abbreviationIndex + 1,
      memoizedResults,
    );

    if (score > highScore) {
      if (index === stringIndex) {
        score *= Score.CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= Score.NON_SPACE_WORD_JUMP;
        const wordBreaks = string
          .slice(stringIndex, index - 1)
          .match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= Math.pow(Penalty.SKIPPED, wordBreaks.length);
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= Score.SPACE_WORD_JUMP;
        const spaceBreaks = string
          .slice(stringIndex, index - 1)
          .match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= Math.pow(Penalty.SKIPPED, spaceBreaks.length);
        }
      } else {
        score *= Score.CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= Math.pow(Penalty.SKIPPED, index - stringIndex);
        }
      }

      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= Penalty.CASE_MISMATCH;
      }
    }

    // Handle transposition / duplicates
    if (
      (score < Score.TRANSPOSITION &&
        lowerString.charAt(index - 1) ===
          lowerAbbreviation.charAt(abbreviationIndex + 1)) ||
      (lowerAbbreviation.charAt(abbreviationIndex + 1) ===
        lowerAbbreviation.charAt(abbreviationIndex) &&
        lowerString.charAt(index - 1) !==
          lowerAbbreviation.charAt(abbreviationIndex))
    ) {
      const transposedScore = commandScoreInner(
        string,
        abbreviation,
        lowerString,
        lowerAbbreviation,
        index + 1,
        abbreviationIndex + 2,
        memoizedResults,
      );

      if (transposedScore * Score.TRANSPOSITION > score) {
        score = transposedScore * Score.TRANSPOSITION;
      }
    }

    if (score > highScore) {
      highScore = score;
    }

    index = lowerString.indexOf(abbreviationChar, index + 1);
  }

  memoizedResults[memoizeKey] = highScore;
  return highScore;
}

// ------------------- Utils -------------------

function formatInput(string: string): string {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}

// ------------------- Public API -------------------

export function commandScore(
  string: string,
  abbreviation: string,
  aliases: string[] = [],
): number {
  const input = aliases.length > 0 ? `${string} ${aliases.join(" ")}` : string;
  return commandScoreInner(
    input,
    abbreviation,
    formatInput(input),
    formatInput(abbreviation),
    0,
    0,
    {},
  );
}
