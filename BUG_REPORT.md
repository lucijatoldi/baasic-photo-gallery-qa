# Bug Report: Baasic Photo Gallery

**Date:** October 20, 2025

**Author:** Lucija Toldi

**Environment:** Windows 11, Chrome Browser (Version 141.0.7390.108)

---

## Summary

This document contains a comprehensive list of all significant issues identified during the exploratory testing phase, grouped by functionality and prioritized by impact.


---

## A) Critical Flow & State Corruption Issues

### **BUG-001: [Critical] Invalid interaction with "Confirm Password" field breaks form validation and corrupts application state**

-   **Severity:** Critical
-   **Priority:** High

---

#### **Summary:**

Interacting with the "Confirm Password" field under specific conditions breaks the registration form's validation logic permanently. Once this happens, the form can never be successfully submitted. More critically, if the user navigates away from this broken form, the entire application enters an unusable state (infinite loading spinners), requiring a hard refresh to recover.

------

#### **Part 1: Breaking the Form Validation**

- **Steps to Reproduce:**

  -   **Navigate** to the Register page (/register).
  -   **Click** inside the **"Confirm Password"** input field first, before interacting with any other field.
  -   **Click** outside the field to remove focus without writing **anything** in the field. A validation error "Confirm Password is required." appears.
  -   Now, **attempt to fill out the entire registration form** correctly from top to bottom (Email, Username, Password, Confirm Password).

- **Expected Result:**

  As all fields are now valid, the validation errors should disappear, and the "Register" button should become enabled, allowing form submission.

- **Actual Result:**

  The "Register" button **remains disabled indefinitely**. The form's validation state appears to be permanently broken, and the user is completely blocked from registering. A hard refresh (F5) is the only way to recover.

- **Evidence (Part 1):** https://screenrec.com/share/1o8fCvGkOb

------

#### **Part 2: Corrupting the Entire Application State**

- **Steps to Reproduce:**

  - Perform all the steps from **Part 1** to get the form into a broken state.
  - Instead of trying to submit, **use the browser's "Back" button** to navigate back to the main gallery page.
  - **Attempt to scroll down** or use any other application feature (like Search or Menu).

- **Expected Result:**
  The main gallery page should function normally.

- **Actual Result:**
  An **infinite loading spinner** appears, and no content ever loads. The entire single-page application is now in a corrupted, unusable state. A hard refresh (F5) is the only way to recover.

- **Evidence (Part 2):** https://screenrec.com/share/j3VOkHDSXb



<br>
<br>

------


### **BUG-002: [Critical] Navigating to a photo detail page from within an album results in a 404 error**

- **Severity:** Critical

- **Priority:** High

- **Steps to Reproduce:**

  -   **Log in** as a user who has an album with at least one photo uploaded inside it.
  -   **Navigate** to the user's profile/dashboard page.
  -   **Click** on the album cover image to open the album detail page.
  -   **Click** on any photo thumbnail displayed within the album.

- **Expected Result:** 

  The photo detail page should load correctly, displaying the full-size image and its details. The behavior should be identical to opening a photo from the main public gallery. The URL should be stable and point to the specific photo's resource.

- **Actual Result:** 

  The application fails to navigate correctly. The URL briefly flashes a path to the photo and then immediately redirects to a generic `/**` route, displaying a **404 Page Not Found error page**. A core user flow for interacting with albums is completely broken.

- **Evidence:** https://screenrec.com/share/tEL2XIpY8w


<br>
<br>
<br>



## B) Authentication & Forms

### **BUG-003: [Critical] The password reset link sent via email is broken and leads to a 404 page**

- **Severity:** Critical

- **Priority:** High

- **Steps to Reproduce:**

  - **Navigate** to the Login page.
  - **Initiate** the password recovery process by clicking the "Forgot Your Password? Recover Your Password Here!" link.
  - **Enter** a valid, registered email address into the form and **click** "Recover Password".
  - **Open** the received password recovery email from your inbox.
  - **Click** on the "Set new password" button/link within the email.

- **Expected Result:**

  The link should navigate the user to a secure page with a form to enter and confirm a new password. Upon successful submission, the password should be updated.

- **Actual Result:**

  The link navigates to a server error page displaying **HTTP Error 404.0 - Not Found**. The password recovery process is completely blocked at this final, critical step.

