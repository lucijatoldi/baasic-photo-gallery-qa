# Test Plan: Baasic Photo Gallery

**Date:** October 20, 2025
**Author:** Lucija Toldi

---

## 1. Overview of Key Functionalities

Based on exploratory testing, the application is a photo gallery with the following core functionalities, noting their current stability:

*   **Public Gallery & Navigation:**
    *   A main landing page with a hero image and a "scroll down" indicator.
    *   A main gallery view displaying a grid of photo thumbnails.
    *   Infinite scroll to dynamically load more photos.
    *   Navigation to a dedicated detail page for a single image.
    *   A header with a hover-activated menu for main navigation links.

*   **User Authentication:**
    *   Standard user registration and login forms with client-side validation.
    *   **Limitation:** Several critical authentication flows are non-functional. **Password Recovery** leads to a 404 error, and **Social Login** is not configured. The account locking mechanism also appears to be permanent.

*   **Search Functionality:**
    *   A header icon that reveals a search input field.
    *   Submission of search queries and display of results.
    *   **Limitation:** This feature suffers from critical state corruption issues, causing results to disappear unpredictably. The core search logic is also flawed (e.g., incorrect handling of spaces, broad substring matching).

*   **User-Specific Functionality (Logged-in Users):**
    *   A user profile page displaying user-created content.
    *   Album creation, including uploading a cover photo.
    *   Uploading additional photos to an existing album.
    *   **Limitation:** This entire feature is fundamentally unstable. Core logic is flawed (e.g., cover photos are not part of the album), and critical user flows (viewing a photo within an album) are broken, resulting in 404 errors. Data integrity is also compromised (e.g., orphaned photos after deletion).

## 2. Test Strategy

A combined testing approach was applied to ensure comprehensive coverage of the application's current state:

1.  **Exploratory Testing:** Manual, unscripted exploration of the application was performed to discover unexpected bugs, state corruption issues, and user experience (UX) flaws. All significant findings are documented in the `BUG_REPORT.md`.

2.  **Manual Scenario-Based Testing:** Key user flows ("happy paths") were manually executed to verify that core functionalities work as expected under ideal conditions. This was crucial for features too unstable for automation, such as Album Management.

3.  **Automated E2E Testing (Cypress):** Automated tests were written for the most critical and stable user scenarios to ensure long-term stability and catch regressions in fundamental areas like Login, Registration, and Gallery Navigation.

**Element Selection Strategy:** As the application does not utilize `data-testid` attributes, element selection for automated tests primarily relies on a combination of `id`, `name`, `title`, and other unique attributes, supplemented by `cy.contains()` for textual content.

## 3. Automation Prioritization

Test scenarios were prioritized based on business criticality, frequency of use, and their current stability. The significant number of critical bugs discovered during exploratory testing heavily influenced this prioritization.

### Priority: HIGH (Essential Automation)

| Scenario | Rationale |
| :--- | :--- |
| **Login Flow (Success & Failure)** | **Critical Functionality:** The entry point for all users. High usage and fundamental for all user-specific features. Must be stable. |
| **Registration Form Validation (Client-Side)** | **Key User Interaction:** Ensures a good user experience and prevents invalid data submission at the source. Stable enough for reliable automation. |
| **Main Gallery Loading and Navigation** | **Core Feature:** The primary purpose of the application. Tests must verify that photos load, are displayed, and that navigation to and from the detail page works. |
| **Basic Search Functionality (Happy Path)** | **Core Feature:** Despite its flaws, a basic successful search is a key user flow. An automated test confirms the feature works at its most basic level. |

### Priority: MEDIUM (Good Candidates for Future Automation)

| Scenario | Rationale |
| :--- | :--- |
| **Empty Search Results Handling** | **Edge Case Handling:** Important to verify the application handles no-result scenarios gracefully. Currently reveals a UI corruption bug when searching for a single space. |
| **Main Navigation Menu Functionality** | **Core Navigation:** Ensures users can access key pages. A simple, stable, and high-value regression test. |
| **Confirming Known Bugs via Automation** | Writing tests that replicate and confirm critical bugs (e.g., the broken back-navigation from a photo detail page) is valuable. These tests will fail once the bug is fixed, serving as a clear indicator for testers to update the test suite. |

### Priority: LOW (Manual Testing is Sufficient / Automation Not Feasible)

| Scenario | Rationale |
| :--- | :--- |
| **Album Creation and Management Flow** | **Fundamentally Broken:** The entire feature is plagued with critical bugs (404 errors, flawed logic, data integrity issues). Automating this would result in flaky, unreliable tests and a poor return on investment. It requires significant bug fixing before it can be considered stable enough for automation. |
| **State Corruption Scenarios** | **Critical but Unstable:** Critical bugs like the registration form corrupting the entire app state, or search results disappearing, are often difficult to script reliably. A detailed manual bug report with clear reproduction steps is more valuable at this stage. |
| **Password Recovery & Social Login** | **Non-Functional:** These features are completely broken (lead to 404s or configuration errors). It is impossible to write meaningful E2E tests for them in their current state. |
| **Intermittent Bugs (e.g., Orphaned Photo)** | **Not Reliably Automatable:** By definition, these bugs do not appear consistently. While automation can help in reproducing them over many runs, it is not suitable for a primary regression suite. They must be logged manually with as much context as possible. |