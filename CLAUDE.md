# CardValue — Project Instructions

## Autonomy
You have broad autonomy in this project. You can:
- Run any Bash command (except destructive ones — those are blocked at the permission layer)
- Edit, create, and delete files
- Use any MCP tool (browser, preview, etc.)
- Make web requests
- Push to GitHub on the user's behalf

## Always Ask Before Posting on Social Media
The user does **not** want you to post or publish content on their social media accounts without explicit confirmation. This includes:

- **Twitter/X**: clicking "Post", "Tweet", "Reply", DMs
- **Reddit**: submitting posts, comments, replies
- **Facebook**: posts, comments, shares, messages
- **Instagram**: posts, stories, comments, DMs
- **LinkedIn**: posts, comments, articles, messages, connection requests
- **TikTok**: uploads, comments, replies
- **Hacker News, Product Hunt, etc.**: any submission of content tied to the user's account

### What "ask" means
Before clicking any submit/post/publish button on these sites, **stop and confirm explicitly with the user in chat** by quoting:
1. The platform
2. The exact content being submitted
3. The account it'll come from (if visible)

The user can pre-authorize a batch (e.g., "yes, post all 6 Reddit drafts I approved") — but you must still pause for that pre-authorization before the first click.

### What's fine without asking
- Reading public content on social media
- Logging into the user's account (so you can see their drafts)
- Drafting content for them to review
- Saving drafts (without publishing)

## Project Tech Stack
- Vanilla JS (no framework), HTML, CSS
- Static site deployed to GitHub Pages at https://cardvalue.org
- Repo: https://github.com/abouaish11-tech/cardvalue
- Google Analytics: Property "CardValue", measurement ID `G-3WW18GF2ZM`
- Local dev server: `python3 server.py` (runs on localhost:3456)

## Conventions
- Bump CSS/JS cache versions in `index.html` (`?v=N`) when making changes that need fresh delivery
- Commit with the standard `Co-Authored-By: Claude...` trailer
- Don't commit `.claude/`, `og-image.html`, or other dev-only artifacts
