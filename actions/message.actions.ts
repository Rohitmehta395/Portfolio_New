'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/models/ContactMessage.model';

export interface SerializedMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function serializeMessage(doc: any): SerializedMessage {
  return {
    _id: String(doc._id),
    name: doc.name,
    email: doc.email,
    message: doc.message,
    read: Boolean(doc.read),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Fetches all contact messages.
 * Sort decision: { read: 1, createdAt: -1 } ensures that unread messages (read: false/0) 
 * appear at the top of the list, followed by read messages (read: true/1). Within each group,
 * messages are sorted by newest first. This perfectly utilizes the compound index
 * { read: 1, createdAt: -1 } defined in the model.
 */
export async function getMessages(): Promise<SerializedMessage[]> {
  try {
    await connectDB();
    const docs = await ContactMessage.find().sort({ read: 1, createdAt: -1 }).lean();
    return docs.map(serializeMessage);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid message ID format' };
    }

    await connectDB();
    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    ).lean();

    if (!updated) {
      return { success: false, error: 'Message not found' };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin'); // To update DashboardStats
    return { success: true };
  } catch (error: any) {
    console.error('Failed to mark message as read:', error);
    return { success: false, error: error.message || 'Failed to mark message as read' };
  }
}

export async function deleteMessage(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid message ID format' };
    }

    await connectDB();
    const deleted = await ContactMessage.findByIdAndDelete(id).lean();

    if (!deleted) {
      return { success: false, error: 'Message not found' };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin'); // To update DashboardStats
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete message:', error);
    return { success: false, error: error.message || 'Failed to delete message' };
  }
}
