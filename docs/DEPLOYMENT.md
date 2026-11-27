# Deployment Log

| Date | Step | Result | Notes |
|---|---|---|---|
| Nov 22 | Enable APIs | ❌ | `Billing must be enabled`. Cloud Shell was on the wrong project (`hybrid-lore-515522-i2`). Switched to `pantrypal-515522`. |
| Nov 22 | Link billing | ❌ → ✅ | `Cloud billing quota exceeded`: too many projects on the billing account. Unlinked an old class project to free a slot. |
| Nov 22 | Create Cloud SQL | ✅ | Postgres 16, db-f1-micro, `--async`. The console was showing the wrong project; fixed by selecting `pantrypal-515522`. |
| Nov 26 | Cloud Build (backend) | ❌ → ✅ | `could not find source [backend]`: wasn't inside the cloned repo. Cloned into Cloud Shell, then the build succeeded. |
| Nov 26 | Deploy API | ✅ | `/api/health` → ok, `/api/items` → `[]` (Cloud SQL connected). Granted Cloud SQL Client and other roles to the default service account. |
| Nov 26 | Deploy web | ❌ | Page showed `Unexpected token '<' … not valid JSON`, and `/api/health` returned **Rate exceeded**. Cause: `proxy_set_header Host $host` made nginx forward `/api` back to itself (an infinite loop). |
| Nov 27 | Redeploy web (v2) | ✅ | Removed `Host $host`, added `proxy_ssl_server_name on`. Site works end to end. |
| Nov 27 | Cloud Shell | ⚠️ | Variables were lost after a restart (`--region: expected one argument`). Re-exported them. |
