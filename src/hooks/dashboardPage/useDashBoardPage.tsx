import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "../useFirestore";
import { useEffect, useState } from "react";
import {
  Database,
  Users,
  FileText,
  Activity,
  Plus
} from 'lucide-react';
const useDashBoardPage = () => {
  const { currentUser } = useAuth();
  const { documents: recentDocs, loading } = useFirestore('documents');
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalUsers: 1,
    recentActivity: 0,
    storageUsed: '0 MB'
  });

  useEffect(() => {
    // Calculate stats from documents
    setStats(prev => ({
      ...prev,
      totalDocuments: recentDocs.length,
      recentActivity: recentDocs.filter(doc => {
        const createdAt = doc.createdAt?.toDate?.() || new Date(doc.createdAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return createdAt > dayAgo;
      }).length
    }));
  }, [recentDocs]);

  const quickActions = [
    {
      title: 'Add Document',
      description: 'Create a new document',
      icon: Plus,
      href: '/data',
      color: 'bg-primary'
    },
    {
      title: 'Manage Data',
      description: 'View and edit your data',
      icon: Database,
      href: '/data',
      color: 'bg-info'
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile',
      icon: Users,
      href: '/profile',
      color: 'bg-success'
    },
    {
      title: 'App Settings',
      description: 'Configure preferences',
      icon: Activity,
      href: '/settings',
      color: 'bg-warning'
    }
  ];

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      description: '+12% from last month',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'You are currently active',
      trend: 'up'
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Activity,
      description: 'Documents added today',
      trend: 'up'
    },
    {
      title: 'Storage Used',
      value: stats.storageUsed,
      icon: Database,
      description: 'Of 15 GB available',
      trend: 'neutral'
    }
  ];
    return {currentUser,documents: recentDocs, loading,stats, setStats,quickActions,statCards}
}

export default useDashBoardPage