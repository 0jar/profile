module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run preview --port 4321",
      url: [
        "http://localhost:4321/",
        "http://localhost:4321/vi/",
        "http://localhost:4321/cv/",
        "http://localhost:4321/cv/ats/",
        "http://localhost:4321/colophon/",
        "http://localhost:4321/vi/colophon/"
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }]
      }
    }
  }
};
