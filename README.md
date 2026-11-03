
# UnityPulse

**Where neighbours become changemakers.**

> A community-driven platform where neighbours create, join and track local social service events: winter clothes drives, blanket distributions, beach cleanups, plantations, health camps  and more.

[**Live Website**](https://unitypulse-client.vercel.app)

## About the Project

UnityPulse helps people in a neighbourhood organise and join social service events. Anyone can browse upcoming drives. Logged-in members can host their own events, join events created by others, and keep track of everything they have signed up for.

The goal is simple: make it easy for neighbours to find a good cause near them and show up together.

## Key Features

### Authentication and security
- **Email and password registration** with Name, Email, Photo URL and Password fields.
- **Password rules:** at least one uppercase letter, one lowercase letter and 6 or more characters, with a live checklist and toast messages for every rule that fails.
- **Google login** through Better Auth with a MongoDB adapter.
- **JWT-protected API.** Every private request carries a signed token that the Express server verifies, so members can only change their own data.
- **Private routes stay logged in after a reload.** A skeleton shows while the session loads, so a logged-in user is never sent back to the login page.

### Events
- **Create events** with title, description, event type (Cleanup, Plantation, Donation, Clothing, Food, Health, Education, Blood Drive, Other), thumbnail URL, location and date. Past dates are rejected, only future dates are allowed.
- **Upcoming Events page** lists only upcoming events, with live search, type filter and date sorting.
- **Event details page** is public. Visitors can read everything, and logging in is only needed to join.
- **Join and leave events** with duplicate-join protection and a live participant count.
- **Joined Events page** shows everything the user joined, sorted by event date, with Upcoming and Past sections.
- **Manage Events page** lets members update or delete only the events they created, with a confirmation dialog before deleting.
- **Profile page** to update your display name and profile photo.

### Design and experience
- **Light and dark themes** with a toggle that switches the whole interface, built with custom DaisyUI themes and colour tokens chosen for readable contrast.
- **Fully responsive** on mobile, tablet and desktop, with a mobile menu and equal-height event cards in a clean grid.
- **Loading skeletons** on every data page for a smooth experience.
- **Toasts and dialogs instead of browser alerts** for every success and error message.
- **Home page sections:** banner with search, features, 6 upcoming events from the database, a photo gallery and a newsletter section.
- **Navbar:** logo, Home, Upcoming Events, and a profile picture that shows your name on hover, opens a menu (Create Event, Manage Events, Joined Events, My Profile) and sits next to a Logout button.
- **Footer** with the new X logo, social links, quick links and contact details.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router), React 19 |
| Styling | Tailwind CSS v4, DaisyUI 5 |
| Authentication | Better Auth, MongoDB adapter, JWT plugin |
| Theming | next-themes (light and dark) |
| Icons | Lucide React |
| Backend | Express.js and MongoDB (separate repository) |
| Hosting | Vercel (client), Render (server), MongoDB Atlas (database) |

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Banner, features, 6 upcoming events, gallery, newsletter |
| `/events` | Public | All upcoming events with search, filter and sort |
| `/events/[id]` | Public | Event details and Join button (login needed to join) |
| `/login` | Public | Email/password and Google login |
| `/register` | Public | Create an account |
| `/events/create` | Private | Create a new event |
| `/events/manage` | Private | Update or delete your own events |
| `/events/[id]/edit` | Private | Edit form for one of your events |
| `/events/joined` | Private | Events you joined, sorted by date |
| `/profile` | Private | Update your name and photo |

## How Authentication Works

1. Better Auth runs inside this Next.js app. It handles registration, login and sessions, and stores them in MongoDB.
2. For every private API call, the app asks Better Auth for a short-lived **JWT**.
3. The Express server verifies the token with the public keys served at `/api/auth/jwks`.
4. The server uses the verified email to decide who created, joined, updated or deleted an event.

## Project Structure

```
client/
├── app/                    Routes (App Router), global styles, auth API route
│   ├── api/auth/[...all]/  Better Auth handler
│   ├── events/             Events pages (list, details, create, manage, joined, edit)
│   ├── login/  register/  profile/
│   └── globals.css         Themes and design tokens
├── components/
│   ├── home/               Hero, Features, Upcoming Events, Gallery, Newsletter
│   ├── views/              Page-level client components
│   └── ...                 Navbar, Footer, EventCard, EventForm, PrivateRoute
├── lib/                    Better Auth setup, API helper, validators, constants
├── public/                 Logo files
└── middleware.js           Optimistic guard for private routes
```

## Author

**Mohammod Jobair**

<div align="center">
Made with care for our neighbourhoods.
</div>