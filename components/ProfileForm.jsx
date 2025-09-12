"use client";

import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

export default function ProfileForm({ session }) {
  const { profile, createProfile, updateProfile, error, isLoading, setIsEdit } =
    useUserStore();

  // Prefill form if profile exists
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    dob: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        bio: profile.bio || "",
        dob: profile.dob || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (profile) {
        // Update existing profile
        await updateProfile(formData);
         toast.success("Profile updated successfully!");
        } else {
          // Create new profile
          await createProfile(formData);
          toast.success("Profile careted successfully!");
      }
      setIsEdit(false); // Close the form after saving
    } catch (err) {
      console.error("Profile save error:", err);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 mt-10 w-full">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {profile ? "Update Profile" : "Create Profile"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Firstname */}
          <div>
            <Label>First Name</Label>
            <Input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="John"
            />
          </div>

          {/* Lastname */}
          <div>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>

          {/* Bio - full width */}
          <div className="md:col-span-2">
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* DOB */}
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
          </div>

          {/* Location - full width */}
          <div className="md:col-span-2">
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Mumbai"
            />
          </div>

          {/* Buttons - full width */}
          <div className="md:col-span-2 flex gap-4 mt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : profile ? "Update" : "Create"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEdit(false)}
            >
              Cancel
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 md:col-span-2">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
