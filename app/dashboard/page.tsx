"use client"

import { useState, useEffect } from "react"
import ModernDashboardLayout from "../../components/dashboard/modern-layout"
import AuthGuard from "../../components/dashboard/auth-guard"
import {
  Building2,
  Users,
  Calculator,
  TrendingUp,
  Plus,
  MessageSquare,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Activity,
  FileText,MessageSquareText,
} from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [overview, setOverview] = useState<{
    stats: { evaluations: number; welcomes: number; contacts: number; properties: number }
    topBlogs: Array<{ id: number; slug: string; title: string | null; viewCount: number; featuredImageUrl: string | null }>
    topProperties: Array<{ id: number; slug: string; title: string | null; viewCount: number; photoUrl: string | null }>
    topPropertyMessages: Array<{ propertyId: number; slug: string; title: string | null; count: number }>
  } | null>(null)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/dashboard/overview')
        const data = await res.json()
        setOverview(data)
      } catch (e) {
        console.error('Failed to load overview', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <ModernDashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="loading-spinner"></div>
          </div>
        </ModernDashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <ModernDashboardLayout>
        <div className="fade-in">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">
              Welcome back, Victoria! Here's what's happening with your real estate business.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-header">
                <h3 className="stat-title">Total Properties</h3>
                <div className="stat-icon">
                  <Building2 size={20} />
                </div>
              </div>
              <div className="stat-value">{overview?.stats.properties ?? 0}</div>
             
            </div>

            <div className="stat-card green">
              <div className="stat-header">
                <h3 className="stat-title">Welcome Messages</h3>
                <div className="stat-icon green">
                  <Users size={20} />
                </div>
              </div>
              <div className="stat-value">{overview?.stats.welcomes ?? 0}</div>
            
            </div>

            <div className="stat-card yellow">
              <div className="stat-header">
                <h3 className="stat-title">Evaluations</h3>
                <div className="stat-icon yellow">
                  <Calculator size={20} />
                </div>
              </div>
              <div className="stat-value">{overview?.stats.evaluations ?? 0}</div>
           
            </div>

            <div className="stat-card purple">
              <div className="stat-header">
                <h3 className="stat-title">Contact Requests</h3>
                <div className="stat-icon purple">
                  <MessageSquareText size={20} />
                </div>
              </div>
              <div className="stat-value">{overview?.stats.contacts ?? 0}</div>
         
            </div>
          </div>

          {/* Top Blogs and Properties */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <TrendingUp size={20} />
                Top Content
              </h2>
              <p className="card-subtitle">Most visited blog posts and properties</p>
            </div>
            <div className="card-content grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Top Blogs</h3>
                <ul className="space-y-2">
                  {(overview?.topBlogs || []).map((b) => (
                    <li key={b.id} className="flex items-center justify-between">
                      <a href={`/blog/${b.slug}`} className="text-blue-600 hover:underline truncate max-w-[70%]">{b.title || b.slug}</a>
                      <span className="text-sm text-gray-500">{b.viewCount} views</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Top Properties</h3>
                <ul className="space-y-2">
                  {(overview?.topProperties || []).map((p) => (
                    <li key={p.id} className="flex items-center justify-between">
                      <a href={`/properties/${p.slug}`} className="text-blue-600 hover:underline truncate max-w-[70%]">{p.title || p.slug}</a>
                      <span className="text-sm text-gray-500">{p.viewCount} views</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Most messaged properties */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <MessageSquare size={20} />
                Most Messaged Properties
              </h2>
              <p className="card-subtitle">Count of contact messages per property</p>
            </div>
            <div className="card-content">
              <ul className="space-y-2">
                {(overview?.topPropertyMessages || []).map((m) => (
                  <li key={m.propertyId} className="flex items-center justify-between">
                    <a href={`/properties/${m.slug}`} className="text-blue-600 hover:underline truncate max-w-[70%]">{m.title || m.slug}</a>
                    <span className="text-sm text-gray-500">{m.count} messages</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">
                <Activity size={20} />
                Quick Actions
              </h2>
              <p className="card-subtitle">Frequently used actions for efficient workflow management</p>
            </div>
            <div className="card-content">
              <div className="quick-actions-grid">
                <a href="/dashboard/properties" className="quick-action">
                  <div className="quick-action-icon">
                    <Plus size={24} />
                  </div>
                  <div className="quick-action-content">
                    <h3>Add New Property</h3>
                    <p>List a new property for sale or rent</p>
                  </div>
                </a>

                <a href="/dashboard/contacts" className="quick-action">
                  <div className="quick-action-icon">
                    <Users size={24} />
                  </div>
                  <div className="quick-action-content">
                    <h3>Manage Contacts</h3>
                    <p>View and organize client information</p>
                  </div>
                </a>

                <a href="/dashboard/evaluations" className="quick-action">
                  <div className="quick-action-icon">
                    <Calculator size={24} />
                  </div>
                  <div className="quick-action-content">
                    <h3>Property Evaluations</h3>
                    <p>Review submitted property evaluations</p>
                  </div>
                </a>

                <a href="/dashboard/blog" className="quick-action">
                  <div className="quick-action-icon">
                    <FileText size={24} />
                  </div>
                  <div className="quick-action-content">
                    <h3>Manage Blog</h3>
                    <p>Create and edit blog posts</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
         
          {/* Performance Overview */}
    
        </div>
      </ModernDashboardLayout>
    </AuthGuard>
  )
}
