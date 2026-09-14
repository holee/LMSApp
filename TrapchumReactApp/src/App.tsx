import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routeManifest from "./trapchum-routes.json";
import { CurrencyPages } from "./pages/currencies";
import { isCurrencyRoute } from "./pages/currencies/routes";
import { CustomerPages } from "./pages/customers";
import { isCustomerRoute } from "./pages/customers/routes";
import { BranchPages } from "./pages/branches";
import { isBranchRoute } from "./pages/branches/routes";
import "./App.css";

type NavLeaf = { label: string; icon: string; path: string };
type NavItem = NavLeaf | { label: string; icon: string; children: NavLeaf[] };

const navigationGroups: NavItem[] = [
  { label: "សហគ្រាសបញ្ចាំទ្រព្យជុំ", icon: "▦", path: "/" },
  {
    label: "Branches",
    icon: "⌂",
    children: [{ label: "Branches List", icon: "⌂", path: "/App/Branches" }],
  },
  {
    label: "Loan Management",
    icon: "▤",
    children: [
      { label: "Customers", icon: "◎", path: "/App/Customers" },
      { label: "Loan Requests", icon: "▤", path: "/App/LoanRequests" },
      { label: "Loan Servicing", icon: "↻", path: "/App/Loans" },
      { label: "Collaterals", icon: "◈", path: "/App/Customer/Collaterals" },
      { label: "Notifications", icon: "●", path: "/App/Notifications" },
    ],
  },
  {
    label: "Accounting",
    icon: "▥",
    children: [
      { label: "Ledger", icon: "▥", path: "/App/Account/Ledgers" },
      { label: "G. Journal Entry", icon: "▤", path: "/App/Account/Journals" },
      { label: "Bank Reconcile", icon: "↻", path: "/App/Account/Reconcile" },
    ],
  },
  {
    label: "Reports",
    icon: "▧",
    children: [
      { label: "Themes", icon: "▧", path: "/App/Reports" },
      { label: "Colors", icon: "◈", path: "/App/Reports/Colors" },
    ],
  },
  {
    label: "Currencies",
    icon: "$",
    children: [
      { label: "Currencies List", icon: "$", path: "/App/Currencies" },
      { label: "Currency Note", icon: "$", path: "/App/Notes/CurrencyCounter" },
      {
        label: "Set Daily Spot Rate",
        icon: "$",
        path: "/App/SetDailySpotRates",
      },
      { label: "Money Exchange", icon: "⇄", path: "/App/Exchanges" },
      { label: "NBC Exchange", icon: "⇄", path: "/App/Exchanges/NbcRates" },
    ],
  },
  {
    label: "Adminstrations",
    icon: "⚙",
    children: [
      { label: "Manage Users", icon: "⚙", path: "/App/Account/Users" },
      { label: "Manage Roles", icon: "⚙", path: "/App/Account/Roles" },
      {
        label: "Manage Permissions",
        icon: "⚙",
        path: "/App/Account/Permissions",
      },
      {
        label: "Manage Loan Size",
        icon: "⚙",
        path: "/App/Account/ManageLoanSize",
      },
    ],
  },
  {
    label: "Setting",
    icon: "⚙",
    children: [
      { label: "Loan Setting", icon: "⚙", path: "/App/Settings" },
      { label: "Occupations", icon: "⚙", path: "/App/Setting/Occupations" },
      { label: "Provinces", icon: "⚙", path: "/App/Operation-Area/Provinces" },
      { label: "Districts", icon: "⚙", path: "/App/Operation-Area/Districts" },
      { label: "Communes", icon: "⚙", path: "/App/Operation-Area/Communes" },
      { label: "Villages", icon: "⚙", path: "/App/Operation-Area/Villages" },
      {
        label: "Income & Expense",
        icon: "⚙",
        path: "/App/Settings/Income-Expense",
      },
      { label: "Items", icon: "⚙", path: "/App/Items" },
      { label: "Collaterals", icon: "⚙", path: "/App/Collaterals/Valuations" },
      { label: "Areas", icon: "⚙", path: "/app/administration/areas" },
    ],
  },
  {
    label: "Audit Trail",
    icon: "✓",
    children: [{ label: "Audit", icon: "✓", path: "/App/Audit" }],
  },
];

