# 🚀 Profile Intelligence Service API (HNG Stage 2)

## 📌 Overview

This project is a **Profile Intelligence Service** built for Insighta Labs.

It enables clients (marketing teams, analysts, product teams) to:

* Query demographic data efficiently
* Apply advanced filters
* Sort and paginate results
* Perform natural language searches

The system integrates external APIs, stores enriched profiles in MongoDB, and exposes a powerful query engine.

---

## 🌐 Live API

```bash
https://name-classification-api.vercel.app
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Axios
* UUID v7
* CORS
* dotenv

---

## 📁 Project Structure

```
profile-intelligence-service/
│
├── src/
│   ├── config/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   └── utils/
│
├── index.js
├── seed.js
├── seed_profiles.json
├── package.json
├── .env
└── README.md
```

---

# 🟢 Stage 0 – Name Classification

## 📥 Endpoint

### GET `/api/classify?name={name}`

### ✅ Success Response

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 1,
    "sample_size": 2692560,
    "is_confident": true,
    "processed_at": "2026-04-12T10:03:13.620Z"
  }
}
```

---

# 🔵 Stage 1 – Profile Intelligence Service

## 📥 1. Create Profile

### POST `/api/profiles`

### Request Body

```json
{
  "name": "james"
}
```

---

### ✅ Success Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "019d8f68-b1b7-7484-b042-3c2d65e215ea",
    "name": "james",
    "gender": "male",
    "gender_probability": 1,
    "sample_size": 1458986,
    "age": 74,
    "age_group": "senior",
    "country_id": "US",
    "country_probability": 0.08733511114519656,
    "created_at": "2026-04-15T04:31:36.376Z"
  }
}
```

---

### 🔁 Idempotent Response (200)

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": "019d8f68-b1b7-7484-b042-3c2d65e215ea",
    "name": "james",
    "gender": "male",
    "gender_probability": 1,
    "sample_size": 1458986,
    "age": 74,
    "age_group": "senior",
    "country_id": "US",
    "country_probability": 0.08733511114519656,
    "created_at": "2026-04-15T04:31:36.376Z"
  }
}
```

---

## 📥 2. Get Profile by ID

### GET `/api/profiles/{id}`

### ✅ Success Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emmanuel",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 25,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

---

## 📥 3. Get All Profiles (with Filtering)

### GET `/api/profiles`

### Optional Query Parameters

* `gender`
* `country_id`
* `age_group`

### Example

```bash
/api/profiles?gender=male&country_id=NG
```

---