-   **Evidence:** https://screenrec.com/share/F5qWb1Mg7d



<br>
<br>

------



### **BUG-004: [High] Social Login functionality is not configured and displays a raw error message**

- **Severity:** High

- **Priority:** Medium

- **Steps to Reproduce:**

  -  **Navigate** to the Login page (/login).
  -  **Locate** the "Social Login" section.
  -  **Click** on any of the social media icons (Facebook, Twitter, Google, or GitHub).

- **Expected Result:**

  The application should either initiate the OAuth flow by redirecting the user to the respective social media login page, OR if the feature is not implemented, the buttons should be disabled or hidden to prevent user interaction.

- **Actual Result:**

  A raw, unformatted error message **"undefined: Social login configuration not found."** is displayed directly on the UI below the icons. This error message is not user-friendly and exposes internal configuration issues.

-   **Evidence:** https://screenrec.com/share/ybPZp36SOw



<br>
<br>

------



### **BUG-005: [High] Password length validation is inconsistent and fails silently for 7-character passwords**

- **Severity:** High

- **Priority:** High

- **Steps to Reproduce:**

  * **Navigate** to the Register page.
  * Enter a **unique, valid** email and username.
  * Enter a password that is exactly **7 characters** long (e.g., 1234567).
  * Enter the same password in the "Confirm Password" field.
  * **Click** the "Register" button repeatedly.

- **Expected Result:**

  The form should either successfully register the user (if 7 characters is a valid length) OR it should display a clear validation error, such as "Password must be at least 8 characters long."

- **Actual Result:**

  The "Register" button is clickable, but **nothing happens**. No error message is displayed, the page does not reload, and the user is stuck without any indication of what is wrong.

- **Evidence:** https://screenrec.com/share/JQomkV9GsE



<br>
<br>

------



### **BUG-006: [High] Form displays incorrect and "sticky" validation error when the real issue is password length**

- **Severity:** High
- **Priority:** High
- **Prerequisite:** This bug is a direct consequence of **BUG-005**.
- **Steps to Reproduce:**
  - **Navigate** to the Register page.
  - Enter an **already taken** username (e.g., enmari1001).
  - Enter a **unique, valid** email.
  - Enter a password that is exactly **7 characters** long (e.g., 1234567).
  - Enter the same password in the "Confirm Password" field.
  - **Click** "Register".
    - *Observation:* The form correctly displays the "Username taken!" error.
  - **Correct the username** to a new, unique value.
  - **Click** "Register" again.
- **Expected Result:**
  The "Username taken!" error should disappear. The form should now either register the user or (correctly) display an error about the password length.
- **Actual Result:**
  The **"Username taken!" error message persists**, incorrectly blocking the user. The form never mentions that the password is the actual problem. The user is in a dead-end loop until they randomly try a password with 8+ characters.
- **Evidence:** https://screenrec.com/share/a3W0AzQsKO



<br>
<br>

------



### **BUG-007: [High] Account becomes permanently locked after several failed login attempts**

- **Severity:** High

- **Priority:** High

- **Steps to Reproduce:**

  - **Navigate** to the Login page.
  - Attempt to log in with the **correct username** but an **incorrect password** repeatedly (e.g., 5-10 times).

- **Expected Result:**

  The user should either be temporarily locked out (e.g., for 15 minutes) with a clear message indicating the duration, or they should be directed to the password recovery flow to unlock their account.

- **Actual Result:**

  The account becomes locked, displaying a "User is locked." message. This lock appears to be permanent or very long-term. There is no provided mechanism for the user to unlock their account since the "Password recovery" flow doesn't work (BUG-003). 

- **Evidence:** https://screenrec.com/share/2tXVCsb8lo



<br>
<br>

------



### **BUG-008: [Medium] Password Recovery form displays an unhandled `[object Object]` error for unactivated accounts**

- **Severity:** Medium

- **Priority:** Low

- **Steps to Reproduce:**

  -   **Register** a new account with a unique email (e.g., `unactivated.user11@example.com`).
  -   **Do not** click the activation link in the verification email.
  -   **Navigate** to the Login page, then to the Password Recovery page.
  -   **Enter** the same, unactivated email address (`unactivated.user11@example.com`) into the recovery form.
  -   **Click** the "Recover Password" button.

