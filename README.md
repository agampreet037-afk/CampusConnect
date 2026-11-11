# CampusConnect – Discover Your People

> **Find your people. Share your passions. Build something together.**

CampusConnect is an interest-based student discovery and networking web platform designed specifically for college and university campuses. Built with React, TypeScript, Vite, and Tailwind CSS.

---

## 🌟 Primary Objectives

College campuses are packed with talent, curiosity, and drive, but students often struggle to find peers outside their immediate classrooms. 
CampusConnect solves this:
- **Coders & Builders**: Connect with hackathon partners, AI/ML researchers, and full-stack builders.
- **Athletes & Fitness Enthusiasts**: Form weekend turf football matches, badminton duos, and morning running groups.
- **Creatives & Performers**: Match with UI/UX designers, photographers, acoustic vocalists, and filmmakers.
- **Entrepreneurs & Dreamers**: Discover technical co-founders, market strategists, and startup teammates.

---

## 🧠 Dynamic Compatibility Algorithm

CampusConnect calculates real-time compatibility scores rather than relying on hardcoded percentages:

| Component | Weight | Description |
| :--- | :--- | :--- |
| **Shared Interests** | **45%** | Matches overlapping passions across Tech, Sports, Arts, Business, and Campus Hobbies. |
| **Shared Skills** | **25%** | Evaluates technical and creative skill overlaps and complementary abilities. |
| **Goal Alignment** | **20%** | Rewards aligned campus intentions (e.g., hackathons, project collaborations, sports). |
| **Academic Context** | **10%** | Factors shared college campus or departmental proximity. |

Every match card dynamically produces an explanatory narrative explaining *why* the student is recommended.

---

## 🚀 Key Features

1. **Attractive Landing Page**
   - High-conversion hero with campus value proposition.
   - Interactive interest categories showcase.
   - Demonstration campus stats (1,400+ students, 35+ communities, 250+ projects).
   - Sample student testimonials.

2. **4-Step Student Onboarding**
   - Basic Info (College, Department, Academic Year, Bio, Avatar selection).
   - Multi-category interest selection.
   - Skills & proficiency levels (Beginner, Intermediate, Advanced, Expert).
   - Campus goals & personalized request pitches.
   - Confetti celebration on completion!

3. **Home Dashboard**
   - Personalized time-aware greeting.
   - Profile completion progress meter.
   - Highest-affinity recommended peers.
   - Upcoming activity circles.
   - Trending campus interests & clubs.

4. **Discover Students Directory**
   - Instant search by name, skill, interest, or department.
   - Advanced multi-faceted filtering (Interests, Department, Year, Goals).
   - Dynamic sorting: Highest Compatibility, Most Shared Passions, Name, Year.
   - Grid and compact list views.
   - Interactive profile detail modal with full mathematical compatibility breakdown.

5. **Campus Communities (Clubs)**
   - Discover and join interest societies (AI/ML, Football, Photography, Music, Startups, Design).
   - Community message board with likes & comments.
   - Create and post discussions.
   - Community event schedules with interactive RSVP tracking.
   - Create your own community.

6. **Activity Circles**
   - Micro-gatherings for specific campus activities (e.g., 5v5 Sunday football, hackathon teams, photo walks).
   - Live spot counter (e.g., 3/4 filled).
   - Date, time, location, and host tags.
   - Create and join circles with instant feedback.

7. **Network & Connections Hub**
   - Manage incoming connection requests (Accept / Decline).
   - Track sent connection requests with cancellation support.
   - View active network peers and initiate chats.
   - Bookmark / Saved student profiles.

8. **Simulated Messaging**
   - Responsive split-screen chat interface.
   - Icebreaker suggestion chips.
   - Instant local storage persistence and automated peer simulation for demonstrations.

9. **Demo Mode & Hackathon Presentation Toolkit**
   - Switch active student personas (test the matching algorithm from different students' perspectives!).
   - One-click "Reset Demo Data" to restore 20+ profiles and communities.
   - Safety, reporting, and blocking demonstration controls.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Celebration Effects**: canvas-confetti
- **Storage**: Browser LocalStorage with fallback seeding

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run lint
```

---

## 📄 License

Apache-2.0
