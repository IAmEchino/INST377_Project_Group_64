# INST377_Project_Group_64

## Title: Is This ___ Real?

Description: Our website allows users to verify the legitimancy of phone numbers, emails, and home addresses. It is primarily designed
with PC users in mind, as it works best in landscape mode, however
it should also work without much issue on a phone.

[Link to Developer Manual](#developer-manual-for-is-this-real-application)

# Developer Manual for Is This Real? Application

## Table of Contents
1. [Installation](#installation)
2. [Running the Application](#running-the-application)
3. [Testing](#testing)
4. [API Endpoints](#api-endpoints)
5. [Known Bugs](#known-bugs)
6. [Future Development Roadmap](#future-development-roadmap)

### Prerequisites
- Node.js (version 14.x or later)
- npm (Node Package Manager)
- Supabase Account
- GitHub Account (required?)
- Vercel Account (optional)
- API Keys for:
  - NumVerify (Phone Verification)
  - EmailRep (Email Verification)
  - Smarty Streets (Address Verification)

### Steps for Installation
1. Clone the repository, then navigate to it:
   ```bash
   git clone https://github.com/IAmEchino/INST377_Project_Group_64.git
   cd /INST377_Project_Group_64
   ```
2. Install node.js
    Head to https://nodejs.org/en/download/package-manager and download the
    appropriate version of the app for your specific system

3. All dependencies are listed within the package.json file. If they
do not automatically install with the rest of the github repo, you
can install them by running `npm install [package name]`.

4. In Visual Studio, run `npm start` to initialize the web server.

5. Navigate to `http://localhost:3000` to check website functionality after startup.
When making modifications, if nodemon does not automatically refresh the web server with modifications, run `rs` (restart) to restart the server.

### Deployment with Vercel
- The project is preconfigured with support for Vercel deployment using the `vercel.json` file
- Automatic deployments are triggered on pushes to the main branch
- Vercel provides serverless function support for the Node.js backend
- Installation is standard for a Vercel-based website.

### Running Tests
*Note: no automated tests are implemented.*
We recommend running the following manual tests to check if input validation is working:

1. Input nothing, click a button and press submit.
2. Input something, but don't press a data type and then press submit
3. Input a phone number with only 10 digits, select phone, then press submit.
4. Input an address without a ZIP code.

Aside from that, all other *valid* data inputs should work.

## API Endpoints

### Physical Addresses

#### GET `/physical_addresses`
- Retrieves all physical addresses from the database
- Response: Array of address objects

#### GET `/physical_addresses/:address`
- Retrieves a specific physical address
- Parameters: Exact address string
- Response: Single address object with validation details

#### POST `/physical_address`
- Adds a new physical address to the database
- Request Body:
  ```json
  {
    "address": "string",
    "dpv_match_code": "string",
    "dpv_vacant": "boolean"
  }
  ```

### Email Addresses

#### GET `/email_addresses`
- Retrieves all email addresses from the database
- Response: Array of email address objects

#### GET `/email_addresses/:email`
- Retrieves a specific email address
- Parameters: Exact email address
- Response: Single email object with verification details

#### POST `/email_address`
- Adds a new email address to the database
- Request Body:
  ```json
  {
    "email_address": "string",
    "format": "boolean",
    "domain": "string",
    "disposable": "boolean",
    "dns": "boolean"
  }
  ```

### Phone Numbers

#### GET `/phone_numbers`
- Retrieves all phone numbers from the database
- Response: Array of phone number objects

#### GET `/phone_numbers/:phone`
- Retrieves a specific phone number
- Parameters: Exact phone number
- Response: Single phone number object with validation details

#### POST `/phone_number`
- Adds a new phone number to the database
- Request Body:
  ```json
  {
    "phone_number": "string",
    "valid": "boolean",
    "location": "string"
  }
  ```

## Known Bugs

1. Rate Limiting: External APIs have rate limits that could interrupt verification if we go over the limit
2. The address verification currently doesn't work because of an incredibly stupid limitation put in place by the API provider, which completely breaks functionality except through Google Chrome. Professor Dash said that he will accept this code as-is with no penalty as it is otherwise valid.
3. Our second intended JS library also is not working -- Professor Dash has
also said that he will not penalize us for this either.

## Future Development Roadmap
1. Fixing the bugs above would be the first thing. We had another API that we
thought might fix the problem, but we were unable to do so due to a lack of time.
2. We would then like to improve the appearance of our website. It's somewhat unattractive at the moment.