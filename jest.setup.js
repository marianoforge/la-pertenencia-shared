import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isReady: true,
      defaultLocale: "es",
      domainLocales: [],
      isPreview: false,
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
}));

