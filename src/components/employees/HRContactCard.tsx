import { Card } from "../Card";
import { Mail, Phone, MapPin } from "lucide-react";

/**
 * HRContactCard - Displays HR contact information
 * @param {Object} contact - Contact information object
 */
export const HRContactCard = ({ contact }) => {
  const defaultContact = {
    email: "hr@company.com",
    phone: "+62 811-2222-0000",
    address: "Noxt HQ, Jakarta, Indonesia",
  };

  const { email, phone, address } = contact || defaultContact;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">HR Contact</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail size={20} className="text-silver mt-1" />
          <div>
            <p className="text-lightGrey text-sm mb-1">Email</p>
            <p className="text-white">{email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={20} className="text-silver mt-1" />
          <div>
            <p className="text-lightGrey text-sm mb-1">Phone</p>
            <p className="text-white">{phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-silver mt-1" />
          <div>
            <p className="text-lightGrey text-sm mb-1">Address</p>
            <p className="text-white">{address}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
