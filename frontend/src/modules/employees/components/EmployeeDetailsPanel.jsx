import { useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Mail, Phone, Pencil, UserRound, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import DetailPanel from "../../../components/DetailPanel";
import Modal from "../../../components/Modal";
import { getUsers } from "../../users/api";
import { linkEmployeeLogin, unlinkEmployeeLogin, updateEmployeeStatus } from "../api";
import { notify } from "../../../lib/toast";
import styles from "./EmployeeDetailsPanel.module.css";

function displayDate(value) {
  if (!value) return "Not provided";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export default function EmployeeDetailsPanel({ employee, employees, onClose, onEdit, onUpdated }) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const [dialog, setDialog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userOptions, setUserOptions] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const availableUsers = useMemo(() => {
    if (!userOptions) return [];
    const linkedIds = new Set(
      employees
        .filter((item) => item.id !== employee.id && item.loginUserId)
        .map((item) => item.loginUserId),
    );
    return userOptions.filter((account) => !linkedIds.has(account.id));
  }, [employee.id, employees, userOptions]);

  async function loadAccounts() {
    if (userOptions) return;
    setLoadingUsers(true);
    try {
      setUserOptions(await getUsers());
    } catch (error) {
      notify.error(error.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function saveStatus(status, reactivateLogin = false) {
    if (saving) return;
    setSaving(true);
    try {
      await updateEmployeeStatus(employee.id, status, reactivateLogin);
      if (status === "INACTIVE") {
        notify.success("Employee deactivated. Their linked login and open production assignments were closed.");
      } else if (reactivateLogin) {
        notify.success("Employee and linked login reactivated.");
      } else if (employee.loginDisabledByEmployment) {
        notify.success("Employee reactivated. Login remains disabled.");
      } else {
        notify.success("Employee reactivated.");
      }
      setDialog(null);
      onUpdated();
      onClose();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLink() {
    if (!selectedUserId || saving) return;
    setSaving(true);
    try {
      await linkEmployeeLogin(employee.id, selectedUserId);
      notify.success("Login account linked.");
      onUpdated();
      onClose();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUnlink() {
    if (saving) return;
    setSaving(true);
    try {
      await unlinkEmployeeLogin(employee.id);
      notify.success("Login account unlinked. The user account itself was not changed.");
      onUpdated();
      onClose();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  const inactive = employee.status === "INACTIVE";
  const showRestoreChoice = inactive && employee.loginAccountLinked && employee.loginDisabledByEmployment;

  return (
    <DetailPanel onClose={onClose}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>EMPLOYEE PROFILE</p>
          <h2>{employee.fullName}</h2>
          <span className={styles.employeeCode}>{employee.employeeCode}</span>
        </div>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close employee details"><X size={18} /></button>
      </div>

      <div className={styles.statusRow}>
        <span className={inactive ? styles.inactiveBadge : styles.activeBadge}>{inactive ? "Inactive" : "Active"}</span>
        <span>{employee.loginAccountLinked ? "Login linked" : "No login account"}</span>
      </div>

      <section className={styles.section}>
        <h3>Employment details</h3>
        <InfoRow icon={BriefcaseBusiness} label="Job title" value={employee.jobTitle} />
        <InfoRow icon={BriefcaseBusiness} label="Department" value={employee.department} />
        <InfoRow icon={CalendarDays} label="Date of joining" value={displayDate(employee.dateOfJoining)} />
      </section>

      <section className={styles.section}>
        <h3>Contact information</h3>
        <InfoRow icon={Phone} label="Phone" value={employee.contactPhone || "Not provided"} />
        <InfoRow icon={Mail} label="Contact email" value={employee.contactEmail || "Not provided"} />
      </section>

      <section className={styles.loginSection}>
        <div className={styles.sectionHeading}>
          <div><h3>System login</h3><p>Separate from employment contact details.</p></div>
          <UserRound size={17} aria-hidden="true" />
        </div>
        {employee.loginAccountLinked ? (
          <>
            <div className={styles.loginInfo}>
              <strong>{employee.loginEmail}</strong>
              <span>{employee.loginRole?.replaceAll("_", " ")} · {employee.loginActive ? "Login active" : "Login disabled"}</span>
            </div>
            {employee.loginDisabledByEmployment && inactive && (
              <p className={styles.notice}>This login was disabled when the employee was deactivated.</p>
            )}
            {isAdmin && (
              <button type="button" className={styles.textButton} onClick={() => setDialog("unlink")}>
                Unlink account
              </button>
            )}
          </>
        ) : (
          <>
            <p className={styles.bodyText}>This employee can be managed without a CupFlow login.</p>
            {isAdmin && employee.status === "ACTIVE" && (
              <div className={styles.linkControls}>
                {!userOptions ? (
                  <button type="button" className={styles.secondaryButton} onClick={loadAccounts} disabled={loadingUsers}>
                    {loadingUsers ? "Loading accounts…" : "Link existing login"}
                  </button>
                ) : (
                  <>
                    <label className={styles.selectLabel}>
                      <span>Choose an unlinked account</span>
                      <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
                        <option value="">Select account</option>
                        {availableUsers.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.email} · {account.role.replaceAll("_", " ")}{account.active ? " · Active" : " · Disabled"}
                          </option>
                        ))}
                      </select>
                    </label>
                    {availableUsers.length === 0 && <p className={styles.notice}>There are no unlinked user accounts.</p>}
                    <button type="button" className={styles.primaryButton} onClick={handleLink} disabled={!selectedUserId || saving}>
                      {saving ? "Linking…" : "Link account"}
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <div className={styles.footer}>
        <button type="button" className={styles.secondaryButton} onClick={() => onEdit(employee)}>
          <Pencil size={14} aria-hidden="true" /> Edit details
        </button>
        <button
          type="button"
          className={inactive ? styles.primaryButton : styles.dangerButton}
          onClick={() => setDialog(inactive ? "activate" : "deactivate")}
        >
          {inactive ? "Reactivate employee" : "Deactivate employee"}
        </button>
      </div>

      {dialog && (
        <Modal onClose={() => !saving && setDialog(null)}>
          {dialog === "deactivate" && (
            <ActionDialog
              title="Deactivate employee?"
              description={`This will mark ${employee.fullName} inactive, disable their linked login if it is active, and end their open production assignments.`}
              onCancel={() => setDialog(null)}
              onConfirm={() => saveStatus("INACTIVE")}
              confirmLabel={saving ? "Deactivating…" : "Deactivate employee"}
              disabled={saving}
              destructive
            />
          )}
          {dialog === "activate" && (
            <ActionDialog
              title={showRestoreChoice ? "Reactivate employee?" : "Reactivate employee?"}
              description={showRestoreChoice
                ? isAdmin
                  ? `The linked login for ${employee.fullName} was disabled during offboarding. Choose whether to restore that login too.`
                  : `The employee can return to active status. Their linked login remains disabled; an Admin must restore account access.`
                : `This will mark ${employee.fullName} as active again.`}
              onCancel={() => setDialog(null)}
              onConfirm={() => saveStatus("ACTIVE")}
              confirmLabel={saving ? "Activating…" : "Employee only"}
              disabled={saving}
              extraAction={showRestoreChoice && isAdmin ? {
                label: saving ? "Activating…" : "Employee + login",
                onClick: () => saveStatus("ACTIVE", true),
                disabled: saving,
              } : null}
            />
          )}
          {dialog === "unlink" && (
            <ActionDialog
              title="Unlink login account?"
              description="This only removes the connection to this employee. It does not activate, deactivate, or delete the user account."
              onCancel={() => setDialog(null)}
              onConfirm={handleUnlink}
              confirmLabel={saving ? "Unlinking…" : "Unlink account"}
              disabled={saving}
              destructive
            />
          )}
        </Modal>
      )}
    </DetailPanel>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoIcon}><Icon size={15} aria-hidden="true" /></span>
      <span className={styles.infoText}><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

function ActionDialog({ title, description, onCancel, onConfirm, confirmLabel, disabled, destructive, extraAction }) {
  return (
    <div className={styles.dialog}>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className={styles.dialogActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={disabled}>Cancel</button>
        <button type="button" className={destructive ? styles.dangerButton : styles.primaryButton} onClick={onConfirm} disabled={disabled}>{confirmLabel}</button>
        {extraAction && <button type="button" className={styles.primaryButton} onClick={extraAction.onClick} disabled={extraAction.disabled}>{extraAction.label}</button>}
      </div>
    </div>
  );
}
