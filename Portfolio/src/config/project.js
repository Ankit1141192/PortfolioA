import Project_1 from "../assets/todoist.png";
import Project_2 from "../assets/trafficIssue.png";
import Project_3 from "../assets/Homorax.png";
import Project_4 from "../assets/LinkedinClone.png";
import Project_5 from "../assets/Shopnetic.jpeg";
import Project_6 from "../assets/portfolio-7.png";
import Project_7 from "../assets/StopWatch2.jpg";
import Project_8 from "../assets/ChargeGrid.png";
import Project_9 from "../assets/Skillup.png";
import Project_10 from "../assets/Varnavelocity1.png";
import Project_11 from "../assets/jeevaloop.png";
import Project_12 from "../assets/vibesync.png"
import Project_13 from "../assets/boundDesk.png";

export const projects = [
    {
        id: 1,
        title: "Todoist Clone",
        description: "A productivity app to manage your tasks efficiently.",
        technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
        image: Project_1,
        liveUrl: "https://bright-cendol-1e0307.netlify.app",
        githubUrl: "https://github.com/Ankit1141192/todoistConstructWeak",
        category: "web",
        featured: true,
    },
    {
        id: 2,
        title: "TraffIssue",
        description: "A platform for citizens to report traffic problems.",
        technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
        image: Project_2,
        liveUrl: "https://4347-hackthon.netlify.app",
        githubUrl: "https://github.com/Sadafff19/Team_4347_hackathon",
        category: "web",
        featured: false,
    },
    {
        id: 4,
        title: "Stayver",
        description: "A hotel booking platform with a user-friendly interface.",
        technologies: ["React+Vite", "TailwindCSS", "ClerkAuth"],
        image: Project_6,
        liveUrl: "https://stayver.vercel.app/",
        githubUrl: "https://github.com/Ankit1141192/QuickStay",
        category: "web",
        featured: true,
    },
    {
        id: 5,
        title: "Homorax",
        description: "An ecommerce platform for modern shopping experiences.",
        technologies: ["React", "CSS", "ChakraUI", "Firebase Authentication"],
        image: Project_3,
        liveUrl: "#",
        githubUrl: "https://github.com/Ankit1141192/The-Coding-Crusaders",
        category: "web",
        featured: false,
    },
    {
        id: 6,
        title: "Shopnetic",
        description: "A mobile-friendly online store with advanced features.",
        technologies: ["React Native", "JavaScript", "Expo", "FirebaseAuth", "AsyncStorage"],
        image: Project_5,
        githubUrl: "https://github.com/Ankit1141192/ReactNativeProject",
        liveUrl: "https://expo.dev/accounts/ankit11411920/projects/Shopnetic/builds/af055e29-b510-47eb-9b90-a031ab369399",
        category: "mobile",
        featured: true,
    },
    {
        id: 7,
        title: "StopWatch",
        description: "A simple stopwatch app built with React Native.",
        technologies: ["React Native", "JavaScript", "Expo", "AsyncStorage"],
        image: Project_7,
        liveUrl: "https://expo.dev/accounts/ankit11411920/projects/StopWatch/builds/4ca2aa57-b1a3-4f80-8b23-c94a7ee20991",
        githubUrl: "https://github.com/Ankit1141192/StopWatch-Timer-App",
        category: "mobile",
        featured: false,
    },
    // {
    //   id: 8,
    //   title: "ChargeGrid",
    //   description:
    //     "ChargeGrid is a React Native CLI mobile application built to help electric vehicle (EV) users find distance between two points.",
    //   technologies: ["React Native", "JavaScript", "AsyncStorage", "CLI", "Map"],
    //   image: Project_8,
    //   githubUrl: "https://github.com/Ankit1141192/ChargeGrid",
    //   category: "mobile",
    //   featured: false,
    // },
    {
        id: 9,
        title: "SkillUp",
        description: "SkillUp is an engaging and user-friendly E-learning mobile application built using React Native.",
        technologies: ["React Native", "JavaScript", "Firebase", "Firebase cloud messaging", "AsyncStorage", "CLI"],
        image: Project_9,
        liveUrl: "https://drive.google.com/uc?export=download&id=1nDNxRXu9WLZ7nl2b1ug7uXDB_VOX-CnL",
        githubUrl: "https://github.com/Ankit1141192/SkillUp",
        category: "mobile",
    },
    {
        id: 10,
        title: "Varnavelocity",
        description: "Varnavelocity is a collaborative typing app that enhances speed, accuracy, and teamwork with secure auth and seamless data storage.",
        technologies: ["React", "Clerk Auth", "Firebase", "LocalStorage", "Tailwindcss"],
        image: Project_10,
        liveUrl: "https://varnavelocity.vercel.app/",
        githubUrl: "https://github.com/Ankit1141192/Varnavelocity",
        category: "web",
    },
    {
        id: 11,
        title: "Jeevaloop - Hospital Management System",
        description: "Jeevaloop is a MERN Stack-based Hospital Management System designed to simplify hospital operations with role-based dashboards, secure authentication, and online appointment booking.",
        technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT"],
        image: Project_11,
        liveUrl: "https://jeevaloop.vercel.app/",
        githubUrl: "https://github.com/Ankit1141192/Jeevaloop",
        category: "web",
    },
    {
        id: 12,
        title: "VibeSync – Plan Together, Effortlessly",
        description:
            "VibeSync is a smart, mood-based group planning web app that helps friends and teams make decisions effortlessly.",
        technologies: [
            "React.js",
            "Vite",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Firebase Auth"
        ],
        image: Project_12,
        liveUrl: "https://vibe-sync-frontend-eta.vercel.app/",
        githubUrl: "https://github.com/mahi-in9/VibeSync-Frontend",
        category: "web"
    },
    {
        id: 13,
        title: "BoundDesk CRM",
        description:
            "BoundDesk is a full-stack CRM platform that helps teams manage leads, track activities, and collaborate in real time. It features secure JWT authentication, role-based access, and a clean Neumorphic UI. Built with React, Node.js, and PostgreSQL for high performance and scalability.",
        technologies: [
            "React.js",
            "Styled Components",
            "Socket.io",
            "Node.js",
            "Express.js",
            "PostgreSQL",
            "Prisma ORM",
            "JWT",
            "Bcrypt",
            "Nodemailer"
        ],
        image: Project_13,
        liveUrl: "https://bound-desk.vercel.app",
        githubUrl: "https://github.com/Ankit1141192/BoundDesk",
        category: "web"
    }

];
