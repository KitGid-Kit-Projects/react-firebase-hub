import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Bell,
  Monitor,
  Database,
  Shield,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      updates: true,
      marketing: false
    },
    appearance: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC'
    },
    privacy: {
      analytics: true,
      cookies: true,
      dataSharing: false
    },
    storage: {
      autoBackup: true,
      retentionDays: 30,
      compression: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const exportData = async () => {
    // In a real app, this would export user data
    console.log('Exporting data...');
  };

  const clearCache = async () => {
    // Clear application cache
    console.log('Clearing cache...');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and account settings.
          </p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose what notifications you want to receive and how.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications via email
                </div>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'email', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </div>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'push', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Product Updates</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about new features and updates
                </div>
              </div>
              <Switch
                checked={settings.notifications.updates}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'updates', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing</Label>
                <div className="text-sm text-muted-foreground">
                  Receive emails about tips, offers, and news
                </div>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'marketing', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize how the application looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => 
                    handleSettingChange('appearance', 'theme', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) => 
                    handleSettingChange('appearance', 'language', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={settings.appearance.timezone}
                  onValueChange={(value) => 
                    handleSettingChange('appearance', 'timezone', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>
              Control your privacy settings and data usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Analytics</Label>
                <div className="text-sm text-muted-foreground">
                  Help improve the app by sharing usage analytics
                </div>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'analytics', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Allow cookies for better user experience
                </div>
              </div>
              <Switch
                checked={settings.privacy.cookies}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'cookies', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Sharing</Label>
                <div className="text-sm text-muted-foreground">
                  Share anonymized data with third parties
                </div>
              </div>
              <Switch
                checked={settings.privacy.dataSharing}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'dataSharing', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Storage & Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>Storage & Backup</CardTitle>
            </div>
            <CardDescription>
              Manage your data storage and backup preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic Backup</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically backup your data to the cloud
                </div>
              </div>
              <Switch
                checked={settings.storage.autoBackup}
                onCheckedChange={(checked) => 
                  handleSettingChange('storage', 'autoBackup', checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Retention Period</Label>
              <Select
                value={settings.storage.retentionDays.toString()}
                onValueChange={(value) => 
                  handleSettingChange('storage', 'retentionDays', parseInt(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Compression</Label>
                <div className="text-sm text-muted-foreground">
                  Compress data to save storage space
                </div>
              </div>
              <Switch
                checked={settings.storage.compression}
                onCheckedChange={(checked) => 
                  handleSettingChange('storage', 'compression', checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Storage Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Documents</span>
                  <span>2.4 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Images</span>
                  <span>1.2 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other files</span>
                  <span>0.8 MB</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>4.4 MB of 15 GB used</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>
              Export, import, or delete your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your data as JSON
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Clear Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear application cache data
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearCache}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <CardTitle>Help & Support</CardTitle>
            </div>
            <CardDescription>
              Get help and learn more about the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Documentation</div>
                    <div className="text-sm text-muted-foreground">
                      Learn how to use all features
                    </div>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Contact Support</div>
                    <div className="text-sm text-muted-foreground">
                      Get help from our team
                    </div>
                  </div>
                </div>
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Application Version</h4>
                <p className="text-sm text-muted-foreground">
                  Firebase Dashboard v1.0.0
                </p>
              </div>
              <Badge variant="secondary">
                Latest
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;