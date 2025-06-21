module.exports = {
  ci: {
    collect: {
      // This tells Lighthouse CI to find and audit all HTML files in your `dist` directory.
      staticDistDir: './dist',
    },
    assert: {
      // This is a sensible default preset. It checks for most best practices but doesn't require a PWA.
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Assert that the performance score is at least 0.9 (90)
        'categories:performance': ['warn', { minScore: 0.9 }],
        // Assert that the accessibility score is at least 0.9 (90)
        'categories:accessibility': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // This will upload the report to a temporary public storage.
      target: 'temporary-public-storage',
    },
  },
}; 