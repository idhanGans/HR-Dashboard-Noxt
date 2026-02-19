import { useState } from "react";
import { DashboardLayout, Button, Card } from "../components";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import type { LayoutProps } from "../types/auth";

interface CompanyContact {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  description: string;
}

const DEFAULT_CONTACT: CompanyContact = {
  companyName: "Tech Solutions Inc.",
  email: "contact@techsolutions.com",
  phone: "+62812345678",
  address: "123 Business Street",
  city: "Jakarta",
  state: "DKI Jakarta",
  zipCode: "12345",
  website: "www.techsolutions.com",
  description: "Leading provider of innovative HR and business solutions",
};

export const ContactPage = ({ onLogout, userName, userRole }: LayoutProps) => {
  const [contactInfo, setContactInfo] =
    useState<CompanyContact>(DEFAULT_CONTACT);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CompanyContact>(contactInfo);

  const handleEditChange = <K extends keyof CompanyContact>(
    key: K,
    value: CompanyContact[K],
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setContactInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(contactInfo);
    setIsEditing(false);
  };

  const canEdit = userRole === "SUPERADMIN";

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Company Contact Information
          </h1>
          <p className="text-lightGrey text-sm">
            Manage your company profile, contact details, and office locations.
          </p>
        </div>
        {canEdit && (
          <Button
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save Changes" : "Edit Information"}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Company Profile Section */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">
              Company Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) =>
                    handleEditChange("companyName", e.target.value)
                  }
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Company Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  className="glass-input w-full resize-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => handleEditChange("website", e.target.value)}
                  className="glass-input w-full"
                  placeholder="www.example.com"
                />
              </div>
            </div>
          </Card>

          {/* Contact Information Section */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Address Section */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">
              Office Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => handleEditChange("city", e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => handleEditChange("state", e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={editForm.zipCode}
                    onChange={(e) =>
                      handleEditChange("zipCode", e.target.value)
                    }
                    className="glass-input w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Profile Card */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {contactInfo.companyName}
                </h2>
                <p className="text-lightGrey text-sm mt-2">
                  {contactInfo.description}
                </p>
              </div>
            </div>
            {contactInfo.website && (
              <div className="flex items-center gap-2 text-white">
                <Globe size={18} className="text-blue-400" />
                <a
                  href={`https://${contactInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {contactInfo.website}
                </a>
              </div>
            )}
          </Card>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Card */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-lightGrey uppercase tracking-wider mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <Mail size={24} className="text-blue-400 flex-shrink-0" />
              </div>
            </Card>

            {/* Phone Card */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-lightGrey uppercase tracking-wider mb-2">
                    Phone
                  </h3>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <Phone size={24} className="text-green-400 flex-shrink-0" />
              </div>
            </Card>
          </div>

          {/* Address Card */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-lightGrey uppercase tracking-wider mb-4">
                  Office Address
                </h3>
                <div className="space-y-2">
                  <p className="text-white text-lg font-medium">
                    {contactInfo.address}
                  </p>
                  <p className="text-lightGrey">
                    {contactInfo.city}, {contactInfo.state}{" "}
                    {contactInfo.zipCode}
                  </p>
                </div>
              </div>
              <MapPin size={24} className="text-red-400 flex-shrink-0" />
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};
