
# Baasic Photo Gallery - QA & Automation Project

This repository contains the deliverables for the Software Tester practical assignment, including a Test Plan, a detailed Bug Report, and a suite of End-to-End (E2E) automated tests for the Baasic Photo Gallery demo application.

## Deliverables

This repository contains three main deliverables as part of the assignment:

*   **[Test Plan](TEST_PLAN.md):** An overview of the application's functionalities, the test strategy, and the automation prioritization.
*   **[Bug Report](BUG_REPORT.md):** A comprehensive list of all significant issues discovered during testing, with detailed reproduction steps and evidence.
*   **[Automated Tests](/cypress/e2e):** The Cypress E2E test suite covering core application features.


## Framework & Tools Used

*   **Test Automation Framework:** [Cypress](https://www.cypress.io/)
*   **Programming Language:** JavaScript
*   **CI/CD:** N/A (Project is run locally)

## Test Coverage

The automated test suite, located in the `/cypress/e2e` directory, covers the following key application functionalities:

1.  **Login (`login.cy.js`):**
    *   Successful login with valid credentials (email or username).
    *   Handling of invalid credentials and empty form submission.
    *   Edge cases like credentials with extra spaces or mixed casing.

2.  **Registration (`registration.cy.js`):**
    *   Successful registration with valid, unique data.
    *   Client-side validation for required fields, invalid email format, password length, and mismatched passwords.

3.  **Gallery Navigation (`gallery.cy.js`):**
    *   Verification of initial page load elements (hero image, menu, search icon).
    *   Interaction with the scroll indicator to reveal the photo gallery.
    *   Navigation to a photo's detail page.
    *   Verification of a known bug where navigating back returns the user to the top of the page.

4.  **Search (`search.cy.js`):**
    *   Successful search returning relevant results.
    *   Handling of searches that yield no results.
    *   Verification of known bugs, such as UI corruption when searching for a single space.

## How to Run the Tests

### Prerequisites

*   [Node.js](https://nodejs.org/) (v22.20.0 or higher recommended)
*   npm (comes with Node.js)

### 1. Setup

Clone the repository and install the necessary dependencies.

```bash
# Clone the repository
git clone https://github.com/lucijatoldi/baasic-photo-gallery-qa.git

# Navigate into the project directory
cd baasic-photo-gallery-qa

# Install dependencies (including Cypress)
npm install
```

### 2. Configuration

The tests require valid user credentials to be set up in an environment file.

1.  In the root of the project, create a new file named `cypress.env.json`.
2.  Add your credentials to this file using the following structure:

```json
{
  "TEST_USER_EMAIL": "your-email@example.com",
  "TEST_USER_PASSWORD": "your-password",
  "TEST_USER_USERNAME": "your-username"
}
```

### 3. Running the Tests

You can run the Cypress tests in two ways:

**A) Interactive Mode:**

This command opens the Cypress Test Runner, allowing you to watch tests run in real-time and use debugging tools.

```bash
npx cypress open
```

**B) Headless Mode:**

This command runs all tests in the terminal without opening a browser window.

```bash
npx cypress run
```