
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiArrowUp,
} from "react-icons/fi";
import { Link } from "../lib/router";

const socials = [
  {
    icon: FiGithub,
    href: "https://github.com/Ankit1141192",
    label: "GitHub",
  },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/ankit1141/",
    label: "LinkedIn",
  },
  {
    icon: FiTwitter,
    href: "https://x.com/ankitk09773",
    label: "Twitter",
  },
  {
    icon: FiInstagram,
    href: "https://www.instagram.com/mr_ankitkumar4954/",
    label: "Instagram",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-line bg-panel2">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />

              <Link
                to="/appliedJob"
                className="text-sm font-mono text-paper hover:text-cyan transition-colors"
                title="Open Apply Portal"
              >
                Available for opportunities &rarr;
              </Link>
            </div>

            <p className="text-muted text-sm">
              © 2025 Ankit Kumar. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="
                  group
                  w-10 h-10
                  flex items-center justify-center
                  rounded-lg
                  border border-line
                  bg-panel
                  text-muted
                  hover:text-cyan
                  hover:border-cyan/50
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Icon
                  size={17}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </a>
            ))}

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="
                group
                w-10 h-10
                ml-2
                flex items-center justify-center
                rounded-lg
                bg-paper
                text-ink
                hover:bg-cyan
                hover:-translate-y-1
                transition-all duration-300
                cursor-pointer
              "
            >
              <FiArrowUp
                size={17}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted font-mono">
            Built with React & Tailwind CSS
          </p>

          <p className="text-xs text-muted font-mono">
            Designed & developed by{" "}
            <span className="text-cyan">Ankit Kumar</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

