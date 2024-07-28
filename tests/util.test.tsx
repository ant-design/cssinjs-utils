import genMaxMin from '../src/util/maxmin';

describe('maxmin', () => {
  const cases = [
    {
      values: [1, 2, 3],
      js: {
        max: 3,
        min: 1,
      },
      css: {
        max: 'max(1px,2px,3px)',
        min: 'min(1px,2px,3px)',
      },
    },
  ];

  cases.forEach(({ values, js, css }, index) => {
    it(`js maxmin ${index + 1}`, () => {
      const { max, min } = genMaxMin('js');
      expect(max(...values)).toEqual(js.max);
      expect(min(...values)).toEqual(js.min);
    });

    it(`css maxmin ${index + 1}`, () => {
      const { max, min } = genMaxMin('css');
      expect(max(...values)).toEqual(css.max);
      expect(min(...values)).toEqual(css.min);
    });
  });
});
