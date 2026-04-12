# 🚀 HNG Stage 0 Backend Task – API Integration & Data Processing Assessment

## 📌 Overview

This project implements a simple backend API that classifies a given name by gender using the **Genderize.io API**.

The API processes the raw response and returns a structured result, including a confidence check based on probability and sample size.

---

## 🌐 Live API

```
https://localhost:3000/api/classify?name=john
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* Axios
* CORS
* dotenv

---

## 📁 Project Structure

```
name-classification-api/
│
├── src/
│   ├── routes/
│   │   └── classify.route.js
│   ├── services/
│   │   └── genderize.service.js
│   └── utils/
│       └── helpers.js
│
├── index.js
├── package.json
├── .env
└── README.md
```

---

## 📥 Endpoint

### GET `/api/classify?name={name}`

---

## ✅ Success Response

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

## ❌ Error Responses

### 400 – Missing or Empty Name

```json
{
  "status": "error",
  "message": "Name query parameter is required"
}
```

### 422 – Invalid Name Type

```json
{
  "status": "error",
  "message": "Name must be a string"
}
```

### 422 – No Prediction Available

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

### 502 – External API Failure

```json
{
  "status": "error",
  "message": "Failed to fetch data from Genderize API"
}
```

---

## 🧠 Processing Logic

* Extracted fields from Genderize API:

  * `gender`
  * `probability`
  * `count → sample_size`

* Confidence is determined as:

  * `is_confident = true` if:

    * probability ≥ 0.7 **AND**
    * sample_size ≥ 100
  * Otherwise, `false`

* `processed_at` is dynamically generated using:

```
new Date().toISOString()
```

---

## ⚡ Performance Notes

* Response time optimized to stay under 500ms (excluding external API latency)
* Lightweight architecture ensures stability under multiple requests

---

## 🔐 CORS

CORS is enabled to allow requests from any origin:

```
Access-Control-Allow-Origin: *
```

---

## 🚀 Running Locally

### 1. Install dependencies

```
npm install
```

### 2. Start server

```
npm run dev
```

### 3. Test endpoint

```
http://localhost:3000/api/classify?name=john
```

---

## 🌍 Deployment

You can deploy using:

* Vercel
* Railway
* Heroku
* AWS

---

## 🧪 Testing Checklist

* Valid request returns correct structure
* Missing name → 400 error
* Invalid type → 422 error
* Unknown name → 422 error
* API failure → 502 error

---

## 👨‍💻 Author

FunGeek - Jeremiah Bankole
