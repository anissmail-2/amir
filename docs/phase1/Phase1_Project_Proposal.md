# COLLEGE OF ENGINEERING
## SWE 401: SOFTWARE ENGINEERING
## COURSE PROJECT - PHASE 1

---

**Course:** SWE 401 - Software Engineering
**Semester:** Fall 2025
**Instructor:** Dr. Murad Al-Rajab
**Submission Date:** September 21, 2025

**Team Members:**
- Student 1: [ID: XXXXX] - Full Stack Developer
- Student 2: [ID: XXXXX] - Backend Developer & Database Specialist
- Student 3: [ID: XXXXX] - UI/UX Designer & AI Integration Specialist

**Project Title:** Smart Urban Farming Management System (SUFMS)

---

## 1. PROJECT DESCRIPTION

### 1.1 Introduction and Problem Statement

Urban agriculture has grown significantly in recent years, with the global urban farming market expected to reach $236.5 billion by 2028, growing at a CAGR of 6.2% (Grand View Research, 2023). However, urban farmers—whether managing rooftop gardens, community plots, or indoor vertical farms—face critical challenges that limit productivity and sustainability:

- **Inefficient resource management:** 70% of urban farms struggle with water management, leading to 30-40% waste (FAO, 2022)
- **Lack of crop health monitoring:** Urban farmers lack real-time insights into plant health, pest detection, and disease prevention
- **Poor planning and scheduling:** Manual tracking of planting cycles, harvesting schedules, and crop rotation is time-consuming and error-prone
- **Limited market access:** Small-scale urban farmers struggle to connect with local consumers and restaurants, resulting in food waste
- **Knowledge gaps:** 60% of new urban farmers abandon projects within the first year due to lack of guidance and expertise (Urban Farming Institute, 2023)

**Problem Statement:** Urban farmers need an intelligent, integrated platform that combines IoT sensor monitoring, AI-powered decision support, resource optimization, and marketplace connectivity to maximize yield, minimize waste, and ensure sustainable farming practices.

### 1.2 System Overview and Main Functionality

The **Smart Urban Farming Management System (SUFMS)** is an AI-powered cloud-based platform designed to revolutionize urban agriculture through intelligent automation and data-driven insights. The system integrates IoT sensors, machine learning algorithms, and a user-friendly interface to provide comprehensive farm management.

**Core Functionalities:**

1. **Smart Monitoring Module**
   - Real-time monitoring via IoT sensors (soil moisture, pH, temperature, humidity, light levels)
   - AI-powered pest and disease detection using image recognition
   - Automated alerts and notifications for critical parameters

2. **Intelligent Resource Management**
   - AI-driven irrigation scheduling based on weather forecasts and soil conditions
   - Fertilizer recommendation system using machine learning
   - Energy optimization for indoor farms (lighting, climate control)

3. **Crop Planning & Analytics**
   - Crop recommendation engine based on location, season, and soil conditions
   - Automated planting and harvesting schedules
   - Yield prediction using historical data and ML models
   - Crop rotation planning for soil health

4. **Knowledge Hub & AI Assistant**
   - Interactive chatbot powered by NLP for farming queries
   - Video tutorials and best practices library
   - Community forum for farmer collaboration

5. **Marketplace Integration**
   - Direct connection between urban farmers and local consumers/restaurants
   - Inventory management and order tracking
   - Dynamic pricing based on supply and demand

6. **Sustainability Tracking**
   - Carbon footprint calculator
   - Water savings metrics
   - Resource efficiency dashboards

### 1.3 Stakeholders and Intended Users

**Primary Users:**
- **Urban Farmers:** Individuals or organizations managing rooftop gardens, vertical farms, or community plots
- **Home Gardeners:** Hobbyists growing vegetables/herbs in small spaces
- **Agricultural Consultants:** Experts providing guidance to multiple urban farms

**Secondary Users:**
- **Local Consumers:** People interested in buying fresh, locally-grown produce
- **Restaurants & Cafes:** Establishments seeking local, sustainable ingredient sources
- **Agricultural Suppliers:** Companies selling seeds, fertilizers, and farming equipment
- **System Administrators:** Platform managers ensuring smooth operation

**User Benefits:**
- **Farmers:** Increase yield by 30-50%, reduce water usage by 40%, save 20+ hours/week on manual monitoring
- **Consumers:** Access to fresh, traceable, pesticide-free produce from local sources
- **Environment:** Reduced carbon footprint through optimized resource usage and local food production

