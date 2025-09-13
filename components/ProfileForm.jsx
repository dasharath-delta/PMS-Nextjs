'use client';

import { useUserStore } from '@/store/useUserStore';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';

export default function ProfileForm({ session }) {
  const {
    profile,
    createProfile,
    updateProfile,
    uploadAvatar,
    error,
    isLoading,
    setIsEdit,
  } = useUserStore();

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    bio: '',
    dob: '',
    phone: '',
    location: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        bio: profile.bio || '',
        dob: profile.dob || '',
        phone: profile.phone || '',
        location: profile.location || '',
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
        await updateProfile(formData);
        toast.success('Profile updated successfully!');
      } else {
        await createProfile(formData);
        toast.success('Profile created successfully!');
      }

      // upload avatar if new file selected
      if (avatarFile) {
        await uploadAvatar(avatarFile);
        toast.success("Avatar updated successfully!");
      }

      setIsEdit(false);
    } catch (err) {
      console.error('Profile save error:', err);
      toast.error(err.message || "Failed to save profile");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 w-full">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {profile ? 'Update Profile' : 'Create Profile'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Avatar Upload */}
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
               src={
                avatarFile
                  ? URL.createObjectURL(avatarFile) // show preview
                  : profile?.avatar || <User/>
              }
                alt={profile?.username || 'User Avatar'}
                className="object-cover"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="cursor-pointer"
            />
          </div>

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

          {/* Bio */}
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
              max={today}
              min={"1900-01-01"}
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

          {/* Location */}
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

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-4 mt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : profile ? 'Update' : 'Create'}
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
