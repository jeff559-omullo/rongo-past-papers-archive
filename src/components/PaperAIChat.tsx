import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PaperAIChatProps {
  paper?: {
    title: string;
    course?: { code: string; name: string };
  };
  paperText?: string;
  isExtracting?: boolean;
}

const PaperAIChat: React.FC<PaperAIChatProps> = ({ paper, paperText = '', isExtracting = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI assistant for "${paper?.title || 'this paper'}". Upload the paper or ask anything about it!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedText, setUploadedText] = useState<string>(paperText);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Upload and extract text from PDF
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsLoading(true);
    toast({ title: 'Uploading...', description: 'Extracting paper content, please wait.' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('https://zjecjayanqsjomtnsxmh.supabase.co/functions/v1/extract-paper-text', {
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZWNqYXlhbnFzam9tdG5zeG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTQ0OTQsImV4cCI6MjA2NzI5MDQ5NH0.vbFI2_wKy0B-jpLmCLdk6jHVdG9gTHjxEXrlH4E6F_I`,
        },
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.text) {
        setUploadedText(result.text);
        toast({ title: 'Upload successful', description: 'Paper content loaded successfully.' });
      } else {
        throw new Error(result.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not extract the paper text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `https://zjecjayanqsjomtnsxmh.supabase.co/functions/v1/paper-chat`;
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZWNqYXlhbnFzam9tdG5zeG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTQ0OTQsImV4cCI6MjA2NzI5MDQ5NH0.vbFI2_wKy0B-jpLmCLdk6jHVdG9gTHjxEXrlH4E6F_I`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          paperContext: uploadedText
            ? {
                title: paper?.title || 'Unknown Paper',
                course: `${paper?.course?.code || ''} - ${paper?.course?.name || ''}`,
                content: uploadedText.slice(0, 30000),
              }
            : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response.');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Parse only meaningful text (ignore data headers)
        const cleanText = chunk
          .split('\n')
          .map((line) => {
            try {
              if (line.startsWith('data:')) {
                const json = JSON.parse(line.replace('data: ', '').trim());
                return json.choices?.[0]?.delta?.content || '';
              }
            } catch {
              return '';
            }
            return '';
          })
          .join('');

        assistantMessage += cleanText;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMessage;
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while chatting.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    await streamChat(userMessage);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl break-words ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Assistant</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-4 border-t flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-2 rounded-lg text-sm hover:bg-muted/80">
          <Upload className="h-4 w-4" />
          <span>Upload PDF</span>
          <input type="file" accept="application/pdf" hidden onChange={handleFileUpload} />
        </label>

        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about this paper..."
            className="min-h-[60px] resize-none flex-1"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-[60px] w-[60px]">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PaperAIChat;