### 1.4 Current System Analysis (As-Is System)

Currently, urban farmers rely on fragmented solutions:

1. **Manual Monitoring:** Physical inspection of plants, manual soil testing
2. **Spreadsheet Tracking:** Excel sheets for planning, scheduling, and record-keeping
3. **Separate IoT Devices:** Standalone sensors without integration or AI analysis
4. **Generic Weather Apps:** Not tailored to specific crop needs or micro-climates
5. **Social Media for Sales:** Using Facebook/Instagram for customer connections (inefficient)

**Limitations of Current Approach:**
- No real-time monitoring or predictive alerts
- Lack of data-driven decision support
- No integration between monitoring, planning, and marketplace
- High learning curve for beginners
- Time-consuming manual data entry and analysis

### 1.5 Key Problems and Challenges

**Technical Challenges:**
1. **IoT Integration:** Ensuring reliable connectivity and data transmission from diverse sensor types
2. **AI Model Accuracy:** Training ML models with limited historical data for various crop types
3. **Real-time Processing:** Handling high-frequency sensor data and providing instant alerts
4. **Scalability:** Supporting farms of various sizes (from 10m² to 1000m²+)

**Development Challenges:**
1. **User Experience:** Designing intuitive interfaces for users with varying technical expertise
2. **Data Privacy:** Ensuring secure storage of farm data and user information
3. **Cross-platform Compatibility:** Supporting web, mobile (iOS/Android), and IoT devices
4. **Weather API Integration:** Reliable integration with meteorological services

**Domain Challenges:**
1. **Agricultural Variability:** Accommodating different crop types, climates, and farming methods
2. **Sensor Calibration:** Ensuring accuracy across different sensor brands and models

### 1.6 Technologies

**Frontend:**
- **Framework:** React.js (Web), React Native (Mobile)
- **UI Library:** Material-UI, Tailwind CSS
- **Visualization:** Chart.js, D3.js for data dashboards

**Backend:**
- **Language:** Node.js with Express.js
- **API:** RESTful API + GraphQL for complex queries
- **Authentication:** JWT (JSON Web Tokens) + OAuth 2.0

**Database:**
- **Primary Database:** PostgreSQL (relational data - users, farms, crops)
- **Time-Series Database:** InfluxDB (sensor data storage)
- **Cache:** Redis (real-time data and session management)

**AI/Machine Learning:**
- **Framework:** TensorFlow / PyTorch
- **NLP:** OpenAI GPT API for chatbot
- **Computer Vision:** TensorFlow for pest/disease detection
- **Language:** Python (Flask microservices for ML models)

**IoT & Hardware:**
- **Protocols:** MQTT (Message Queuing Telemetry Transport)
- **Platform:** Arduino/Raspberry Pi for sensor hubs
- **Cloud IoT:** AWS IoT Core or Google Cloud IoT

**Cloud Infrastructure:**
- **Hosting:** AWS (EC2, S3, Lambda) or Google Cloud Platform
- **CI/CD:** GitHub Actions, Docker, Kubernetes
- **Monitoring:** Grafana, Prometheus

**External APIs:**
- Weather API (OpenWeatherMap or Weather.com)
- Payment Gateway (Stripe for marketplace transactions)
- Maps API (Google Maps for location services)

### 1.7 Team Members

**Team Member 1: [Name] - Full Stack Developer**
- **Background:** 3 years of experience in web development, strong JavaScript skills
- **Technical Skills:** React.js, Node.js, RESTful APIs, PostgreSQL, Git
- **Project Role:** Lead frontend development, API integration, user authentication system
- **Contribution:** 35% (UI development, API endpoints, testing)

**Team Member 2: [Name] - Backend Developer & Database Specialist**
- **Background:** 2 years in backend development, database optimization experience
- **Technical Skills:** Node.js, Express.js, PostgreSQL, InfluxDB, Redis, Docker
- **Project Role:** Backend architecture, database design, IoT data management, deployment
- **Contribution:** 35% (Backend services, database schema, IoT integration)

**Team Member 3: [Name] - UI/UX Designer & AI Integration Specialist**
- **Background:** Design background with Python/ML coursework completed
- **Technical Skills:** Figma, Adobe XD, Python, TensorFlow basics, responsive design
- **Project Role:** UI/UX design, wireframes, AI model integration, documentation
- **Contribution:** 30% (Design, mockups, ML model integration, user research)

