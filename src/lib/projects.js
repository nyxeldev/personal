// Evidence checked against public source on 2026-10-08. Pin links so that
// portfolio claims remain reviewable even when the projects change.
export const SEASMP_REVISION = "c2bded3aa5cb1464f6c908a004d9eee9b685cf99";
export const IELTS_REVISION = "16a3e00b6275b2c621c6cc4fcef4fdd11a485d73";
export const seasmpSource = (path) =>
  `https://github.com/nyxeldev/seasmp/blob/${SEASMP_REVISION}/${path}`;
export const ieltsSource = (path) =>
  `https://github.com/nyxeldev/speaking-new/blob/${IELTS_REVISION}/${path}`;

export const PROOF = {
  api: seasmpSource("apps/api/src/app.ts"),
  analytics: seasmpSource("apps/api/src/routes/analytics.routes.ts"),
  auth: seasmpSource("apps/api/src/services/auth.service.ts"),
  attendance: seasmpSource("apps/api/src/services/attendance.service.ts"),
  schema: seasmpSource("apps/api/prisma/schema.prisma"),
  model: seasmpSource("apps/analytics/ml/train.py"),
  retraining: seasmpSource("apps/analytics/src/tasks/training_tasks.py"),
  etl: seasmpSource("apps/analytics/src/services/etl.py"),
  schedule: seasmpSource("apps/analytics/src/tasks/celery_app.py"),
  ci: seasmpSource(".github/workflows/ci.yml"),
  frontend: seasmpSource("apps/web/package.json"),
  ielts: ieltsSource("src/app/part/[part]/page.jsx"),
};
