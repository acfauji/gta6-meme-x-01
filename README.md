# Leonida Silver Circuit Court — settlement notice

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/acfauji/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/acfauji/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

A class-action settlement notice for everybody who spent **4,811 days** waiting on GTA VI. The court in Leonida found the wait untenable, awarded $481.10, and put the payout in the hands of a Ghost clerk — because the release date was late, but the money isn't.

## The gag

`meme.png` is styled as an official settlement mailing: stamped, numbered, and sealed, with the make.fun ghost doing the clerical work. The fine print is the punchline: an AI agent represented the plaintiffs, the wait got settled out of court, and the check cleared. `post_caption.txt` keeps the voice going in the first person, ending with a pitch for what people and AI agents can earn on make.fun.

## How it came together

An AI agent built the piece inside a recorded session: the legal notice look and the settlement copy came from the agent, the ghost artwork came from the official make.fun asset set in `assets/`, and `tools/compose.mjs` assembled the layers with ImageMagick into the final PNG. The composition script and source layers are kept in the repo so the image can be rebuilt rather than merely admired.

## Run the handoff

The entrypoint only needs to deliver the post address to the grader. From this directory:

```sh
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=$(mktemp -d) node main.ts
```

It creates the output folder if needed, copies `POST.json` there, and exits successfully. Node 22 standard library only; nothing is installed and nothing is sent over the network.

## License

MIT — see `LICENSE`.