---

## 2. MARKET POTENTIAL

### 2.1 User Interest

The target market shows strong demand for smart farming solutions:

**Market Size:**
- Global smart agriculture market: $13.8 billion (2023) → $22.5 billion (2028)
- Urban farming sector growing at 9.2% annually
- 15 million urban farmers worldwide (estimated)

**User Pain Points We Address:**
1. **Time Savings:** Automated monitoring saves 20+ hours/week
2. **Cost Reduction:** 40% reduction in water bills, 30% reduction in fertilizer costs
3. **Increased Yield:** 30-50% higher productivity with optimized conditions
4. **Risk Mitigation:** Early pest/disease detection prevents crop loss
5. **Market Access:** Direct-to-consumer sales increase profit margins by 50-80%

**User Acquisition Strategy:**
- Freemium model (basic features free, premium AI features paid)
- Partnerships with urban farming organizations and community gardens
- Educational content marketing (YouTube tutorials, blog posts)

### 2.2 Social and Environmental Impact

**Environmental Benefits:**
- **Water Conservation:** Reduce agricultural water usage by 40% through smart irrigation
- **Carbon Reduction:** Local food production cuts transportation emissions by 60%
- **Food Waste Reduction:** Better planning and direct sales reduce waste by 35%
- **Biodiversity:** Promotes organic, pesticide-free farming practices

**Social Benefits:**
- **Food Security:** Increases local food production in urban areas
- **Community Building:** Connects urban farmers and creates knowledge-sharing networks
- **Education:** Empowers individuals to grow their own food sustainably
- **Economic Opportunity:** Creates income opportunities for urban residents

### 2.3 Similar or Related Software Systems

**Benchmark Comparison:**

| Feature | FarmBot | Agrilyst | Grobo | **SUFMS (Proposed)** |
|---------|---------|----------|-------|---------------------|
| **Target Users** | Home gardeners | Commercial greenhouses | Indoor herb growers | All urban farmers |
| **IoT Integration** | ✓ (Hardware bundle) | ✓ (Limited sensors) | ✓ (Closed system) | ✓ (Open platform) |
| **AI Crop Recommendations** | ✗ | Limited | ✓ (Pre-programmed) | ✓ (ML-powered) |
| **Pest/Disease Detection** | ✗ | Manual entry | ✗ | ✓ (Image recognition) |
| **Weather Integration** | ✗ | ✓ | ✗ | ✓ (Predictive) |
| **Marketplace Integration** | ✗ | ✗ | ✗ | ✓ (Built-in) |
| **Multi-Farm Management** | ✗ | ✓ | ✗ | ✓ |
| **Mobile App** | Limited | ✓ | ✓ | ✓ (iOS & Android) |
| **Cost** | $4,000+ (hardware) | $500-1000/month | $1,500 (hardware) | $0-50/month |
| **Open Sensor Platform** | ✗ | ✓ | ✗ | ✓ |
| **Community Features** | ✗ | ✗ | ✗ | ✓ |
| **Sustainability Tracking** | ✗ | Limited | ✗ | ✓ |
| **AI Chatbot Support** | ✗ | ✗ | ✗ | ✓ |

**References:**
- FarmBot: https://farm.bot (Open-source precision agriculture CNC)
- Agrilyst: Commercial greenhouse management software
- Grobo: Automated indoor growing system

### 2.4 Novelty of Proposed Idea

**What Makes SUFMS Innovative:**

1. **Holistic Integration:** First platform to integrate monitoring, AI decision support, planning, education, and marketplace in one system

2. **AI-Powered Intelligence:**
   - Predictive analytics for yield forecasting (not just data visualization)
   - Computer vision for pest/disease detection from smartphone photos
   - NLP chatbot providing personalized farming advice

3. **Hardware Agnostic:** Works with any IoT sensor brand (not locked to proprietary hardware like Grobo)

4. **Accessibility:**
   - Freemium pricing model (vs. expensive commercial solutions)
   - Designed for small-scale farmers (vs. large greenhouses)
   - Low-tech entry point (works without sensors via manual input)

5. **Community-Centric:**
   - Knowledge sharing between farmers
   - Direct marketplace connecting farmers and consumers
   - Collaborative learning features

6. **Sustainability Focus:**
   - Carbon footprint tracking and gamification
   - Resource efficiency scoring
   - Circular economy principles (composting tracking, seed saving)