### ✅ Success Response (200)

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "john",
      "gender": "male",
      "age": 22,
      "age_group": "adult",
      "country_id": "US"
    },
  ]
}
```

---

## 📥 4. Delete Profile

### DELETE `/api/profiles/{id}`

### ✅ Success Response

```
204 No Content
```

---


# ❌ Error Responses

### 400 – Missing Name

```json
{
  "status": "error",
  "message": "Name is required"
}
```

### 422 – Invalid Type

```json
{
  "status": "error",
  "message": "Name must be a string"
}
```

### 404 – Not Found

```json
{
  "status": "error",
  "message": "Profile not found"
}
```

### 502 – External API Error

```json
{
  "status": "error",
  "message": "Genderize returned an invalid response"
}
```

---

# 🧠 Processing Logic

### Genderize

* Extract:

  * `gender`
  * `probability → gender_probability`
  * `count → sample_size`

### Agify

* Extract:

  * `age`
* Classify:

  * 0–12 → child
  * 13–19 → teenager
  * 20–59 → adult
  * 60+ → senior

### Nationalize

* Extract country list
* Select highest probability:

  * `country_id`
  * `country_probability`

---

# 💾 Data Persistence

* MongoDB used for persistent storage
* Each record includes:

  * UUID v7 identifier
  * Processed API data
  * ISO 8601 timestamp

---

# 🔁 Idempotency

* Same name submission does not create duplicates
* Existing profile is returned instead

---

# ⚡ Performance Notes

* External API calls executed in parallel (`Promise.all`)
* Efficient querying with MongoDB
* Designed to handle multiple requests reliably

---


# 🧠 Core Features

## 1. Advanced Filtering

Supports combinable filters:

* `gender`
* `age_group`
* `country_id`
* `min_age`, `max_age`
* `min_gender_probability`
* `min_country_probability`

All filters are applied together using MongoDB query objects.

---

## 2. Sorting

Supported fields:

* `age`
* `created_at`
* `gender_probability`

Order:

* `asc` (default)
* `desc`

---

## 3. Pagination

* `page` (default: 1)
* `limit` (default: 10, max: 50)

Efficient pagination implemented using:

```
skip = (page - 1) * limit
```

---

## 4. Natural Language Search (Core Feature)

### Endpoint

```
GET /api/profiles/search?q=<query>
```

---

## 🧠 Parsing Approach

The system uses a **rule-based parser** (no AI/LLMs) to convert plain English queries into structured filters.

### Steps:

1. Convert query to lowercase
2. Extract keywords using string matching and regex
3. Map keywords to filter fields
4. Build a MongoDB query object

---

## 🔑 Supported Keywords & Mappings

### Gender

| Keyword | Filter        |
| ------- | ------------- |
| male    | gender=male   |
| female  | gender=female |

---

### Age Groups

| Keyword         | Filter             |
| --------------- | ------------------ |
| child           | age_group=child    |
| teenager / teen | age_group=teenager |
| adult           | age_group=adult    |
| senior          | age_group=senior   |

---

### Age Conditions

| Query    | Filter     |
| -------- | ---------- |
| above 30 | min_age=30 |
| below 25 | max_age=25 |

Regex used:

```
/above (\d+)/
/below (\d+)/
```

---

### Special Keyword

| Keyword | Mapping                |
| ------- | ---------------------- |
| young   | min_age=16, max_age=24 |

> Note: "young" is not stored in DB — used only during parsing

---

### Country Mapping

Country names and demonyms are mapped to ISO codes using a lookup dictionary.

Examples:

| Input                    | Output |
| ------------------------ | ------ |
| nigeria / nigerian       | NG     |
| kenya / kenyan           | KE     |
| united states / american | US     |
| uk / british             | GB     |

---

## 🧪 Example Queries

| Query                  | Parsed Filters                              |
| ---------------------- | ------------------------------------------- |
| young males            | gender=male, min_age=16, max_age=24         |
| females above 30       | gender=female, min_age=30                   |
| people from angola     | country_id=AO                               |
| adult males from kenya | gender=male, age_group=adult, country_id=KE |
| teenagers below 18     | age_group=teenager, max_age=18              |

---

## ❌ Invalid Query Handling

If a query cannot be interpreted:

```json
{
  "status": "error",
  "message": "Unable to interpret query"
}
```

---

# 📥 API Endpoints

## 1. GET /api/profiles

Supports filtering, sorting, and pagination.

### Example

```
/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10
```

---

## 2. GET /api/profiles/search

Natural language query endpoint.

```
/api/profiles/search?q=young males from nigeria
```

---

## 3. GET /api/profiles/{id}

Fetch a single profile by ID.

---

## 4. DELETE /api/profiles/{id}

Deletes a profile.

Returns:

```
204 No Content
```

---

# 💾 Data Model

Each profile contains:

* `id` (UUID v7)
* `name` (unique)
* `gender`
* `gender_probability`
* `age`
* `age_group`
* `country_id`
* `country_name`
* `country_probability`
* `created_at`

---

# 🌱 Data Seeding

Database is seeded with 2026 profiles using:

```bash
npm run seed
```

* Uses upsert to prevent duplicates
* Ensures idempotency

---

# ⚠️ Limitations

The parser is intentionally simple and rule-based.

### Known Limitations:

* Does not handle complex grammar

  * e.g., "males younger than females over 30"
* Cannot interpret synonyms beyond defined keywords

  * e.g., "guys" instead of "male"
* Limited demonym coverage for some countries
* Does not support multi-condition logic like:

  * "male OR female"
* Relies on keyword presence, not sentence structure
* Does not detect misspellings

---

# ⚡ Performance Considerations

* MongoDB indexing used for fast queries
* Filtering handled at database level (no full-table scans)
* Pagination prevents large data loads
* External API calls are not used in query endpoints

---


# 🔐 CORS

```
Access-Control-Allow-Origin: *
```

---

# 🚀 Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 3. Start server

```bash
npm run dev
```

---

# 🌍 Deployment

Supported platforms:

* Vercel
* Railway
* AWS
* Heroku

---

# 🧪 Testing Checklist

* Create profile successfully
* Duplicate name returns existing record
* Fetch by ID works
* Filtering works correctly
* Delete endpoint works
* Error cases handled correctly

---

# 👨‍💻 Author

FunGeek – Jeremiah Bankole
