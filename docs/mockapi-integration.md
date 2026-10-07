# Temporary MockAPI Integration

> **Temporary development adapter:** MockAPI is used while the NexHire Express and MongoDB implementation is unavailable. It must be replaced by the planned backend without changing page-level UI contracts.

## Base URL

`https://6ac6138abea0e72cf5c882b7.mockapi.io`

The frontend reads the URL from `VITE_MOCK_API_BASE_URL`. It is configured locally in `client/.env.local` and represented with a non-secret example value in `client/.env.example`.

## Resources

### `/users`

Temporary account identity data:

| Field | Meaning |
|---|---|
| `id` | MockAPI identifier |
| `name`, `email`, `initials` | display identity |
| `role` | `STUDENT`, `RECRUITER`, `TPO`, or `ADMIN` |
| `status` | account lifecycle state |
| `approvalStatus` | temporary approval state |
| `createdAt` | account creation timestamp |

### `/records`

One temporary unified collection for domain data. Its available fields are: `id`, `type`, `name`, `email`, `role`, `userId`, `studentId`, `recruiterId`, `companyId`, `jobId`, `applicationId`, `title`, `description`, `branch`, `cgpa`, `status`, `location`, `workMode`, `ctc`, `stipend`, `date`, `deadline`, `createdAt`, and `updatedAt`.

Supported temporary `type` values are: `student`, `recruiter`, `company`, `job`, `application`, `interview`, `offer`, `placementDrive`, and `notification`.

## Relationships

```text
users.id → records(type=student|recruiter).userId
records(student).id → records(application|interview|offer).studentId
records(recruiter).id → records(company|job|placementDrive).recruiterId
records(company).id → records(job|interview|offer|placementDrive).companyId
records(job).id → records(application|interview|offer|placementDrive).jobId
records(application).id → records(interview|offer).applicationId
users.id → records(notification).userId
```

## Service layer

- `client/src/services/mockApi.js` owns the temporary Axios client.
- `client/src/services/mock/usersApi.js` provides user CRUD helpers.
- `client/src/services/mock/recordsApi.js` provides record CRUD helpers, including `getRecordsByType(type)`.

Pages must not call Axios directly. The current UI is intentionally not connected yet.

## Seed data

Run from the repository root:

```powershell
node scripts/seedMockApi.mjs
```

The script reads `client/.env.local`, creates seven fictional users, then seeds:

- 3 students and 2 recruiters
- 3 companies and 5 jobs
- 8 applications and 4 interviews
- 3 offers, 3 placement drives, and 6 notifications

It checks existing users by email, student/recruiter profiles by `type + email`, and other records by a stable `type + name + title` key before posting. Re-running it will not create duplicates for these seed records.

## Planned replacement

When Express/MongoDB is available, retain the domain service interfaces while changing their implementation from MockAPI calls to the approved REST endpoints. The unified `records` collection will be replaced by dedicated collections/endpoints such as users, students, companies, jobs, applications, interviews, offers, notifications, and placement drives.
