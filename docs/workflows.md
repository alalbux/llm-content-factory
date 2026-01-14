# Workflows

## Campaign lifecycle

1. Campaign is created via Admin UI
2. API persists campaign in Strapi
3. `plan_campaign` job is enqueued
4. Worker generates content tasks
5. Each task triggers `generate_task`
6. Drafts are reviewed by LLM Critic
7. Content is marked as `ready` or `needs_review`
8. Human approval (optional)
9. Publish and track metrics

---

## Background jobs

### plan_campaign
- Input: campaignId
- Output: content tasks
- Purpose: transform intent into work units

### generate_task
- Input: taskId
- Output: content versions
- Purpose: generate drafts and review quality

### review_version (future)
- Input: contentVersionId
- Purpose: re-review edited content

---

## Failure handling

- A failed job does not block the campaign
- Jobs can be retried independently
- Errors are logged and observable
