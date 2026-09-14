import { branchPlaceholderImage } from "./data";
import type { BranchRecord } from "./types";

type BranchDetailProps = {
  branch: BranchRecord;
  onClose: () => void;
  onEdit?: () => void;
};

export function BranchDetail({ branch, onClose, onEdit }: BranchDetailProps) {
  return (
    <div className="branch-detail-modal-shell">
      <section className="branch-detail-card">
        <header className="branch-detail-header">
          <div className="branch-detail-header-left">
            <span className="branch-detail-icon" aria-hidden="true">
              &#9974;
            </span>
            <div className="branch-detail-heading">
              <div className="branch-detail-title">Branch Information</div>
              <div className="branch-detail-subtitle">
                View branch identity details in a clean summary.
              </div>
            </div>
          </div>
        </header>

        <div className="branch-detail-body">
          <div className="branch-detail-overview-grid">
            <div className="branch-detail-info-panel">
              <div className="branch-detail-field">
                <div className="branch-detail-label">Branch Name</div>
                <div className="branch-detail-value">{branch.branchName}</div>
              </div>

              <div className="branch-detail-divider" />

              <div className="branch-detail-field">
                <div className="branch-detail-label">Branch Code</div>
                <div className="branch-detail-value">{branch.branchCode}</div>
              </div>

              <div className="branch-detail-divider" />

              <div className="branch-detail-field">
                <div className="branch-detail-label">Bank</div>
                <div className="branch-detail-value">{branch.bankName}</div>
              </div>

              <div className="branch-detail-divider" />

              <div className="branch-detail-field">
                <div className="branch-detail-label">Status</div>
                <div className="branch-detail-value">
                  <span
                    className={
                      branch.isActive
                        ? "branch-badge branch-badge-success"
                        : "branch-badge branch-badge-danger"
                    }
                  >
                    {branch.isActive ? "Active" : "Inactive"}
                  </span>
                  {branch.isHeadOffice && (
                    <span className="branch-badge branch-badge-info">
                      Head Office
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="branch-detail-image-panel">
              <div className="branch-detail-image-frame">
                <img
                  src={branch.imagePath || branchPlaceholderImage}
                  alt={branch.branchName}
                />
              </div>
            </div>
          </div>

          <div className="branch-detail-address-grid">
            <div className="branch-detail-field">
              <div className="branch-detail-label">Phone Number</div>
              <div className="branch-detail-value">{branch.phoneNumber}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">Zone</div>
              <div className="branch-detail-value">{branch.zone}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">Description</div>
              <div className="branch-detail-value">{branch.description}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="branch-detail-card">
        <header className="branch-detail-header">
          <div className="branch-detail-header-left">
            <span
              className="branch-detail-icon branch-detail-icon-danger"
              aria-hidden="true"
            >
              &#9873;
            </span>
            <div className="branch-detail-heading">
              <div className="branch-detail-title">Address Information</div>
              <div className="branch-detail-subtitle">
                Branch location details in Khmer.
              </div>
            </div>
          </div>
        </header>

        <div className="branch-detail-body">
          <div className="branch-detail-address-grid">
            <div className="branch-detail-field">
              <div className="branch-detail-label">Country</div>
              <div className="branch-detail-value">{branch.countryName}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">City</div>
              <div className="branch-detail-value">{branch.city}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">Province</div>
              <div className="branch-detail-value">{branch.proInKhmer}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">District</div>
              <div className="branch-detail-value">{branch.disInKhmer}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">Commune</div>
              <div className="branch-detail-value">{branch.comInKhmer}</div>
            </div>

            <div className="branch-detail-field">
              <div className="branch-detail-label">Village</div>
              <div className="branch-detail-value">{branch.vilInKhmer}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="branch-detail-footer">
        {onEdit && (
          <button
            type="button"
            className="branch-button branch-button-primary"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="branch-button branch-button-danger"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
