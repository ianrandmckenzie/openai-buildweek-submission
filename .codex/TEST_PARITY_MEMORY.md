# Test parity memory

For every user-requested change, addition, or bug fix:

- Update or add unit tests and/or end-to-end tests that exercise the changed behavior.
- Include regression coverage for the reported failure path, not only for helper functions.
- Run the relevant focused tests before handoff, then run the full test suite and production build when practical.
- Do not claim a fix is complete without reporting the test coverage and verification performed.
- If UI behavior cannot be covered by the existing test setup, add the closest available component/integration regression test or explicitly report the gap before handoff.