- **Expected Result:**

  The application should display a clear, user-friendly error message explaining the situation. Examples could be: "This account has not been activated yet," or "User not found."

- **Actual Result:**

  A raw, red-colored error message is displayed, containing only the text **[object Object]**. This indicates that a JavaScript error object is being directly rendered to the UI instead of being properly handled and translated into a human-readable message.

- **Evidence:** https://screenrec.com/share/zJiGSZ7jc8



<br>
<br>

---

## C) Album Management

*A collection of critical and high-severity issues indicating the entire feature is fundamentally flawed.*

### **BUG-009: [High] Core album logic is flawed; the cover photo is not treated as part of the album's photo collection**

-   **Severity:** High
-   **Priority:** Medium

------

-   **Summary:**
    The image uploaded as an album's "cover photo" during creation exists in a confusing, inconsistent state. It is displayed publicly in the main gallery as a standalone photo, but it is **not** displayed within the album's own detail page alongside other uploaded photos. This creates a disconnect in the user's mental model of what an album contains and makes album management illogical.

-   **Steps to Reproduce:**
    -  **Log in** as a registered user and navigate to the profile page.
    -  **Create** a new album and **upload** a cover image.
    -  After the album is created, **click** on its cover to enter the album detail page.
    -  Inside the album, **upload** a new, different photo.
    -  **Observe** the contents of the "Test Album" detail page.
    -  Now, **navigate** back to the main public gallery (`/main`) and find the photos you uploaded.

-   **Expected Result:**
    An album should function as a container for all its photos.
    -   The album detail page should display **both** photos.
    -   The total photo count for the album should be 2.
    -   Both images should appear in the main public gallery.

-   **Actual Result:**
    -   The album detail page **only shows the inside photo**. The cover photo is completely absent.
    -   The photo count for the album incorrectly shows "1 photo".
    -   However, **both photos** are visible in the main public gallery, completely disconnected from each other.
    -   This makes it impossible for a user to manage the cover photo from within the album it's supposed to belong to.

-   **Evidence:** https://screenrec.com/share/CHZka9TbUy


<br>
<br>

------


### **BUG-010: [High] [Intermittent] Deleting an album can leave an orphaned photo in the main gallery**

-   **Severity:** High
-   **Priority:** High

------

-   **Summary:**
    After creating and then deleting an album, an "orphaned" photo that was part of the album can remain publicly visible in the main gallery. The user, who is the author of the photo, can no longer see this photo on their profile and therefore has no way to manage or delete it. This is a critical data integrity issue.

-   **Steps to Reproduce:**
    *This bug is intermittent and was discovered during exploratory testing. I could now recreate it a second time. The exact trigger is unknown, but the general flow is as follows:*
    -   **Log in** as a registered user.
    -   **Create** one or more albums and populate them with photos.
    -   **Navigate** to the profile page and **delete** the album(s).
    -   **Navigate** back to the main public gallery (`/main`) and observe the photos.

-   **Expected Result:**
    All photos associated with a deleted album should also be permanently deleted and should no longer be visible anywhere in the application.

-   **Actual Result:**
    An orphaned photo remains visible in the main public gallery, but it is no longer associated with the user's profile, making it impossible for the author to delete.

-   **Evidence:** https://screenrec.com/share/XvMdN7GmAu






---
## D) Search Functionality

*Issues related to the search feature's core logic, stability, and user experience, discovered during automated and exploratory testing.*

### **BUG-011: [Critical] State Corruption: Search results are inconsistent and disappear after navigating back from a photo**

-   **Severity:** Critical
-   **Priority:** High

------

-   **Steps to Reproduce:**
    -   **Navigate** to the main page (`/main`).
    -   **Perform** a search for a term that returns multiple rows of results, for example, `blue`.
    -   **Carefully observe** the initial set of results.
    -   **Scroll down** and **click** on a photo that is in the second or third row (e.g., the hurricane photo).
    -   After the photo detail page loads, **use the browser's "Back" button** or the in-app "Close" button to return to the search results page.
    -   **Observe** the search results again.

-   **Expected Result:**
    The application should return the user to the search results page, displaying the **exact same set of photos in the exact same order** as before clicking on an image. Ideally, the user's scroll position should also be preserved.

