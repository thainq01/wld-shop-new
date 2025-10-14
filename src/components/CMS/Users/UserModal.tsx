import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, User as UserIcon, Wallet, Image } from "lucide-react";
import { usersApi } from "../../../utils/api";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../types";

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onSave: () => void;
}

export function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    walletAddress: "",
    username: "",
    profilePictureUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        walletAddress: user.walletAddress,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl || "",
      });
    } else {
      setFormData({
        walletAddress: "",
        username: "",
        profilePictureUrl: "",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = "Invalid wallet address format";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, underscores, and hyphens";
    }

    if (formData.profilePictureUrl && !isValidUrl(formData.profilePictureUrl)) {
      newErrors.profilePictureUrl = "Invalid URL format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing && user) {
        const updateData: UpdateUserRequest = {
          username: formData.username,
          profilePictureUrl: formData.profilePictureUrl || null,
        };
        await usersApi.update(user.id, updateData);
        toast.success("User updated successfully");
      } else {
        const createData: CreateUserRequest = {
          walletAddress: formData.walletAddress,
          username: formData.username,
          profilePictureUrl: formData.profilePictureUrl || null,
        };
        await usersApi.create(createData);
        toast.success("User created successfully");
      }
      onSave();
    } catch (error: any) {
      console.error("Failed to save user:", error);

      // Handle validation errors from API
      if (error.message.includes("Validation errors:")) {
        const validationPart = error.message.split("Validation errors: ")[1];
        const validationErrors: Record<string, string> = {};

        validationPart.split(", ").forEach((errorPair: string) => {
          const [field, message] = errorPair.split(": ");
          if (field && message) {
            validationErrors[field] = message;
          }
        });

        setErrors(validationErrors);
        toast.error("Please fix the validation errors");
      } else if (error.message.includes("already exists")) {
        setErrors({
          walletAddress: "User with this wallet address already exists",
        });
        toast.error("User with this wallet address already exists");
      } else {
        toast.error(`Failed to ${isEditing ? "update" : "create"} user`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit User" : "Create New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Wallet className="w-4 h-4 inline mr-1" />
              Wallet Address *
            </label>
            <input
              type="text"
              value={formData.walletAddress}
              onChange={(e) =>
                handleInputChange("walletAddress", e.target.value)
              }
              disabled={isEditing} // Can't change wallet address when editing
              placeholder="0x..."
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.walletAddress
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.walletAddress && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.walletAddress}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <UserIcon className="w-4 h-4 inline mr-1" />
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Image className="w-4 h-4 inline mr-1" />
              Profile Picture URL
            </label>
            <input
              type="url"
              value={formData.profilePictureUrl}
              onChange={(e) =>
                handleInputChange("profilePictureUrl", e.target.value)
              }
              placeholder="https://example.com/avatar.jpg"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.profilePictureUrl
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.profilePictureUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.profilePictureUrl}
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.profilePictureUrl &&
            isValidUrl(formData.profilePictureUrl) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </label>
                <div className="flex items-center space-x-3">
                  <img
                    src={formData.profilePictureUrl}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Profile picture preview
                  </span>
                </div>
              </div>
            )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
