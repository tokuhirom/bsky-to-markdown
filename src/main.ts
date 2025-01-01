import * as fs from 'fs';
import * as path from 'path';

import * as core from '@actions/core';
import Parser from 'rss-parser';
import strftime from 'strftime';

// Custom type definitions for feed and item
type CustomFeed = {};
type CustomItem = {};

const parser: Parser<CustomFeed, CustomItem> = new Parser({});

export async function run(): Promise<void> {
	try {
		const rssUrl = core.getInput('rss_url');
		const fileTemplate = core.getInput('file_template') || 'logs/%Y%m.md';
		const dateTitleTemplate = core.getInput('date_title_template') || '# %Y-%m';
		const anchorFormat = core.getInput('anchor_format') || '%Y-%m-%d(%a) %H:%M';
		console.log(`File template: ${fileTemplate}`);

		if (!rssUrl) {
			core.setFailed('`rss_url` is required');
			return;
		}

		console.log(`RSS URL: ${rssUrl}`);
		core.info(`Fetching RSS feed from ${rssUrl}...`);
		const response = await fetch(rssUrl);

		if (!response.ok) {
			throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
		}

		const data = await response.text();
		const feed = await parser.parseString(data);

		const sortedItems = feed.items.sort((a, b) => {
			const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
			const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
			return dateA - dateB;
		});

		for (const item of sortedItems) {
			const date = new Date(item.pubDate || new Date());
			const filePath = strftime(fileTemplate, date);
			console.log(`Processing entry: ${item.title || item.content || '-'} to ${filePath}`);

			if (!fs.existsSync(path.dirname(filePath))) {
				fs.mkdirSync(path.dirname(filePath), { recursive: true });
			}

			let fileContent: string[] = [];
			if (fs.existsSync(filePath)) {
				fileContent = parseFile(fs.readFileSync(filePath, 'utf-8'));
				console.log(fileContent);
			}

			if (!item.link) {
				console.log(`Skipping entry without link: ${item.title}`);
			} else {
				// Check the each item of the fileContent. If the item is already in the fileContent, rewrite it.
				// if the item is not in the fileContent, append it to the fileContent.

				let buf =
					strftime(dateTitleTemplate, date) + '\n\n| Time | Comment |\n| ----- | ------- |' + '\n';

				let rewrote = false;
				fileContent.forEach((entry) => {
					if (entry.includes(item.link!)) {
						buf += renderEntry(anchorFormat, item) + '\n';
						core.info(`Rewrote entry: ${item.title}`);
						rewrote = true;
					} else {
						buf += entry + '\n';
					}
				});
				if (!rewrote) {
					buf += renderEntry(anchorFormat, item) + '\n';
					core.info(`Added entry: ${item.title || item.content}`);
				}

				fs.writeFileSync(filePath, buf);
			}
		}

		core.info('RSS feed processed successfully!');
	} catch (error) {
		if (error instanceof Error) core.setFailed(error.message);
		console.log(error);
	}
}

export function parseFile(content: string): string[] {
	/*
  The file format is following:

      # DATE

      | Time | Comment |
      | ----- | ------- |
      | [07:58](https://bsky.app/profile/tokuhirom.bsky.social/post/3lekn26jxgs2k) | 本陣殺人事件を読み始めたなど。 |
      | [09:20](https://bsky.app/profile/tokuhirom.bsky.social/post/3lelxhtju722k) | 本陣殺人事件読んだ。横溝正史〜〜って感じで良かった。 |

  In this case, the return value should be like this:

      [`| [07:58](https://bsky.app/profile/tokuhirom.bsky.social/post/3lekn26jxgs2k) | 本陣殺人事件を読み始めたなど。 |`,
      `| [09:20](https://bsky.app/profile/tokuhirom.bsky.social/post/3lelxhtju722k) | 本陣殺人事件読んだ。横溝正史〜〜って感じで良かった。 |`]
   */

	const lines = content.split('\n');
	const entries: string[] = [];

	lines.forEach((line) => {
		if (line.startsWith('| [')) {
			entries.push(line);
		}
	});

	return entries.map((entry) => entry.trim());
}

export function renderEntry(anchorFormat: string, item: Parser.Item): string {
	const anchor = item.pubDate ? strftime(anchorFormat, new Date(item.pubDate)) : '*';
	return `| [${anchor}](${item.link}) | ${item.content ? item.content.replace('\n', '<br>') : ''} |`;
}

run();
