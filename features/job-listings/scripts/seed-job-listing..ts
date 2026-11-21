import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/get-current-auth";

type NewJobListing = typeof JobListingTable.$inferInsert;

type JobListingSeed = Pick<
  NewJobListing,
  | "title"
  | "description"
  | "wage"
  | "wageInterval"
  | "city"
  | "stateAbbreviation"
  | "isFeatured"
  | "locationRequirement"
  | "experienceLevel"
  | "status"
  | "type"
>;

export const mockJobListings = [
  {
    title: "Junior Frontend Developer",
    wage: 65_000,
    wageInterval: "yearly",
    city: "Austin",
    stateAbbreviation: "TX",
    isFeatured: true,
    locationRequirement: "in-office",
    experienceLevel: "junior",
    status: "published",
    type: "full-time",
    description: `
## About the Role

Help our product team build accessible, responsive web applications.
You will work alongside experienced developers and designers in our
Austin office.

## Responsibilities

- Build reusable components with React, TypeScript, and Tailwind CSS.
- Translate Figma designs into responsive interfaces.
- Integrate REST APIs and implement loading and error states.
- Fix bugs and participate in code reviews.
- Document component usage and setup instructions.

## Requirements

- Up to 2 years of frontend development experience.
- Working knowledge of HTML, CSS, JavaScript, and React.
- Familiarity with Git and responsive design.
- Basic understanding of accessibility.

## Nice to Have

- Familiarity with Next.js.
- Exposure to automated component testing.

## Compensation and Work Arrangement

- $65,000 USD per year.
- Full-time, in-office position in Austin, Texas.
- Paid time off, health coverage, and a learning budget.
`.trim(),
  },
  {
    title: "Junior Full Stack Developer",
    wage: 72_000,
    wageInterval: "yearly",
    city: "Austin",
    stateAbbreviation: "TX",
    isFeatured: true,
    locationRequirement: "remote",
    experienceLevel: "junior",
    status: "published",
    type: "full-time",
    description: `
## About the Role

Join a distributed team building web applications for small businesses.
This role is fully remote within the United States; Austin is the team's
administrative location.

## Responsibilities

- Build interfaces using React, Next.js, and TypeScript.
- Implement API endpoints and server-side validation.
- Work with PostgreSQL and Drizzle ORM.
- Handle authentication, loading states, and application errors.
- Communicate progress asynchronously and participate in code reviews.

## Requirements

- Up to 2 years of web development experience.
- Familiarity with React, TypeScript, and basic Node.js development.
- Basic understanding of SQL and relational databases.
- Strong written communication and Git skills.
- Four hours of overlap with the team's Central Time workday.

## Nice to Have

- Experience with Next.js App Router and Server Actions.
- Familiarity with Clerk or another authentication provider.

## Compensation and Work Arrangement

- $72,000 USD per year.
- Full-time, fully remote within the United States.
- Company laptop, home office allowance, and mentorship.
`.trim(),
  },
  {
    title: "React Frontend Developer",
    wage: 105_000,
    wageInterval: "yearly",
    city: "Seattle",
    stateAbbreviation: "WA",
    isFeatured: false,
    locationRequirement: "hybrid",
    experienceLevel: "mid-level",
    status: "published",
    type: "full-time",
    description: `
## About the Role

Build customer-facing dashboards for a subscription analytics product.
You will collaborate with product designers and backend engineers.

## Responsibilities

- Develop React and TypeScript features.
- Create accessible charts, filters, and data tables.
- Manage API data fetching, caching, and error handling.
- Write component tests and review pull requests.
- Investigate rendering and performance issues.

## Requirements

- 3 or more years of frontend development experience.
- Strong React, TypeScript, HTML, and CSS skills.
- Experience integrating REST APIs.
- Familiarity with automated testing and accessibility.

## Nice to Have

- Experience with TanStack Query and TanStack Table.
- Familiarity with design systems.

## Compensation and Work Arrangement

- $105,000 USD per year.
- Full-time, hybrid role in Seattle, Washington.
- Two office days per week.
`.trim(),
  },
  {
    title: "Senior Backend Engineer",
    wage: 160_000,
    wageInterval: "yearly",
    city: "Denver",
    stateAbbreviation: "CO",
    isFeatured: true,
    locationRequirement: "remote",
    experienceLevel: "senior",
    status: "published",
    type: "full-time",
    description: `
## About the Role

Own backend services supporting a growing workflow automation platform.
Work remotely with an engineering team distributed across the United States.

## Responsibilities

- Design and maintain Node.js and TypeScript services.
- Model PostgreSQL data and improve query performance.
- Build reliable background jobs and third-party integrations.
- Implement observability, authorization, and automated tests.
- Mentor engineers and lead technical design discussions.

## Requirements

- 5 or more years of backend development experience.
- Strong TypeScript, Node.js, SQL, and API design skills.
- Experience debugging production systems.
- Understanding of queues, retries, and idempotency.
- Clear technical communication.

## Nice to Have

- Experience with event-driven systems.
- Familiarity with Drizzle ORM and cloud infrastructure.

## Compensation and Work Arrangement

- $160,000 USD per year.
- Full-time, fully remote within the United States.
- Flexible scheduling with agreed team collaboration hours.
`.trim(),
  },
  {
    title: "UI/UX Designer",
    wage: 45,
    wageInterval: "hourly",
    city: "New York",
    stateAbbreviation: "NY",
    isFeatured: false,
    locationRequirement: "remote",
    experienceLevel: "mid-level",
    status: "published",
    type: "part-time",
    description: `
## About the Role

Help improve onboarding and account management for a web-based
productivity platform. This is a part-time remote role.

## Responsibilities

- Map user journeys and identify usability problems.
- Create wireframes and interactive prototypes in Figma.
- Design responsive screens and reusable interface patterns.
- Conduct lightweight usability tests.
- Provide implementation notes and review completed interfaces.

## Requirements

- 2 or more years of digital product design experience.
- A portfolio demonstrating user-centered design decisions.
- Strong Figma and responsive design skills.
- Understanding of accessibility fundamentals.
- Ability to collaborate asynchronously with developers.

## Nice to Have

- Experience maintaining a design system.
- Familiarity with HTML and CSS.

## Compensation and Work Arrangement

- $45 USD per hour.
- Approximately 20 hours per week.
- Fully remote within the United States.
- New York is the team's administrative location.
`.trim(),
  },
  {
    title: "Software Engineering Intern",
    wage: 24,
    wageInterval: "hourly",
    city: "Boston",
    stateAbbreviation: "MA",
    isFeatured: false,
    locationRequirement: "in-office",
    experienceLevel: "junior",
    status: "published",
    type: "internship",
    description: `
## About the Role

Gain practical experience building internal web tools with support from
an engineering mentor. This is a paid, 12-week internship.

## Responsibilities

- Implement small features using JavaScript and React.
- Fix documented bugs and add basic tests.
- Write setup notes and update technical documentation.
- Participate in team standups and code reviews.
- Demonstrate completed work during weekly check-ins.

## Requirements

- Foundational knowledge of HTML, CSS, and JavaScript.
- At least one personal, academic, or open-source coding project.
- Basic familiarity with Git.
- Willingness to ask questions and apply feedback.

## Nice to Have

- Introductory React or TypeScript experience.
- Familiarity with HTTP requests and APIs.

## Compensation and Work Arrangement

- $24 USD per hour.
- Paid internship, 30 hours per week for 12 weeks.
- In-office in Boston, Massachusetts.
`.trim(),
  },
  {
    title: "QA Automation Engineer",
    wage: 92_000,
    wageInterval: "yearly",
    city: "Chicago",
    stateAbbreviation: "IL",
    isFeatured: false,
    locationRequirement: "hybrid",
    experienceLevel: "mid-level",
    status: "published",
    type: "full-time",
    description: `
## About the Role

Help maintain release quality for a web-based recruiting platform.
Collaborate with engineers and product managers to prevent regressions.

## Responsibilities

- Write and maintain end-to-end tests with Playwright.
- Test API behavior and document reproducible defects.
- Integrate automated checks into CI pipelines.
- Investigate flaky tests and improve test reliability.
- Create test plans for high-risk user flows.

## Requirements

- 2 or more years of software testing experience.
- JavaScript or TypeScript programming skills.
- Experience with browser automation and API testing.
- Familiarity with Git and continuous integration.
- Strong debugging and documentation skills.

## Nice to Have

- Experience testing React applications.
- Familiarity with accessibility testing tools.

## Compensation and Work Arrangement

- $92,000 USD per year.
- Full-time, hybrid role in Chicago, Illinois.
- Two office days per week.
`.trim(),
  },
  {
    title: "Senior DevOps Engineer",
    wage: 155_000,
    wageInterval: "yearly",
    city: "San Francisco",
    stateAbbreviation: "CA",
    isFeatured: false,
    locationRequirement: "remote",
    experienceLevel: "senior",
    status: "draft",
    type: "full-time",
    description: `
## About the Role

Improve the reliability and deployment workflows of a cloud-hosted SaaS
platform. This listing is a draft awaiting internal approval.

## Responsibilities

- Maintain infrastructure as code using Terraform.
- Improve CI/CD workflows and deployment safety.
- Configure monitoring, alerting, and operational dashboards.
- Review cloud access controls and secret management.
- Document incident response procedures and recovery plans.

## Requirements

- 5 or more years of infrastructure or DevOps experience.
- Strong Linux, networking, and cloud platform knowledge.
- Experience with Terraform, containers, and CI/CD systems.
- Ability to troubleshoot production incidents.
- Clear written communication and documentation skills.

## Nice to Have

- Experience operating PostgreSQL.
- Familiarity with Kubernetes and observability tooling.

## Compensation and Work Arrangement

- Proposed salary: $155,000 USD per year.
- Planned as a full-time, remote role within the United States.
- San Francisco is the team's administrative location.
`.trim(),
  },
  {
    title: "Part-Time Technical Writer",
    wage: null,
    wageInterval: null,
    city: "Portland",
    stateAbbreviation: "OR",
    isFeatured: false,
    locationRequirement: "remote",
    experienceLevel: "mid-level",
    status: "draft",
    type: "part-time",
    description: `
## About the Role

Create clear developer documentation for a collection of web APIs and
integration tools. This listing is a draft pending budget approval.

## Responsibilities

- Write API guides, tutorials, and troubleshooting documentation.
- Test code examples and identify missing setup instructions.
- Collaborate with engineers to document new features.
- Maintain consistent terminology and documentation structure.
- Review feedback and improve confusing content.

## Requirements

- Experience writing technical documentation for developers.
- Strong Markdown and written communication skills.
- Familiarity with Git-based review workflows.
- Basic understanding of JavaScript, HTTP, and REST APIs.
- Ability to work independently with subject matter experts.

## Nice to Have

- Experience with documentation frameworks.
- Familiarity with OpenAPI specifications.

## Compensation and Work Arrangement

- Compensation has not yet been finalized.
- Planned schedule of 15 to 20 hours per week.
- Fully remote within the United States.
- Portland is the team's administrative location.
`.trim(),
  },
  {
    title: "Junior Web Developer",
    wage: 58_000,
    wageInterval: "yearly",
    city: "Miami",
    stateAbbreviation: "FL",
    isFeatured: false,
    locationRequirement: "in-office",
    experienceLevel: "junior",
    status: "delisted",
    type: "full-time",
    description: `
## About the Role

Maintain marketing websites and small business web applications.
This position has been filled and is no longer accepting applications.

## Responsibilities

- Build responsive pages using HTML, CSS, and JavaScript.
- Update React components and integrate simple API requests.
- Fix browser compatibility and layout issues.
- Collaborate with designers on content and interface updates.
- Maintain clear Git commits and project documentation.

## Requirements

- Foundational frontend development experience.
- Familiarity with React and Git.
- Understanding of responsive layouts.
- Attention to detail and willingness to learn.

## Nice to Have

- Exposure to TypeScript.
- Basic knowledge of search engine optimization and accessibility.

## Compensation and Work Arrangement

- $58,000 USD per year.
- Full-time, in-office role in Miami, Florida.
- This listing is retained for historical testing.
`.trim(),
  },
] satisfies JobListingSeed[];

/**
 * Inserts 10 fictional job listings for an existing organization.
 *
 * Non-destructive: does not update or delete existing records.
 * Not idempotent: running it again inserts another 10 listings.
 */
export async function seedJobListings(organizationId: string) {
  if (!organizationId || !organizationId.trim()) {
    throw new Error("An organizationId is required to seed job listings.");
  }

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const rows = mockJobListings.map((listing, index): NewJobListing => ({
    ...listing,
    organizationId,

    // Drafts have never been posted.
    // Delisted records retain their original posting date.
    postedAt:
      listing.status === "draft"
        ? null
        : new Date(now - (index + 1) * oneDayMs),
  }));

  const inserted = await db.insert(JobListingTable).values(rows).returning({
    id: JobListingTable.id,
    title: JobListingTable.title,
    status: JobListingTable.status,
    locationRequirement: JobListingTable.locationRequirement,
  });

  console.info(`Seeded ${inserted.length} job listings.`);
  console.table(inserted);

  return inserted;
}

async function main() {
  await seedJobListings("");
}

main().catch((error) => console.log("Error seeding job listings: ", error));
