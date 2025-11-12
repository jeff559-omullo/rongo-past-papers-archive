import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaperAIChat from './PaperAIChat';
import { useToast } from '@/hooks/use-toast';

interface PaperViewerProps {
  isOpen: boolean;
  onClose: () => void;
  paper: {
    id: string;
    title: string;
    file_url: string;
    course: {
      code: string;
      name: string;
    };
  } | null;
}

const PaperViewer: React.FC<PaperViewerProps> = ({ isOpen, onClose, paper }) => {
  const [activeTab, setActiveTab] = useState<string>('viewer');
  const [paperText, setPaperText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && paper && !paperText) {
      extractPdfText();
    }
  }, [isOpen, paper]);

  // Auto-decide best way to display the PDF
  useEffect(() => {
    if (paper?.file_url) {
      // Prefer HTTPS to avoid mixed content errors
      let url = paper.file_url;
      if (!url.startsWith('https://') && url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }

      // Some browsers block direct embed; Google viewer is safest fallback
      const safeViewer = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      setViewerUrl(safeViewer);
    }
  }, [paper]);

  const extractPdfText = async () => {
    if (!paper?.file_url) return;
    setIsExtracting(true);
    try {
      const response = await fetch('https://zjecjayanqsjomtnsxmh.supabase.co/functions/v1/extract-paper-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZWNqYXlhbnFzam9tdG5zeG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTQ0OTQsImV4cCI6MjA2NzI5MDQ5NH0.vbFI2_wKy0B-jpLmCLdk6jHVdG9gTHjxEXrlH4E6F_I`
        },
        body: JSON.stringify({ fileUrl: paper.file_url })
      });

      const result = await response.json();

      if (result.success && result.text) {
        setPaperText(result.text);
        console.log('Extracted text length:', result.text.length);
      } else {
        throw new Error(result.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      toast({
        title: 'Warning',
        description: 'Could not extract paper content. AI answers may be limited.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  if (!paper) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-lg md:text-xl font-bold mb-1">
                {paper.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {paper.course.code} - {paper.course.name}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 border-b">
            <TabsList>
              <TabsTrigger value="viewer">View Paper</TabsTrigger>
              <TabsTrigger value="ai-help">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Help
              </TabsTrigger>
            </TabsList>
          </div>

          {/* VIEWER TAB */}
          <TabsContent value="viewer" className="flex-1 m-0 p-0">
            <div className="w-full h-full relative select-none" onContextMenu={(e) => e.preventDefault()}>
              <iframe
                src={viewerUrl}
                className="w-full h-full border-0 pointer-events-auto"
                title={paper.title}
                allow="fullscreen"
              />
            </div>
          </TabsContent>

          {/* AI HELP TAB */}
          <TabsContent value="ai-help" className="flex-1 m-0 p-0 overflow-hidden">
            <PaperAIChat paper={paper} paperText={paperText} isExtracting={isExtracting} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaperViewer;
