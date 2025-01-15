"use client";

import { motion } from "framer-motion";
import { Github, GitPullRequest, GitCommit, Star } from "lucide-react";

// Mock data - replace with actual GitHub API data
const githubStats = {
  totalContributions: 1243,
  pullRequests: 86,
  commits: 892,
  stars: 124,
};

export function GitHubActivity() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Github className="h-6 w-6" />
        <h3 className="text-xl font-semibold">GitHub Activity</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 rounded-xl bg-primary/5 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <GitCommit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Contributions</p>
            <p className="text-2xl font-semibold font-mono">
              {githubStats.totalContributions}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 rounded-xl bg-primary/5 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <GitPullRequest className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pull Requests</p>
            <p className="text-2xl font-semibold font-mono">
              {githubStats.pullRequests}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 rounded-xl bg-primary/5 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <GitCommit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Commits</p>
            <p className="text-2xl font-semibold font-mono">
              {githubStats.commits}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 rounded-xl bg-primary/5 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Repository Stars</p>
            <p className="text-2xl font-semibold font-mono">
              {githubStats.stars}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex justify-center"
      >
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Github className="h-4 w-4" />
          View GitHub Profile
        </a>
      </motion.div>
    </div>
  );
}
