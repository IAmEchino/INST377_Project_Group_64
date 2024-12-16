# INST377_Project_Group_64

## Title: Is This ___ Real?

description: Our website allows users to authenticate the legitimancy of phone numbers, emails, and home addresses. It is made for all web browsers and should have no issues running on mobile browsers(ios/andriod) or PCs.

[Link to Developer Manual](#developer-manual-for-is-this-real-application)








# Developer Manual for Is This Real? Application

## Table of Contents
1. [Installation](#installation)
2. [Running the Application](#running-the-application)
3. [Testing](#testing)
4. [API Endpoints](#api-endpoints)
5. [Known Bugs](#known-bugs)
6. [Future Development Roadmap](#future-development-roadmap)

## Installation

### Prerequisites
- Node.js (version 14.x or later)
- npm (Node Package Manager)
- Supabase Account
- vercel 
- API Keys for:
  - NumVerify (Phone Verification)
  - EmailRep (Email Verification)
  - Smarty Streets (Address Verification)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/IAmEchino/is-this-real.git
   cd is-this-real
   ```

2. Install dependencies:
   ```bash/zsh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following(we used an index.js file):
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   PHONE_API_KEY=your_numverify_api_key
   SMARTY_AUTH_ID=your_smarty_streets_auth_id
   SMARTY_AUTH_TOKEN=your_smarty_streets_auth_token
   ```

## Running the Application

### Deployment with Vercel
- The project is configured for Vercel deployment using the `vercel.json` file
- Automatic deployments are triggered on pushes to the main branch
- Vercel provides serverless function support for the Node.js backend


### Vercel Configuration
The `vercel.json` file in the project root contains:
- Version 2 Vercel platform configuration
- Builds specified for Node.js backend
- Routes configured to direct all traffic to the main entry point

## Deployment Steps
1. Ensure you have a Vercel account (https://vercel.com)
2. Link your project to Vercel:
   ```bash
   vercel
   ```
3. Follow the prompts to deploy your application
```



### Testing Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Testing

### Running Tests
*Note: no automated tests are implemented.*

Recommended testing approach:
- Manual testing of each verification endpoint
- Use tools like Insomnia for API testing
- Implement unit and integration tests in future iterations

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

1. Rate Limiting: External APIs might have rate limits that could interrupt verification
2. No Error Handling for Invalid API Keys
3. Potential Performance Issues with Large Database

## Future Development Roadmap

### Long-Term Goals
- Develop mobile application
- Create machine learning models for enhanced verification
- Implement multi-factor verification
- Build a subscription-based service model
- Add more verification sources