-   **Actual Result:**
    The state of the search results is lost. The page re-renders and displays a **different and often smaller subset of the original photos**. For example, after viewing the 7th photo from a set of 7, the page reloads showing only the first 4 results. The other results are gone. Repeating this process by clicking another photo and returning causes the results to change again, making the search feature completely unreliable for browsing.

-   **Evidence:** https://screenrec.com/share/UB2ONDn8eI

-   *Note: This behavior is not limited to a specific search term or photo and appears to be a systemic issue with how the application manages search state.*


<br>
<br>

------


### **BUG-012: [High] Searching for a single space corrupts the UI and displays a raw error message**

-   **Severity:** High
-   **Priority:** High

------

-   **Steps to Reproduce:**
    -   **Navigate** to the main page (`/main`).
    -   **Click** on the search icon in the header to reveal the search input.
    -   **Type** a single space character into the input field.
    -   **Press** the "Enter" key to submit the search.

-   **Expected Result:**
    The application should handle the input gracefully. Ideally, it should either ignore the search and do nothing (as it does for a completely empty search) or perform the search and display a standard "There are no photos..." message. The UI should remain in a stable, usable state without any raw error messages.

-   **Actual Result:**
    The application navigates to a broken and corrupted state (`/photo/search/%20`). Three conflicting UI elements are displayed simultaneously:
    -   A standard "There are no photos that matches search term." message.
    -   An active, infinite loading spinner below the message.
    -   A raw, unformatted server error message, **"The request is invalid."**, is displayed in the top-left corner of the content area.

-   **Evidence:** https://screenrec.com/share/0z4ou8PK2t


<br>
<br>

------


### **BUG-013: [High] Search logic incorrectly handles leading/trailing spaces, leading to wrong results**

-   **Severity:** High
-   **Priority:** Medium

------

-   **Steps to Reproduce:**
    -   **Navigate** to the main page and perform a search for a simple term, e.g., `blue`.
    -   **Observe** the number and type of results.
    -   **Navigate** back to the main page.
    -   **Perform** a new search for the same term but with leading and trailing spaces, e.g., `    blue    `.

-   **Expected Result:**
    The application should trim the whitespace from the search query before processing it. The search for `    blue    ` should produce the exact same URL (`/photo/search/blue`) and the exact same set of results as the for `blue`.

-   **Actual Result:**
    The application **fails to trim the whitespace**. It performs a literal search for the string including the spaces. The URL becomes `.../photo/search/%20%20%20%20blue%20%20%20%20`. This returns a completely different and incorrect set of results (often, all photos are returned because their descriptions contain spaces), breaking the user's intended search. Additionally, the UI handles the spaces inconsistently between the URL and the search result title.

-   **Evidence:** https://screenrec.com/share/GI1q2BfPHy


<br>
<br>

------


### **BUG-014: [Medium] Search logic is too broad (substring match), leading to irrelevant results**

-   **Severity:** Medium
-   **Priority:** Low

------

-   **Steps to Reproduce:**
-   -   **Navigate** to the main page.
    -   **Perform** a search for a common word, e.g., `red`.

-   **Expected Result:**
    The search should prioritize relevance by matching whole words. Results should primarily contain the word "red". A photo containing the word "sto**red**" should either not appear or have a much lower relevance ranking.

-   **Actual Result:**
    The search performs a simple, non-specific substring match. A search for `red` returns any photo that has the sequence of letters 'r-e-d' anywhere in its title or description. For example, it returns a photo with the word "sto**red**" with the same priority as a photo of a "red flower". This leads to a high number of irrelevant results and poor search quality for the user.

-   **Evidence:** https://screenrec.com/share/WKfb7Y84u5


<br>
<br>

------


## E) General UI/UX & Navigation

*A collection of minor to medium issues affecting the overall user experience.*

-   **BUG-015: [Medium] Clicking "Back" or "Close" from a photo detail page returns to the top of the landing page, not the previous scroll position.**
-   **BUG-016: [Low] The "scroll down" indicator on the landing page is not functional and must be clicked.**
-   **BUG-017: [Low] There is no "Scroll to Top" button for long galleries.**
-   **BUG-018: [Low] The main navigation menu for logged-in users is missing the "Close (X)" button.**
-   **BUG-019: [Low] Login form's username field has a default red border, falsely indicating an error on page load.**

