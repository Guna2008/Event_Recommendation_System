# Event Recommendation System

An intelligent event discovery and recommendation platform that helps users discover events based on their skills, interests, preferred event type, and preferred mode.

The system combines a web-based frontend, backend APIs, database integration, and a machine learning recommendation engine to provide personalized event recommendations.

---

## Features

- User profile with skills and interests
- Preferred event type and event mode
- Event discovery and search
- Event details
- Personalized event recommendations
- Relevance-based event ranking
- User event history and feedback
- Top 20 recommended events

---

## System Architecture

```text
                    EVENT RECOMMENDATION SYSTEM
                              |
        ------------------------------------------------
        |                     |                        |
     FRONTEND              BACKEND              RECOMMENDATION
        |                     |                     ENGINE
        |                     |                        |
   Home / Explore        Node.js API              K-Means
   Search               Event APIs              Clustering
   Event Details        User APIs                   |
   Profile              Database Integration        |
        |                     |                  Event Matching
        |                     |                        |
        ----------------------|------------------------
                              |
                         PostgreSQL
                           Database