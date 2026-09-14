import { useEffect, useMemo, useRef, useState } from "react";
import { BranchDetail } from "./BranchDetail";
import { BranchForm } from "./BranchForm";
import { useBranchStore } from "./branchContext";
import { branchPlaceholderImage, emptyBranch, pageSizeOptions } from "./data";
import { formatBranchAddress, toBranchFormValues } from "./types";
import type { BranchRecord } from "./types";

type TabAction = "create" | "details" | "edit";

type BranchTab = {
  key: string;
  title: string;
  action: TabAction;
  branchId?: number;
};

export function BranchListPage() {
  const {
    branches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch,
    changeBranchState,
  } = useBranchStore();

  const [tabs, setTabs] = useState<BranchTab[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [pageSize, setPageSize] = useState(15);
  const [pageIndex, setPageIndex] = useState(0);
  const [sortDescending, setSortDescending] = useState(false);
  const [menuBranchId, setMenuBranchId] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (menuBranchId === null) return;

    function closeMenu(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".branch-row-menu-wrap")) {
        setMenuBranchId(null);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [menuBranchId]);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();

    const rows = branches.filter((branch) => {
      if (!includeInactive && !branch.isActive) return false;
      if (!text) return true;

      return [
        branch.branchName,
        branch.branchCode,
        branch.description,
        branch.phoneNumber,
        branch.zone,
        formatBranchAddress(branch),
      ]
        .join(" ")
        .toLowerCase()
        .includes(text);
    });

    return [...rows].sort((left, right) =>
      sortDescending
        ? right.branchId - left.branchId
        : left.branchId - right.branchId,
    );
  }, [branches, includeInactive, search, sortDescending]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const pageRows = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  function openTab(tab: BranchTab) {
    setMenuBranchId(null);

    const existingIndex = tabs.findIndex((item) => item.key === tab.key);
    if (existingIndex !== -1) {
      setSelectedIndex(existingIndex + 1);
      return;
    }

    setTabs((items) => [...items, tab]);
    setSelectedIndex(tabs.length + 1);
  }

  function closeTab(key: string) {
    const index = tabs.findIndex((item) => item.key === key);
    if (index === -1) return;

    setTabs((items) => items.filter((item) => item.key !== key));
    setSelectedIndex(Math.max(0, index));
  }

  function openCreateTab() {
    openTab({
      key: `create_${Date.now()}`,
      title: "New Branch",
      action: "create",
    });
  }

  function openDetailsTab(branch: BranchRecord) {
    openTab({
      key: `${branch.branchId}_details`,
      title: "Details",
      action: "details",
      branchId: branch.branchId,
    });
  }

  function openEditTab(branchId: number) {
    openTab({
      key: `${branchId}_edit`,
      title: "Edit",
      action: "edit",
      branchId,
    });
  }

  function handleDelete(branch: BranchRecord) {
    setMenuBranchId(null);

    const confirmed = window.confirm(
      "សាខាដែលបានលុបនឹងមិនអាចស្ដារឡើងវិញបានទេ តើអ្នកចង់បន្តទេ?",
    );
    if (!confirmed) return;

    if (branch.isHeadOffice) {
      const deactivate = window.confirm(
        "សាខាដែលអ្នកកំពុងព្យាយាមលុបបានចាប់ផ្តើមប្រតិបត្តិការរួចហើយ ដូច្នេះអ្នកមិនអាចលុបវាបានទេ។ ការធ្វើឱ្យអសកម្មត្រូវបានណែនាំយ៉ាងខ្លាំង!",
      );
      if (deactivate) {
        changeBranchState(branch.branchId, false);
      }
      return;
    }

    deleteBranch(branch.branchId);
    closeTab(`${branch.branchId}_details`);
    closeTab(`${branch.branchId}_edit`);
  }

  function renderTabContent(tab: BranchTab) {
    if (tab.action === "create") {
      return (
        <BranchForm
          title="Branch information"
          subtitle="Keep the branch identity clear with a simple name, code, status, and image."
          submitText="Save Branch"
          initialValues={emptyBranch}
          onClose={() => closeTab(tab.key)}
          onSubmit={(values) => {
            createBranch(values);
            closeTab(tab.key);
          }}
        />
      );
    }

    const branch = tab.branchId ? getBranch(tab.branchId) : undefined;

    if (!branch) {
      return <div className="branch-empty">Branch not found.</div>;
    }

    if (tab.action === "details") {
      return (
        <BranchDetail
          branch={branch}
          onClose={() => closeTab(tab.key)}
          onEdit={() => openEditTab(branch.branchId)}
        />
      );
    }

    return (
      <BranchForm
        title="Branch information"
        subtitle="Update the branch identity, contact details, and location."
        submitText="Update Branch"
        initialValues={toBranchFormValues(branch)}
        onClose={() => closeTab(tab.key)}
        onSubmit={(values) => {
          updateBranch(branch.branchId, values);
          closeTab(tab.key);
        }}
      />
    );
  }

  const activeTab = selectedIndex > 0 ? tabs[selectedIndex - 1] : undefined;

  return (
    <div className="branch-tabs">
      <div className="branch-tabstrip" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedIndex === 0}
          className={selectedIndex === 0 ? "branch-tab active" : "branch-tab"}
          onClick={() => setSelectedIndex(0)}
        >
          <span className="branch-tab-icon" aria-hidden="true">
            &#9776;
          </span>
          Branches
        </button>

        {tabs.map((tab, index) => (
          <span
            key={tab.key}
            className={
              selectedIndex === index + 1
                ? "branch-tab closable active"
                : "branch-tab closable"
            }
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedIndex === index + 1}
              onClick={() => setSelectedIndex(index + 1)}
            >
              {tab.title}
            </button>
            <button
              type="button"
              className="branch-tab-close"
              aria-label={`Close ${tab.title}`}
              onClick={() => closeTab(tab.key)}
            >
              &#10005;
            </button>
          </span>
        ))}
      </div>

      {selectedIndex === 0 ? (
        <section className="branch-page-card">
          <header className="branch-page-header">
            <div>
              <h3 className="branch-title">Branches</h3>
              <p className="branch-subtitle">
                Manage branch information in a clean and modern table view.
              </p>
            </div>
          </header>

          <div className="branch-toolbar">
            <div className="branch-toolbar-left">
              <button
                type="button"
                className="branch-button branch-button-primary"
                onClick={openCreateTab}
              >
                <span aria-hidden="true">+</span> New Branch
              </button>
            </div>
            <div className="branch-toolbar-right">
              <label className="branch-search">
                <span className="branch-search-icon" aria-hidden="true">
                  &#9906;
                </span>
                <input
                  type="search"
                  value={search}
                  placeholder="Search branches..."
                  aria-label="Search branches"
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPageIndex(0);
                  }}
                />
              </label>
              <label className="branch-filter-toggle">
                <input
                  type="checkbox"
                  name="includeInactive"
                  checked={includeInactive}
                  onChange={(event) => {
                    setIncludeInactive(event.target.checked);
                    setPageIndex(0);
                  }}
                />
                Include inactive
              </label>
            </div>
          </div>

          <div className="branch-grid" ref={gridRef}>
            <table>
              <thead>
                <tr>
                  <th className="branch-col-index">
                    <button
                      type="button"
                      className="branch-sort-button"
                      onClick={() => setSortDescending((value) => !value)}
                    >
                      # {sortDescending ? "▼" : "▲"}
                    </button>
                  </th>
                  <th className="branch-col-name">ឈ្មោះសាខា</th>
                  <th>លេខកូដសាខា</th>
                  <th>ពិពណ៌នា</th>
                  <th>អាសយដ្ឋាន</th>
                  <th className="branch-col-status">ស្ថានភាព</th>
                  <th className="branch-col-actions">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((branch, index) => (
                  <tr
                    key={branch.branchId}
                    className={
                      branch.isActive ? undefined : "branch-row-inactive"
                    }
                    onDoubleClick={() => openDetailsTab(branch)}
                  >
                    <td className="branch-col-index">
                      {currentPage * pageSize + index + 1}
                    </td>
                    <td>
                      <div className="branch-identity">
                        <img
                          className="branch-image"
                          src={branch.imagePath || branchPlaceholderImage}
                          alt={branch.branchName}
                        />
                        <span className="branch-name">{branch.branchName}</span>
                      </div>
                    </td>
                    <td>{branch.branchCode}</td>
                    <td>{branch.description}</td>
                    <td>{formatBranchAddress(branch)}</td>
                    <td className="branch-col-status">
                      <span
                        className={
                          branch.isActive
                            ? "branch-status-badge is-active"
                            : "branch-status-badge is-inactive"
                        }
                      >
                        <span className="branch-status-dot" />
                        {branch.isActive ? "សកម្ម" : "មិនសកម្ម"}
                      </span>
                    </td>
                    <td className="branch-col-actions">
                      <span className="branch-row-menu-wrap">
                        <button
                          type="button"
                          className="branch-icon-button"
                          aria-label={`Actions for ${branch.branchName}`}
                          aria-expanded={menuBranchId === branch.branchId}
                          onClick={() =>
                            setMenuBranchId((current) =>
                              current === branch.branchId
                                ? null
                                : branch.branchId,
                            )
                          }
                        >
                          &#8942;
                        </button>
                        {menuBranchId === branch.branchId && (
                          <div className="branch-row-menu" role="menu">
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => openDetailsTab(branch)}
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => openEditTab(branch.branchId)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="danger"
                              onClick={() => handleDelete(branch)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="branch-empty">
                      No branches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="branch-pager">
            <span className="branch-pager-summary">
              Page {currentPage + 1} of {pageCount} ({filtered.length} items)
            </span>
            <div className="branch-pager-controls">
              <label className="branch-page-size">
                Page size
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPageIndex(0);
                  }}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="branch-button branch-button-ghost"
                disabled={currentPage === 0}
                onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
              >
                Prev
              </button>
              <button
                type="button"
                className="branch-button branch-button-ghost"
                disabled={currentPage >= pageCount - 1}
                onClick={() =>
                  setPageIndex((value) => Math.min(pageCount - 1, value + 1))
                }
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      ) : (
        activeTab && (
          <section className="branch-page-wrapper">
            {renderTabContent(activeTab)}
          </section>
        )
      )}
    </div>
  );
}
