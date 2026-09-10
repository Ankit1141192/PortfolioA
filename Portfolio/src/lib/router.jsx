import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const RouterContext = createContext(null);

export function BrowserRouter({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname + window.location.search + window.location.hash;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (!to) return;
    if (typeof window === "undefined") return;

    if (to.startsWith("http://") || to.startsWith("https://") || to.startsWith("mailto:") || to.startsWith("tel:")) {
      window.location.href = to;
      return;
    }

    const { replace = false, state = null } = options;
    if (replace) {
      window.history.replaceState(state, "", to);
    } else {
      window.history.pushState(state, "", to);
    }
    setCurrentPath(to);
  }, []);

  const contextValue = useMemo(() => {
    const [pathWithSearch, hash = ""] = currentPath.split("#");
    const [pathname = "/", search = ""] = pathWithSearch.split("?");

    return {
      currentPath,
      pathname: pathname || "/",
      search: search ? `?${search}` : "",
      hash: hash ? `#${hash}` : "",
      navigate,
    };
  }, [currentPath, navigate]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a BrowserRouter");
  }
  return context;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { pathname, search, hash } = useRouter();
  return { pathname, search, hash };
}

export function Link({ to, children, className = "", onClick, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export function Routes({ children }) {
  const { pathname } = useRouter();

  // Normalize pathname to lowercase without trailing slash (except root)
  const cleanPath = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1).toLowerCase()
    : pathname.toLowerCase();

  let matchedElement = null;
  let fallbackElement = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || matchedElement) return;

    const { path, element } = child.props;
    if (!path || path === "*") {
      fallbackElement = element;
      return;
    }

    const cleanRoutePath = path.length > 1 && path.endsWith("/")
      ? path.slice(0, -1).toLowerCase()
      : path.toLowerCase();

    // Check exact match
    if (cleanPath === cleanRoutePath) {
      matchedElement = element;
    }
  });

  return matchedElement || fallbackElement || null;
}

export function Route({ path, element }) {
  return element;
}
