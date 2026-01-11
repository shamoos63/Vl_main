"use client"

import { useState, useEffect } from "react"
import ModernDashboardLayout from "@/components/dashboard/modern-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Save, AlertCircle, Lock, User as UserIcon } from "lucide-react"
import { useAuth } from '@/lib/auth-context'

// Contact settings interface
interface ContactSettings {
  phone: string
  email: string
  address: string
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
}

// Default contact settings
const defaultSettings: ContactSettings = {
  phone: "+971 4 2794 800-XX-XXX-XXXX",
  email: "victoria.lancaster@selectproperty.ae",
  address: "Dubai, United Arab Emirates",
  facebook: "https://www.facebook.com/share/1DCCCndqs9/?mibextid=wwXIfr",
  instagram: "https://instagram.com/vlrealestate",
  twitter: "https://twitter.com/vlrealestate",
  linkedin: "https://linkedin.com/company/vlrealestate",
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [profileName, setProfileName] = useState(user?.username || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountMessage, setAccountMessage] = useState("")

  // Keep the name field in sync with the authenticated user
  useEffect(() => {
    setProfileName(user?.username || "")
  }, [user])

  // Load settings from localStorage
  useEffect(() => {
    setIsLoading(true)
    try {
      const storedSettings = localStorage.getItem("vl-contact-settings")
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error("Error loading contact settings:", error)
    }
    setIsLoading(false)
  }, [])

  const handleInputChange = (field: keyof ContactSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Save to localStorage
      localStorage.setItem("vl-contact-settings", JSON.stringify(settings))

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("Settings saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveMessage("Error saving settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAccountSave = async () => {
    setAccountSaving(true)
    setAccountMessage("")
    try {
      if (!user?.username) {
        setAccountMessage("Not authenticated")
        return
      }
      if (newPassword || confirmPassword || currentPassword) {
        if (newPassword !== confirmPassword) {
          setAccountMessage("New passwords do not match")
          return
        }
        if (!currentPassword) {
          setAccountMessage("Current password is required to change password")
          return
        }
      }

      const payload: any = { username: user.username }
      if (profileName && profileName !== user.username) payload.newUsername = profileName
      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update account')
      }
      setAccountMessage('Account updated successfully')
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (e: any) {
      setAccountMessage(e.message || 'Failed to update account')
    } finally {
      setAccountSaving(false)
      setTimeout(() => setAccountMessage(""), 3000)
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setSaveMessage("")
  }

  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vl-blue"></div>
        </div>
      </ModernDashboardLayout>
    )
  }

  return (
    <ModernDashboardLayout>
      <div className="max-w-4xl bg-transparent rounded-lg shadow-lg p-6">
     
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              saveMessage.includes("Error")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Account Settings */}
          <Card className="bg-transparent border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 text-white ml-2 text-center" />
                Account Settings
              </CardTitle>
              <CardDescription>Change your display name and password</CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-transparent space-y-4">
              <div>
                <Label htmlFor="displayName" className="flex items-center">
                  <UserIcon className="h-4 w-4 ml-2 text-gray-500" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPassword" className="flex items-center">
                    <Lock className="h-4 w-4 ml-2 text-gray-500" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="flex items-center">
                    <Lock className="h-4 w-4 ml-2 text-gray-500" />
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="flex items-center">
                    <Lock className="h-4 w-4 ml-2 text-gray-500" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
              </div>

              {accountMessage && (
                <div className={`p-3 rounded-md text-sm ${accountMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {accountMessage}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleAccountSave} disabled={accountSaving} className="text-vl-yellow transform border hover:scale-105 transition-all">
                  {accountSaving ? 'Saving...' : 'Save Account Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Contact Information */}
         

       
        </div>

        {/* Preview Section */}
     

        {/* on Buttons */}
       
      </div>
    </ModernDashboardLayout>
  )
}
