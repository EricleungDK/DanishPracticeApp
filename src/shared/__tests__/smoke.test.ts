describe('smoke test', () => {
  it('jest is configured correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('window.api mock is available', () => {
    expect(window.api).toBeDefined();
    expect(window.api.getStats).toBeDefined();
  });
});
