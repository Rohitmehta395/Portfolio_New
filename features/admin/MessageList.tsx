'use client';

import React, { useTransition } from 'react';
import { SerializedMessage } from '@/actions/message.actions';
import { markAsRead, deleteMessage } from '@/actions/message.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * MessageList Component
 * Decision: Mark-as-read is EXPLICIT. 
 * An explicit "Mark as Read" button requires deliberate action, preventing accidental
 * marking of messages just by scrolling or clicking on them. It provides a clearer 
 * sense of triaging control.
 */
export function MessageList({ messages }: { messages: SerializedMessage[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markAsRead(id);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this message?')) {
      startTransition(async () => {
        await deleteMessage(id);
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center p-12 border rounded-xl border-dashed">
        <p className="text-muted-foreground">No messages found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Card key={msg._id} className={msg.read ? 'opacity-70 bg-muted/40' : 'border-l-4 border-l-blue-500 bg-muted'}>
          <CardHeader className="pb-3 flex flex-row justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {msg.name}
                {!msg.read && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">New</span>}
              </CardTitle>
              <CardDescription>
                <a href={`mailto:${msg.email}`} className="hover:underline text-muted-foreground">{msg.email}</a>
                <span className="mx-2">•</span>
                {new Date(msg.createdAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!msg.read && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={isPending} 
                  onClick={() => handleMarkAsRead(msg._id)}
                >
                  Mark as Read
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm" 
                disabled={isPending} 
                onClick={() => handleDelete(msg._id)}
              >
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-secondary-foreground">
              {msg.message}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
