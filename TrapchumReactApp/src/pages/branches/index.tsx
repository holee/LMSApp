import { useLocation, useNavigate } from "react-router-dom";
import { BranchDetail } from "./BranchDetail";
import { BranchForm } from "./BranchForm";
import { BranchListPage } from "./BranchListPage";
import { useBranchStore } from "./branchContext";
import { BranchProvider } from "./BranchStore";
import { emptyBranch } from "./data";
import { toBranchFormValues } from "./types";
import "./BranchPages.css";

function BranchCreatePage() {
  const navigate = useNavigate();
  const { createBranch } = useBranchStore();

  return (
    <section className="branch-page-wrapper">
      <BranchForm
        title="Branch information"
        subtitle="Keep the branch identity clear with a simple name, code, status, and image."
        submitText="Save Branch"
        pageType="page"
        initialValues={emptyBranch}
        onClose={() => navigate("/App/Branches")}
        onSubmit={(values) => {
          createBranch(values);
          navigate("/App/Branches");
        }}
      />
    </section>
  );
}

function BranchDetailsPage({ branchId }: { branchId: number }) {
  const navigate = useNavigate();
  const { getBranch } = useBranchStore();
  const branch = getBranch(branchId);

  if (!branch) {
    return <section className="branch-empty">Branch not found.</section>;
  }

  return (
    <section className="branch-page-wrapper">
      <BranchDetail
        branch={branch}
        onClose={() => navigate("/App/Branches")}
        onEdit={() => navigate(`/App/Branches/Edit/${branch.branchId}`)}
      />
    </section>
  );
}

function BranchEditPage({ branchId }: { branchId: number }) {
  const navigate = useNavigate();
  const { getBranch, updateBranch } = useBranchStore();
  const branch = getBranch(branchId);

  if (!branch) {
    return <section className="branch-empty">Branch not found.</section>;
  }

  return (
    <section className="branch-page-wrapper">
      <BranchForm
        title="Branch information"
        subtitle="Update the branch identity, contact details, and location."
        submitText="Update Branch"
        pageType="page"
        initialValues={toBranchFormValues(branch)}
        onClose={() => navigate(`/App/Branches/Details/${branch.branchId}`)}
        onSubmit={(values) => {
          updateBranch(branch.branchId, values);
          navigate(`/App/Branches/Details/${branch.branchId}`);
        }}
      />
    </section>
  );
}

function BranchRouter() {
  const normalizedPath = useLocation().pathname.toLowerCase();

  if (normalizedPath === "/app/branches/create") {
    return <BranchCreatePage />;
  }

  const detailsMatch = normalizedPath.match(/^\/app\/branches\/details\/(.+)$/);
  if (detailsMatch) {
    return <BranchDetailsPage branchId={Number(detailsMatch[1])} />;
  }

  const editMatch = normalizedPath.match(/^\/app\/branches\/edit\/(.+)$/);
  if (editMatch) {
    return <BranchEditPage branchId={Number(editMatch[1])} />;
  }

  return <BranchListPage />;
}

export function BranchPages() {
  return (
    <BranchProvider>
      <BranchRouter />
    </BranchProvider>
  );
}
