# [Admin-Dashboard](https://eloquent-tarsier-d80fd0.netlify.app)

This project is a simple web-based user management interface with features such as pagination, search, row editing, and row deletion.

## Features

1. **Pagination:** Navigate through the user records with pagination. Each page displays 10 rows.

2. **Search:** Use the search bar to filter user records based on any property.

3. **In-place Editing:** Edit user information directly in the table. Changes are in-memory and not persistent.

4. **Row Deletion:** Delete individual rows or multiple selected rows. In-memory deletion only.

5. **Select and Delete Multiple Rows:** Use the "Select All" checkbox to select or deselect all rows on the current page. Delete all selected rows at once.

## How to Use

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/kishlaykumar07/Admin-Dashboard.git
   git
   cd Admin-Dashboard


Open the HTML File:
Open the index.html file in your preferred web browser.

Interact with the Interface:

Navigate through pages using pagination buttons.
Use the search bar to filter user records.
Edit rows in place by clicking the "Edit" button.
Delete rows individually or use the "Delete Selected" button.
Note:

Edits and deletions are in-memory and not saved permanently.
The data is fetched from the Geektrust API endpoint for demonstration purposes.

# Technologies Used
HTML
CSS
JavaScript

# Acknowledgements

User data is fetched from: [Geektrust API endpoint](https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json).

# License
This project is licensed under the MIT License - see the LICENSE.md file for details.   
