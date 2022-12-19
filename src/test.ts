// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.4

interface Test {
  testy?: string;
}

interface Options {
  test: Test['testy'];
  // no error when doing the following
  // test: string;
  // or
  // test?: string;
}

declare function includesAllRequiredOptions(options: Partial<Options>): options is Options;
