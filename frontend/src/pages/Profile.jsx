import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Edit, Camera } from "lucide-react"; // Removed unused Phone, Mail
import { useApp } from "../context/RealAppContext";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = { ...formData };
      if (selectedAvatar) {
        profileData.avatar = selectedAvatar;
      }
      const updatedUser = await updateProfile(profileData);
      if (updatedUser) {
        // Update form data with the response to ensure consistency
        setFormData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          address: {
            street: updatedUser.address?.street || "",
            city: updatedUser.address?.city || "",
            state: updatedUser.address?.state || "",
            zipCode: updatedUser.address?.zipCode || "",
            country: updatedUser.address?.country || "",
          },
        });
        // Clear avatar selection after successful update
        setSelectedAvatar(null);
        setAvatarPreview(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error toast is handled in updateProfile function
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>My Profile</h1>
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            <Edit size={16} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </motion.div>

        <motion.div
          className="profile-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                
                {/* Avatar Upload Section */}
                <div className="avatar-upload-section">
                  <div className="current-avatar">
                    <img 
                      src={avatarPreview || user?.avatar || '/default-avatar.png'} 
                      alt="Profile" 
                      className="avatar-image"
                    />
                  </div>
                  <div className="avatar-upload">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="avatar-upload" className="avatar-upload-btn">
                      <Camera size={16} />
                      Change Photo
                    </label>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Address</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-section">
                <div className="section-header">
                  <User size={20} />
                  <h3>Personal Information</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{user.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <div className="section-header">
                  <MapPin size={20} />
                  <h3>Address</h3>
                </div>
                <div className="address-display">
                  {user.address ? (
                    <>
                      <p>{user.address.street}</p>
                      <p>
                        {user.address.city}, {user.address.state}{" "}
                        {user.address.zipCode}
                      </p>
                      <p>{user.address.country}</p>
                    </>
                  ) : (
                    <p>No address provided</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
