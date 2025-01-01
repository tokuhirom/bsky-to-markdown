# bsky-to-markdown

`bsky-to-markdown` is a GitHub Action that captures your Bluesky posts as an RSS feed, converts them into Markdown, and stores them in a GitHub repository. This simple yet powerful tool allows you to create a permanent, searchable, and revisitable log of your thoughts and activities on Bluesky, empowering you to reflect and rediscover your journey over time.

## Why bsky-to-markdown?

In the fast-moving world of online communication, it’s easy for meaningful posts to get lost in the shuffle. By archiving your Bluesky activity in Markdown format, you create an easily accessible, searchable, and permanent record of your online presence. Whether you want to review your growth, recall a specific moment, or simply treasure your words, this tool ensures your posts remain forever within your reach.

## Example Repository

You can see a sample repository demonstrating this action here:
[Sample Repository](https://github.com/tokuhirom/bsky-logs/blob/main/logs/202412.md)

## Sample Workflow Configuration

```yaml
name: Bluesky to Markdown

on:
  schedule:
     - cron: "*/15 * * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  take-logs:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v3

      - uses: tokuhirom/bsky-to-markdown@v1
        with:
          rss_url: "https://bsky.app/profile/did:plc:lxhl5eomhtxsraduecf3n6p3/rss"

      - name: Push built files
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add logs/
          if ! git diff --cached --quiet; then
            git commit -m "Add built files"
            git push origin HEAD
          else
            echo "No changes to commit"
```

## Development

### Setting Up

To prepare the development environment, install the necessary hooks:

```bash
npm run prepare
```

### Debugging

To debug, build the project and run it manually with input variables:

```bash
npm run build && INPUT_RSS_URL=https://bsky.app/profile/did:plc:lxhl5eomhtxsraduecf3n6p3/rss node --enable-source-maps dist/main.js
```

## Releasing

To release a new version, create a tag and push it to GitHub forcibly:

```bash
git tag -fa v1 -m "Release v1 with new updates" && git push origin v1 --force
```

## License

This project is licensed under the [MIT License](LICENSE). Copyright (c) tokuhirom.

By using `bsky-to-markdown`, you can ensure that your Bluesky journey is safely archived, easily searchable, and always accessible, preserving your moments and memories for years to come.