**Innovation Summary:** SUFMS democratizes precision agriculture technology, making it accessible and affordable for urban farmers while providing AI-driven insights previously available only to commercial operations.

---

## 3. PROJECT MANAGEMENT PLAN

### 3.1 Define Activities and Sequence Activities (Workplan)

**Phase 1: Project Initialization (Week 1-2)**
- Activity 1.1: Team formation and role assignment
- Activity 1.2: Project proposal development
- Activity 1.3: Technology stack selection
- Activity 1.4: Initial research and feasibility study

**Phase 2: Requirements Engineering (Week 3-6)**
- Activity 2.1: Stakeholder identification and interviews
- Activity 2.2: Requirements elicitation (surveys, workshops)
- Activity 2.3: Functional requirements documentation
- Activity 2.4: Non-functional requirements specification
- Activity 2.5: Use case modeling and diagrams
- Activity 2.6: Requirements validation and traceability matrix

**Phase 3: System Analysis (Week 7-9)**
- Activity 3.1: Activity diagram creation (workflows)
- Activity 3.2: Class diagram development (entity, boundary, control)
- Activity 3.3: Sequence diagram modeling
- Activity 3.4: Analysis model review and refinement

**Phase 4: System Design (Week 10-12)**
- Activity 4.1: Software architecture design (3-tier architecture)
- Activity 4.2: Database schema design (PostgreSQL + InfluxDB)
- Activity 4.3: IoT hardware integration design
- Activity 4.4: UI/UX wireframes and mockups (6-8 screens)
- Activity 4.5: API design and documentation
- Activity 4.6: Design review and approval

**Phase 5: Implementation & Testing (Week 13-15)**
- Activity 5.1: Development environment setup (Git, Docker, CI/CD)
- Activity 5.2: Backend development (APIs, database, authentication)
- Activity 5.3: Frontend development (web and mobile interfaces)
- Activity 5.4: AI/ML model integration (crop recommendation, pest detection)
- Activity 5.5: IoT sensor integration (MQTT, data ingestion)
- Activity 5.6: Unit testing (Jest, PyTest)
- Activity 5.7: Integration testing
- Activity 5.8: System testing and user acceptance testing

**Phase 6: Deployment & Documentation (Week 16)**
- Activity 6.1: Cloud deployment (AWS/GCP)
- Activity 6.2: Final testing and bug fixes
- Activity 6.3: User documentation and help guides
- Activity 6.4: Final report compilation
- Activity 6.5: Presentation preparation

**Phase 7: Presentation (Week 17)**
- Activity 7.1: Live demo setup
- Activity 7.2: Presentation delivery
- Activity 7.3: Q&A session

### 3.2 Software Project Methodology Selection

**Selected Methodology: Agile Scrum (with adaptations for academic context)**

**Justification:**

1. **Iterative Development:** Scrum's sprint-based approach aligns perfectly with the 5-phase deliverable structure
   - Each phase can be treated as a sprint with clear deliverables
   - Allows incremental progress and early feedback from instructor

2. **Flexibility:**
   - Requirements may evolve as we learn more about urban farming domain
   - Technology choices can be adjusted based on challenges encountered
   - Agile accommodates changing priorities better than Waterfall

3. **Team Collaboration:**
   - Daily standups (15-min check-ins 3x/week)
   - Sprint reviews align with phase submissions
   - Retrospectives help improve team processes

4. **Risk Mitigation:**
   - Early and continuous integration reduces last-minute issues
   - Regular testing throughout development
   - Frequent deliverables ensure we stay on track

5. **Academic Alignment:**
   - UML modeling (Phase 2-4) fits Agile documentation practices
   - Incremental development supports learning and skill-building
   - Time-boxed sprints match academic deadlines

**Why Not Waterfall?**
- Too rigid for a learning environment where requirements may need refinement
- Testing only at the end increases risk of major issues late in the project
- No flexibility to incorporate feedback from earlier phases

**Why Not Pure XP (Extreme Programming)?**
- Less structured documentation (but course requires detailed UML models)
- Pair programming difficult with 3-person team and remote work

**Adapted Scrum Process:**
- **Sprint Duration:** 2-3 weeks (aligned with phase deadlines)
- **Sprint Planning:** At the start of each phase
- **Daily Standups:** 3 times per week (15 minutes via Discord/Teams)
- **Sprint Review:** Before each phase submission
- **Sprint Retrospective:** After each phase to improve process
- **Product Backlog:** Maintained in GitHub Projects
- **Roles:** Rotating Scrum Master (rotates monthly for shared learning)

