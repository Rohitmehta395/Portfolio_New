import React from 'react';
import { getMessages } from '@/actions/message.actions';
import { MessageList } from '@/features/admin/MessageList';

export const metadata = {
  title: 'Manage Messages | Admin',
};

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2 border-b border-neutral-900 pb-4">
        <h2 className="text-2xl font-bold tracking-tight">Contact Messages</h2>
        <p className="text-muted-foreground">
          View, triage, and manage messages sent from the public contact form.
        </p>
      </div>
      <MessageList messages={messages} />
    </div>
  );
}
