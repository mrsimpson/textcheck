# Parallel production (draft of the procedure)

For the requester (the session that collects the packs). Not executed yet.

## Preparation

1. Agree a topic list per pair of school years with the creator. Each topic gets a pack id.
2. Pilot: one pack first, so the creator can test it for real. Then a second one from a different school-year pair. Scale only when skill, schema and checker carry them cleanly.

## Per assignment (one session)

- `create_session` with the repository, base `work`, an own branch (`outcome_branch: text/<id>`), tag `textcheck-texts`.
- The assignment holds: school years, topic, pack id, language, a pointer to skill `app-textpack`, the id of the requesting session, and the request to send the report back by message.
- Keep the number of concurrent sessions low (proposal: 4). The git connection of a session limits concurrent operations, and Wikipedia answers too many requests with HTTP 429. We saw both in this session.

## Return per pack

1. Fetch the branch and run `check_textpack.py` yourself. Do not trust the report.
2. Spot check against the source: open the quotes and numbers in the original.
3. If "passed": merge into `work`, add an entry to `.vibe/texts-log.md` (id, school years, source, revision, check result, session id).
4. Only then archive the session (`archive_session`).
5. On failure: send it back once with concrete feedback, then reassign. Never loosen a check.

## Volume

- Target of the creator: about 10 packs per two adjacent school years. For grades 3 to 13 that is 5 to 6 pairs, so about 50 to 60 packs.
- Cost and effort per session are unknown; the pilot shows them.