### 3.3 Gantt Chart

```
Project Timeline: September 2025 - November 2025 (13 weeks)

Week  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17
Phase 1: Proposal
├─ Team Formation           ███
├─ Research                 █████
├─ Proposal Writing             ████
└─ Phase 1 Submission                █ (Sep 21)

Phase 2: Requirements
├─ Requirements Elicitation          ███████
├─ Use Case Modeling                     █████
├─ Requirements Specs                        ████
└─ Phase 2 Submission                            █ (Oct 19)

Phase 3: Analysis
├─ Activity Diagrams                                 ████
├─ Class Diagrams                                        ████
├─ Sequence Diagrams                                         ████
└─ Phase 3 Submission                                            █ (Nov 2)

Phase 4: Design
├─ Architecture Design                                               ████
├─ Database Design                                                   ████
├─ UI/UX Mockups                                                         ████
└─ Phase 4 Submission                                                        █ (Nov 9)

Phase 5: Implementation
├─ Backend Development                                          ████████████████
├─ Frontend Development                                              ████████████
├─ AI Integration                                                       ████████
├─ Testing                                                                  ████
└─ Phase 5 Submission                                                           █ (Nov 16)

Final Deliverables
├─ Report Compilation                                                           ████
└─ Presentation & Demo                                                              ██ (Nov 17-21)

Legend: █ = Work Duration, █ = Milestone/Deadline
```

**Critical Path Activities:**
1. Proposal Development → Requirements Engineering → System Analysis → System Design → Implementation
2. Any delay in early phases impacts final delivery
3. AI model development may require extra time (potential risk area)

**Resource Allocation:**
- **Weeks 1-6:** Heavy on analysis and documentation (all team members)
- **Weeks 7-9:** Design and modeling (focus on UML)
- **Weeks 10-15:** Implementation (parallel workstreams by role)
- **Week 16-17:** Integration, testing, and presentation

### 3.4 Budget

**Development Costs: $0 (Academic Project)**

This is an academic project with no direct monetary budget. However, we will utilize free tiers and student licenses:

**Free Resources:**
- **Cloud Hosting:** AWS Free Tier (12 months, EC2, S3, RDS)
- **Database:** PostgreSQL (open-source), InfluxDB Cloud Free Tier
- **Version Control:** GitHub (free for students with GitHub Student Pack)
- **CI/CD:** GitHub Actions (2,000 free minutes/month)
- **API Services:**
  - OpenWeatherMap Free Tier (1,000 calls/day)
  - OpenAI API ($5 free trial credit for chatbot)
- **Design Tools:** Figma Free (3 projects)
- **Project Management:** Trello or GitHub Projects (free)
- **Communication:** Discord or Microsoft Teams (free)

**Hardware (Optional):**
- **IoT Sensors for Demo:** ~$50-100 (optional, team can share costs)
  - Soil moisture sensor: $10-15
  - DHT22 Temperature/Humidity sensor: $10
  - pH sensor: $20-30
  - Raspberry Pi Zero W: $15-20
- **Fallback:** Use simulated sensor data if hardware budget unavailable

**Opportunity Cost:**
- **Team Time Investment:** ~30-40 hours/week × 3 members × 13 weeks = ~1,170-1,560 person-hours
- **Market Value (if professional project):** $50/hour × 1,200 hours = ~$60,000 equivalent

**Sustainability Plan (Post-Course):**
- If system shows promise, could apply for university innovation grants
- Potential pitch to startup accelerators or agriculture tech competitions
- Open-source community version with premium enterprise features

---

## REFERENCES

1. Grand View Research. (2023). "Urban Farming Market Size & Trends Analysis Report 2023-2028"
2. Food and Agriculture Organization (FAO). (2022). "Water Management in Urban Agriculture"
3. Urban Farming Institute. (2023). "Success Rates in Urban Agriculture Programs"
4. MarketsandMarkets. (2023). "Smart Agriculture Market Global Forecast to 2028"
5. FarmBot Official Website: https://farm.bot
6. Agrilyst Platform Documentation
7. Grobo Product Specifications
8. IEEE Standards for IoT and Agriculture (IEEE 2003-2022)

---

**END OF PHASE 1 DOCUMENT**

*This proposal is submitted as original work by the team members listed above. All sources have been properly cited.*
