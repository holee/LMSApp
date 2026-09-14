import { useMemo, useState } from "react";
import {
  branchPlaceholderImage,
  communes,
  districts,
  provinces,
  villages,
} from "./data";
import type { BranchFormErrors, BranchFormValues, PageType } from "./types";

type BranchFormProps = {
  title: string;
  subtitle: string;
  initialValues: BranchFormValues;
  submitText: string;
  pageType?: PageType;
  onClose: () => void;
  onSubmit: (values: BranchFormValues) => void;
};

function validate(values: BranchFormValues): BranchFormErrors {
  const errors: BranchFormErrors = {};

  if (!values.branchName.trim()) {
    errors.branchName = "Branch name is required.";
  }
  if (!values.branchCode.trim()) {
    errors.branchCode = "Branch code is required.";
  }
  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  }
  if (!values.zone.trim()) {
    errors.zone = "Zone is required.";
  }

  return errors;
}

export function BranchForm({
  title,
  subtitle,
  initialValues,
  submitText,
  onClose,
  onSubmit,
}: BranchFormProps) {
  const [values, setValues] = useState<BranchFormValues>(initialValues);
  const [errors, setErrors] = useState<BranchFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const districtList = useMemo(
    () => districts.filter((item) => item.parentId === values.provinceRefId),
    [values.provinceRefId],
  );
  const communeList = useMemo(
    () => communes.filter((item) => item.parentId === values.districtRefId),
    [values.districtRefId],
  );
  const villageList = useMemo(
    () => villages.filter((item) => item.parentId === values.communeRefId),
    [values.communeRefId],
  );

  const errorList = Object.values(errors);

  function setField<Key extends keyof BranchFormValues>(
    key: Key,
    value: BranchFormValues[Key],
  ) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (submitted) {
        setErrors(validate(next));
      }
      return next;
    });
  }

  function selectProvince(provinceId: number | null) {
    const province = provinces.find((item) => item.id === provinceId);
    setValues((current) => ({
      ...current,
      provinceRefId: provinceId,
      proInKhmer: province?.nameInKhmer ?? "",
      districtRefId: null,
      disInKhmer: "",
      communeRefId: null,
      comInKhmer: "",
      villageRefId: null,
      vilInKhmer: "",
    }));
  }

  function selectDistrict(districtId: number | null) {
    const district = districts.find((item) => item.id === districtId);
    setValues((current) => ({
      ...current,
      districtRefId: districtId,
      disInKhmer: district?.nameInKhmer ?? "",
      communeRefId: null,
      comInKhmer: "",
      villageRefId: null,
      vilInKhmer: "",
    }));
  }

  function selectCommune(communeId: number | null) {
    const commune = communes.find((item) => item.id === communeId);
    setValues((current) => ({
      ...current,
      communeRefId: communeId,
      comInKhmer: commune?.nameInKhmer ?? "",
      villageRefId: null,
      vilInKhmer: "",
    }));
  }

  function selectVillage(villageId: number | null) {
    const village = villages.find((item) => item.id === villageId);
    setValues((current) => ({
      ...current,
      villageRefId: villageId,
      vilInKhmer: village?.nameInKhmer ?? "",
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(values);
  }

  return (
    <form className="branch-modal-shell" onSubmit={handleSubmit} noValidate>
      {submitted && errorList.length > 0 && (
        <div className="branch-validation-summary" role="alert">
          <ul>
            {errorList.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="branch-section-card">
        <header className="branch-section-header">
          <div className="branch-section-header-left">
            <span className="branch-section-icon" aria-hidden="true">
              &#9974;
            </span>
            <div className="branch-section-heading">
              <div className="branch-section-title">{title}</div>
              <div className="branch-section-subtitle">{subtitle}</div>
            </div>
          </div>
          <span
            className={
              values.isActive
                ? "branch-status-badge status-active"
                : "branch-status-badge status-inactive"
            }
          >
            <span className="branch-status-dot" />
            {values.isActive ? "Active" : "Inactive"}
          </span>
        </header>

        <div className="branch-section-body branch-form-layout">
          <div className="branch-field-group">
            <div className="branch-field-row">
              <label className="branch-field">
                Branch Name *
                <input
                  name="branchName"
                  value={values.branchName}
                  placeholder="Enter branch name..."
                  onChange={(event) =>
                    setField("branchName", event.target.value)
                  }
                />
                {errors.branchName && (
                  <span className="branch-field-error">
                    {errors.branchName}
                  </span>
                )}
              </label>
              <label className="branch-field">
                Branch Code *
                <input
                  name="branchCode"
                  value={values.branchCode}
                  placeholder="Enter branch code..."
                  onChange={(event) =>
                    setField("branchCode", event.target.value)
                  }
                />
                {errors.branchCode && (
                  <span className="branch-field-error">
                    {errors.branchCode}
                  </span>
                )}
              </label>
            </div>

            <div className="branch-field-row">
              <label className="branch-field">
                Phone Number *
                <input
                  name="phoneNumber"
                  value={values.phoneNumber}
                  placeholder="Enter phone number..."
                  onChange={(event) =>
                    setField("phoneNumber", event.target.value)
                  }
                />
                {errors.phoneNumber && (
                  <span className="branch-field-error">
                    {errors.phoneNumber}
                  </span>
                )}
              </label>
              <label className="branch-field">
                Zone *
                <input
                  name="zone"
                  value={values.zone}
                  placeholder="Enter zone..."
                  onChange={(event) => setField("zone", event.target.value)}
                />
                {errors.zone && (
                  <span className="branch-field-error">{errors.zone}</span>
                )}
              </label>
            </div>

            <label className="branch-field">
              Description
              <input
                name="description"
                value={values.description}
                placeholder="Enter description..."
                onChange={(event) =>
                  setField("description", event.target.value)
                }
              />
            </label>

            <div className="branch-status-toggle">
              <span className="branch-form-label">Status</span>
              <label className="branch-status-toggle-row">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={values.isActive}
                  onChange={(event) =>
                    setField("isActive", event.target.checked)
                  }
                />
                <span>Visible in active branch lists</span>
              </label>
            </div>
          </div>

          <div className="branch-preview-card">
            <div className="branch-preview-frame">
              <img
                src={values.imagePath || branchPlaceholderImage}
                alt={values.branchName || "Branch"}
              />
            </div>
            <label className="branch-field branch-upload-copy">
              Image URL
              <input
                name="imagePath"
                value={values.imagePath}
                placeholder="Enter image URL..."
                onChange={(event) => setField("imagePath", event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="branch-section-card">
        <header className="branch-section-header">
          <div className="branch-section-header-left">
            <span
              className="branch-section-icon branch-section-icon-danger"
              aria-hidden="true"
            >
              &#9873;
            </span>
            <div className="branch-section-heading">
              <div className="branch-section-title">Address</div>
              <div className="branch-section-subtitle">
                Select the branch location from province down to village.
              </div>
            </div>
          </div>
        </header>

        <div className="branch-section-body branch-address-grid">
          <label className="branch-field">
            Province
            <select
              value={values.provinceRefId ?? ""}
              onChange={(event) =>
                selectProvince(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <option value="">Select province...</option>
              {provinces.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameInKhmer}
                </option>
              ))}
            </select>
          </label>

          <label className="branch-field">
            District
            <select
              value={values.districtRefId ?? ""}
              disabled={districtList.length === 0}
              onChange={(event) =>
                selectDistrict(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <option value="">Select district...</option>
              {districtList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameInKhmer}
                </option>
              ))}
            </select>
          </label>

          <label className="branch-field">
            Commune
            <select
              value={values.communeRefId ?? ""}
              disabled={communeList.length === 0}
              onChange={(event) =>
                selectCommune(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <option value="">Select commune...</option>
              {communeList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameInKhmer}
                </option>
              ))}
            </select>
          </label>

          <label className="branch-field">
            Village
            <select
              value={values.villageRefId ?? ""}
              disabled={villageList.length === 0}
              onChange={(event) =>
                selectVillage(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <option value="">Select village...</option>
              {villageList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameInKhmer}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="branch-footer">
        <button type="submit" className="branch-button branch-button-success">
          {submitText}
        </button>
        <button
          type="button"
          className="branch-button branch-button-danger"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
