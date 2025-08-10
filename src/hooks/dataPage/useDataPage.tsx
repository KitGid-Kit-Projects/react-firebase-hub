import React, { useState } from 'react'
import { useFirestore } from '../useFirestore';
import { useStorage } from '../useStorage';
import { useForm } from 'react-hook-form';
interface DocumentForm {
    title: string;
    content: string;
    status: string;
    category: string;
  }

export default function useDataPage() {
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
  return {documents, loading, addDocument, updateDocument, deleteDocument,
    searchTerm, setSearchTerm, filterStatus, setFilterStatus, editingDoc, setEditingDoc,
    isAddDialogOpen, setIsAddDialogOpen, selectedFile, setSelectedFile, fileUrl, setFileUrl,
    form, handleSubmit, handleEdit, handleDelete, handleFileUpload, getStatusColor,
    uploading,progress,filteredDocuments  
  }
}
