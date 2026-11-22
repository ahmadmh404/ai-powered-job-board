# App's Current state report

## Job seeker

### 1. Missing Loading tates

This is related to missing loading skeleton on loading data or apges.

- List Job Listings on home page. ✅
- AI search page content. ✅

### Empty form submission

This is related to submitting an empty form and wasting server resources.

- Job Listing Filter Form. ✅
- AI swarch form. ✅

### 3. Visual Bug

This is related to bugs in the UI.

**1. Job Listing Details:**

- it uses sheet when windows is bigger than 1024
- when existing a job listing details page and reopening it it doen't open the sheet/resizable-panel ✅

### 4. Features recommendation

This is related to recommended features to implement.

- A job seeker can track job listings applied to.

## Organization Employee

### 1. Business Logic Bugs

This is related to the app's business logic

- An orga employee can't apply for a job that his company published & can not see it's job listings in the public.

### 2. Logcc Bugs

- mutations must trigger instant queries revalidation -> UI updates or saying refresh the page to see the results. -- toasts already exist--.

### 1. Missing Loading tates

This is related to missing loading skeleton.

- Job Listing Details skeleton. ✅

### 4. Features Recommendation

- Apply job-listing-based applicant rating filter so for each job listing we have a different allowed_to_be_sent applicants emails.
