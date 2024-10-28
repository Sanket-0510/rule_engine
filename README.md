# Zeotap Rule Engine API

This project is the backend API for the Zeotap Rule Engine. You can set it up using Docker for a containerized environment or locally by installing the necessary dependencies.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v11 or higher)

## Setup Instructions

### 1. Docker Setup

You can set up the entire project using Docker, which includes PostgreSQL and the Node.js application in one containerized environment.




#### Step 1: Clone the Repository
```bash
git clone https://github.com/Sanket-0510/zeotap_rule_engine.git
cd zeotap_rule_engine

cd server 

docker build -t rule_engine .

```
the above command will build the rule_engine docker image.


```bash 

docker run -p 8000:8000 rule_engine
```
we have mapped the port 8000::8000 as the server is running onto port 8000

Now you can refer to the postman collection to trigger the server API's
