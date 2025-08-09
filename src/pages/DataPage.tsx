import React, { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useStorage } from '@/hooks/useStorage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  FileText,
  Image as ImageIcon,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface DocumentForm {
  title: string;
  content: string;
  status: string;
  category: string;
}

const DataPage: React.FC = () => {
  const { documents, loading, addDocument, updateDocument, deleteDocument } = useFirestore('documents');
  const { uploadFile, uploading, progress } = useStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  const form = useForm<DocumentForm>({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      category: 'general'
    }
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (data: DocumentForm) => {
    try {
      const docData = {
        ...data,
        fileUrl: fileUrl || null,
        userId: 'current-user' // In real app, get from auth context
      };

      if (editingDoc) {
        await updateDocument(editingDoc.id, docData);
        setEditingDoc(null);
      } else {
        await addDocument(docData);
        setIsAddDialogOpen(false);
      }

      form.reset();
      setFileUrl('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    form.reset({
      title: doc.title || '',
      content: doc.content || '',
      status: doc.status || 'draft',
      category: doc.category || 'general'
    });
    setFileUrl(doc.fileUrl || '');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    try {
      const path = `documents/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      if (url) {
        setFileUrl(url);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage your documents with real-time updates.
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>
                  Add a new document to your collection. You can also upload files.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Document title"
                      {...form.register('title', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      {...form.register('status')}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    {...form.register('category')}
                  >
                    <option value="general">General</option>
                    <option value="projects">Projects</option>
                    <option value="notes">Notes</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Document content"
                    rows={6}
                    {...form.register('content')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Attach File (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    {uploading && (
                      <div className="flex items-center space-x-2">
                        <Progress value={progress} className="w-20" />
                        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                    )}
                  </div>
                  {fileUrl && (
                    <div className="flex items-center space-x-2 text-sm text-success">
                      <Upload className="h-4 w-4" />
                      <span>File uploaded successfully</span>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={uploading}>
                    Create Document
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {doc.title || 'Untitled Document'}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getStatusColor(doc.status)}>
                          {doc.status || 'draft'}
                        </Badge>
                        <Badge variant="outline">
                          {doc.category || 'general'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {doc.content || 'No content available.'}
                  </CardDescription>
                  
                  {doc.fileUrl && (
                    <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
                      {doc.fileUrl.includes('image') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span>Has attachment</span>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        className="p-0 h-auto"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {doc.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>You</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(doc)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Document</DialogTitle>
                          <DialogDescription>
                            Make changes to your document here.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                          {/* Same form fields as create dialog */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editTitle">Title</Label>
                              <Input
                                id="editTitle"
                                placeholder="Document title"
                                {...form.register('title', { required: true })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="editStatus">Status</Label>
                              <select
                                id="editStatus"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                {...form.register('status')}
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editCategory">Category</Label>
                            <select
                              id="editCategory"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              {...form.register('category')}
                            >
                              <option value="general">General</option>
                              <option value="projects">Projects</option>
                              <option value="notes">Notes</option>
                              <option value="reports">Reports</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editContent">Content</Label>
                            <Textarea
                              id="editContent"
                              placeholder="Document content"
                              rows={6}
                              {...form.register('content')}
                            />
                          </div>

                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setEditingDoc(null)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              Update Document
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            document and remove the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(doc.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first document.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DataPage;