function getPageName(pathname: string) {
  if (pathname === "/") return "Dashboard";

  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "Dashboard";
  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <aside className="auth-brand">
          <div className="auth-brand-inner">
            <div className="auth-logo">Trapchum</div>
            <h1 className="auth-brand-title">
              Loan Management
              <br />
              made simple
            </h1>
            <p className="auth-brand-text">
              Manage customers, loans, repayments and reports from one secure
              workspace.
            </p>
          </div>
          <ul className="auth-points">
            <li>Loan and repayment tracking</li>
            <li>Branch and cash management</li>
            <li>Secure reports and audit trails</li>
          </ul>
        </aside>
        <section className="auth-panel">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to continue to Trapchum.</p>
          </div>
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/");
            }}
          >
            <label>
              Username
              <input name="username" autoComplete="username" required />
            </label>
            <label>
              Password
              <span className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <label className="auth-remember">
              <input type="checkbox" name="rememberMe" />
              Remember me
            </label>
            <button type="submit" className="auth-submit">
              Sign In
            </button>
          </form>
          <footer className="auth-footer">
            © 2026 Trapchum Cash Pawn Shop. All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="auth-page">
      <div className="auth-card">
        <aside className="auth-brand">
          <div className="auth-brand-inner">
            <div className="auth-logo">Trapchum</div>
            <h1 className="auth-brand-title">Create your account</h1>
            <p className="auth-brand-text">
              Set up secure access to the Trapchum loan management workspace.
            </p>
          </div>
          <ul className="auth-points">
            <li>Customer and loan management</li>
            <li>Repayment and branch operations</li>
            <li>Reports and audit controls</li>
          </ul>
        </aside>
        <section className="auth-panel">
          <div>
            <span className="eyebrow">New account</span>
            <h2>Register</h2>
            <p>Enter your account details to continue.</p>
          </div>
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/Account/Login");
            }}
          >
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </label>
            <button type="submit" className="auth-submit">
              Register
            </button>
          </form>
          <footer className="auth-footer">
            Already registered?{" "}
            <button type="button" onClick={() => navigate("/Account/Login")}>
              Sign in
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedPath = location.pathname.toLowerCase();
  const isCurrencyPage = isCurrencyRoute(normalizedPath);
  const isCustomerPage = isCustomerRoute(normalizedPath);
  const isBranchPage = isBranchRoute(normalizedPath);
  const activeItem = getPageName(location.pathname);
  const matchedRoute = routeManifest.find(({ Route }) => {
    const pattern = Route.replace(/\{[^}]+\}/g, "[^/]+");
    return new RegExp(`^${pattern}$`, "i").test(location.pathname);
  });

  if (location.pathname.toLowerCase() === "/account/login") {
    return <LoginPage />;
  }

  if (location.pathname.toLowerCase() === "/account/register") {
    return <RegisterPage />;
  }

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.toLowerCase().startsWith(path.toLowerCase());

  const toggleGroup = (label: string) => {
    if (!sidebarOpen) setSidebarOpen(true);
    setOpenGroups((value) => ({ ...value, [label]: !value[label] }));
  };

  const activeGroupLabel = navigationGroups.find(
    (item) =>
      "children" in item && item.children.some((child) => isActive(child.path)),
  )?.label;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-group">
          <button
            className="icon-button"
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
          <strong>Trapchum</strong>
        </div>
        <div className="header-actions">
          <span className="branch-state">
            <span /> Branch Open
          </span>
          <button
            className="icon-button"
            type="button"
            aria-label="Notifications"
          >
            ●
          </button>
          <button className="profile-button" type="button">
            <span className="avatar">AD</span>
            <span>Administrator</span>
          </button>
        </div>
      </header>

      <aside className={sidebarOpen ? "sidebar" : "sidebar sidebar-collapsed"}>
        <nav aria-label="Main navigation">
          {navigationGroups.map((item) =>
            "children" in item ? (
              <div className="nav-group" key={item.label}>
                <button
                  className={
                    item.label === activeGroupLabel
                      ? "nav-group-toggle active"
                      : "nav-group-toggle"
                  }
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  title={item.label}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                  <span
                    className={
                      openGroups[item.label] || item.label === activeGroupLabel
                        ? "nav-chevron open"
                        : "nav-chevron"
                    }
                    aria-hidden="true"
                  >
                    &#9662;
                  </span>
                </button>
                {(openGroups[item.label] ||
                  item.label === activeGroupLabel) && (
                  <div className="nav-submenu">
                    {item.children.map((child) => (
                      <button
                        className={
                          isActive(child.path)
                            ? "nav-item nav-item--child active"
                            : "nav-item nav-item--child"
                        }
                        key={child.label}
                        type="button"
                        onClick={() => navigate(child.path)}
                        title={child.label}
                      >
                        <span className="nav-icon" aria-hidden="true">
                          {child.icon}
                        </span>
                        <span className="nav-label">{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                className={isActive(item.path) ? "nav-item active" : "nav-item"}
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            ),
          )}
        </nav>
      </aside>

      <main
        className={sidebarOpen ? "app-content" : "app-content content-expanded"}
      >
        <div className="page-heading">
          <div>
            <span className="eyebrow">Trapchum LMS</span>
            <h1>{activeItem}</h1>
            {matchedRoute && (
              <p className="route-source">Migrated from {matchedRoute.File}</p>
            )}
          </div>
          {!isCurrencyPage && !isCustomerPage && !isBranchPage && (
            <button className="primary-button" type="button">
              New record
            </button>
          )}
        </div>
        {isCurrencyPage ? (
          <CurrencyPages />
        ) : isCustomerPage ? (
          <CustomerPages />
        ) : isBranchPage ? (
          <BranchPages />
        ) : (
          <>
            <section className="dashboard-grid" aria-label="Dashboard summary">
              <article className="metric">
                <span>Active customers</span>
                <strong>1,248</strong>
                <small>+6.4% this month</small>
              </article>
              <article className="metric">
                <span>Outstanding loans</span>
                <strong>$842,650</strong>
                <small>Across 634 accounts</small>
              </article>
              <article className="metric">
                <span>Due today</span>
                <strong>$18,420</strong>
                <small>42 scheduled payments</small>
              </article>
              <article className="metric">
                <span>Portfolio at risk</span>
                <strong>2.8%</strong>
                <small>Within target range</small>
              </article>
            </section>
            <section className="workspace-panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent activity</h2>
                  <p>Latest transactions and account updates</p>
                </div>
                <button className="secondary-button" type="button">
                  View all
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Activity</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>LN-20481</td>
                      <td>Sokha Lim</td>
                      <td>Loan payment</td>
                      <td>$420.00</td>
                      <td>
                        <span className="status success">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>LN-20476</td>
                      <td>Dara Chan</td>
                      <td>Disbursement</td>
                      <td>$2,500.00</td>
                      <td>
                        <span className="status warning">Processing</span>
                      </td>
                    </tr>
                    <tr>
                      <td>CR-10932</td>
                      <td>Srey Mom</td>
                      <td>Customer created</td>
                      <td>—</td>
                      <td>
                        <span className="status success">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
