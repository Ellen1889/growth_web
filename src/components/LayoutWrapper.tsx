'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, FlaskConical, Library, Menu, X, Github, Linkedin, Twitter,
  GraduationCap, Package
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  href: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, href, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
      isActive
        ? 'bg-green-50 text-green-900 font-medium'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className={`${isActive ? 'text-green-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <h1 className="font-display font-bold text-xl tracking-tight text-gray-900">
              <span className="text-green-600">Ellen's</span> Growth.
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isActive={pathname === '/'}
            href="/"
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            label="My Newsletter"
            isActive={pathname?.startsWith('/newsletter') || false}
            href="/newsletter"
          />
          <SidebarItem
            icon={<Library size={20} />}
            label="Reviews"
            isActive={pathname?.startsWith('/reviews') || false}
            href="/reviews"
          />
          <SidebarItem
            icon={<GraduationCap size={20} />}
            label="Knowledge"
            isActive={pathname?.startsWith('/knowledge') || false}
            href="/knowledge"
          />
          <SidebarItem
            icon={<FlaskConical size={20} />}
            label="Experiments"
            isActive={pathname?.startsWith('/experiments') || false}
            href="/experiments"
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Tools & Stack"
            isActive={pathname?.startsWith('/tools') || false}
            href="/tools"
          />
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <h1 className="font-display font-bold text-lg text-gray-900">
            <span className="text-green-600">Ellen's</span> Growth.
          </h1>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 px-4 md:hidden">
          <nav className="space-y-2">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isActive={pathname === '/'}
              href="/"
              onClick={closeMobileMenu}
            />
            <SidebarItem
              icon={<BookOpen size={20} />}
              label="My Newsletter"
              isActive={pathname?.startsWith('/newsletter') || false}
              href="/newsletter"
              onClick={closeMobileMenu}
            />
            <SidebarItem
              icon={<Library size={20} />}
              label="Reviews"
              isActive={pathname?.startsWith('/reviews') || false}
              href="/reviews"
              onClick={closeMobileMenu}
            />
            <SidebarItem
              icon={<GraduationCap size={20} />}
              label="Knowledge"
              isActive={pathname?.startsWith('/knowledge') || false}
              href="/knowledge"
              onClick={closeMobileMenu}
            />
            <SidebarItem
              icon={<FlaskConical size={20} />}
              label="Experiments"
              isActive={pathname?.startsWith('/experiments') || false}
              href="/experiments"
              onClick={closeMobileMenu}
            />
            <SidebarItem
              icon={<Package size={20} />}
              label="Tools & Stack"
              isActive={pathname?.startsWith('/tools') || false}
              href="/tools"
              onClick={closeMobileMenu}
            />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-0 mt-14 md:mt-0 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
