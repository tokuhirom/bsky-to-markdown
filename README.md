# rss-to-markdown

## Development

    npm run prepare

to install the husky commit hook.

Run following command to debug.

    npm run build && INPUT_RSS_URL=https://bsky.app/profile/did:plc:lxhl5eomhtxsraduecf3n6p3/rss node --enable-source-maps dist/main.js

### Relese

Create tag on my local machine, and push forcibly.

    git tag -fa v1 -m "Release v1 with new updates" && git push origin v1 --force
