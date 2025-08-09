import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import {
  FileText,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useDashBoardPage from '@/hooks/dashboardPage/useDashBoardPage';

const DashboardPage: React.FC = () => {

const {currentUser,documents: recentDocs, loading,stats, setStats,quickActions,statCards}=useDashBoardPage()
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {currentUser?.displayName || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your Firebase dashboard activity.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              Online
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.trend === 'up' && (
                    <div className="flex items-center pt-1">
                      <TrendingUp className="h-3 w-3 text-success mr-1" />
                      <span className="text-xs text-success">Trending up</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Documents
              </CardTitle>
              <CardDescription>
                Your latest document activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : recentDocs.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {recentDocs.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-medium">{doc.title || 'Untitled Document'}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                        </p>
                      </div>
                      <Badge variant="secondary">{doc.status || 'Active'}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No documents yet</p>
                  <Button asChild className="mt-3">
                    <Link to="/data">Create your first document</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Type:</span>
                  <Badge variant="secondary">Free Tier</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Member Since:</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUser?.metadata?.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Sign In:</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUser?.metadata?.lastSignInTime 
                      ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile">Manage Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;