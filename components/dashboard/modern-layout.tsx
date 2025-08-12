"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Home,
  Building2,
  MessageSquare,
  Calculator,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  FileText,
} from "lucide-react"
import "../../app/dashboard/modern-dashboard.css"

interface ModernDashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Contacts", href: "/dashboard/contacts", icon: MessageSquare },
  { name: "Evaluations", href: "/dashboard/evaluations", icon: Calculator },
  { name: "Blog", href: "/dashboard/blog", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function ModernDashboardLayout({ children }: ModernDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1024
      setIsMobile(isMobileView)
      
      if (isMobileView) {
        // On mobile/tablet, hide sidebar completely by default
        setSidebarOpen(false)
        setIsCollapsed(false)
      } else {
        // On desktop, show sidebar expanded by default
        setSidebarOpen(true)
        setIsCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile, just toggle open/closed
      setSidebarOpen(!sidebarOpen)
    } else {
      // On desktop, cycle through: expanded -> mini -> expanded
      if (sidebarOpen && !isCollapsed) {
        setIsCollapsed(true)
      } else if (sidebarOpen && isCollapsed) {
        setSidebarOpen(false)
        setIsCollapsed(false)
      } else {
        setSidebarOpen(true)
        setIsCollapsed(false)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("vl-auth-state")
    window.location.href = "/dashboard/login"
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-container">
        {/* Mobile backdrop */}
        {sidebarOpen && isMobile && <div className="dashboard-backdrop show" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${
          isMobile 
            ? (sidebarOpen ? "open" : "mobile-hidden")
            : sidebarOpen 
              ? (isCollapsed ? "collapsed" : "open")
              : "mobile-hidden"
        }`}>
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <Link href="/dashboard" className="sidebar-logo">
              <div className="sidebar-logo-icon">VL</div>
              <div>
                <div className="sidebar-logo-text">VL Dashboard</div>
                <div className="sidebar-logo-subtitle">Real Estate Management</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-section-title">Main Navigation</h3>
              <ul className="nav-list">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name} className="nav-item">
                      <Link
                        href={item.href}
                        className={`nav-link ${isActive ? "active" : ""}`}
                        data-tooltip={item.name}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="nav-icon" />
                        <span className="nav-text">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* User Profile */}
          <div className="sidebar-user">
            <div className="user-profile">
              <div className="user-avatar">VL</div>
              <div className="user-info">
                <h4>Victoria Lancaster</h4>
                <p>Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`dashboard-main ${
          isMobile 
            ? (sidebarOpen ? "" : "sidebar-mobile-hidden")
            : sidebarOpen 
              ? (isCollapsed ? "sidebar-collapsed" : "")
              : "sidebar-mobile-hidden"
        }`}>
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-left">
              <button className="menu-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="header-title">Dashboard</h1>
            </div>
            <div className="header-right">
              <Link href="/" className="header-btn">
                <Home size={16} />
                <span>Back to Website</span>
              </Link>
           
              <button className="header-btn" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="dashboard-content">{children}</div>
        </main>
      </div>
    </div>
  )
}
