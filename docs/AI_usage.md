## PAN-4: Add item

- **Asked:** GitHub Copilot to generate the add-item feature (Flask POST /api/items endpoint + React form)
- **Kept/changed:** Kept the overall structure, but the generated code had typos that broke it, so I reviewed it line by line before merging
- **Verified:** Ran pytest and added items manually in the browser

### Bug 1: [e.g. misspelled field name]
- **Symptom:** [what you saw, e.g. "item saved but expiry date was always blank" or "500 error on submit"]
- **Cause:** Copilot typo: [e.g. `expiry_date` written as `expiry_dat` in the React form]
- **Fix:** Corrected the typo and re-tested adding an item

### Bug 2: [short name]
- **Symptom:** [...]
- **Cause:** Copilot typo: [...]
- **Fix:** [...]

**Takeaway:** AI-generated code can look right and still fail on small details, so I test every feature before merging instead of trusting it as-is.