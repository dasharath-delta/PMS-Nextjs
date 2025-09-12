'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); // <-- for temporary message

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setResponseMessage('Please fill all fields');
      setTimeout(() => setResponseMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setResponseMessage('Thank you for contacting us!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResponseMessage(data.message || 'Failed to send message');
      }

      // Hide message after 4 seconds
      setTimeout(() => setResponseMessage(''), 4000);
    } catch (err) {
      setResponseMessage('Something went wrong. Please try again.');
      setTimeout(() => setResponseMessage(''), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>

          {/* Temporary response message */}
          {responseMessage && (
            <p className="text-center text-green-600 mt-2">{responseMessage}</p>
          )}
        </form>
      </div>
    </main>
  );
}
