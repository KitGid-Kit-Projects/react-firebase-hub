import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export const useFirestore = (collectionName: string) => {
  const [documents, setDocuments] = useState<FirestoreDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Real-time listener
  useEffect(() => {
    const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: FirestoreDocument[] = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  const addDocument = async (data: any) => {
    try {
      setLoading(true);
      const docData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await addDoc(collection(db, collectionName), docData);
      toast({
        title: "Document added",
        description: "Document has been successfully created",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error adding document",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, data: any) => {
    try {
      setLoading(true);
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: new Date()
      };
      await updateDoc(docRef, updateData);
      toast({
        title: "Document updated",
        description: "Document has been successfully updated",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating document",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error deleting document",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocuments = async (queryOptions?: {
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
    limitCount?: number;
    whereClause?: { field: string; operator: any; value: any };
  }) => {
    try {
      setLoading(true);
      const colRef = collection(db, collectionName);
      let q = query(colRef);

      if (queryOptions?.whereClause) {
        q = query(q, where(
          queryOptions.whereClause.field,
          queryOptions.whereClause.operator,
          queryOptions.whereClause.value
        ));
      }

      if (queryOptions?.orderByField) {
        q = query(q, orderBy(
          queryOptions.orderByField,
          queryOptions.orderDirection || 'desc'
        ));
      }

      if (queryOptions?.limitCount) {
        q = query(q, limit(queryOptions.limitCount));
      }

      const snapshot = await getDocs(q);
      const docs: FirestoreDocument[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      setDocuments(docs);
      return docs;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching documents",
        description: err.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments
  };
};