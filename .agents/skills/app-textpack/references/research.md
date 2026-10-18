# Research: find and read the source

## Choose the source

- Needs: you may reuse and republish it, and you can open it completely. Preferred, in this order:
  1. Children's and school encyclopedias under CC BY-SA (German: Klexikon for grades 3-6; Wikipedia, simple
     language, for 7+).
  2. Official texts that allow reuse (laws, public bodies with an open licence, CC BY / CC0 pages).
  3. Texts the creator supplies with a licence.
- Not allowed: newspaper articles, textbooks, tests of publishers, anything without a licence statement.
- Topic: fits the age, harmless, checkable by the learner from the text itself. Pick topics from the learners' world
  or school subjects of the years; avoid daily news, health advice, politics and religion before grade 9. Do not take
  topics that already have a pack (`.vibe/texts-log.md`).

## Read it

- Open the page. Read it completely, not a snippet. Wikipedia and Klexikon: use a fixed revision (`oldid=<n>` in the
  URL), never the live page.
- Note: title, fixed URL, revision, retrieval date, licence name and URL, the URL of the author list (page history).
  Licence: look at the page footer or the licence page; do not assume.
- Rate limits: on HTTP 429 or 403, stop, wait, try again later, then report. No loops, no tricks (other headers, other
  hosts). Every request has a cost for the source.
- Facts you will need to judge errors (numbers, names, definitions) stand in the source. If the source looks wrong
  or outdated, take another source; the pack checks the Variante against the source, not the source against the world.

## Record

- Put title, URL, revision, licence and dates into `source` of the pack. Set `verified: true` only after you compared
  every `evidence.quote` and the excerpt with the opened source.
- Under CC BY-SA the pack data stays under the same licence; say that in `notes`.
- In `notes`: what you did not verify, which parts of the source you left out and why.
