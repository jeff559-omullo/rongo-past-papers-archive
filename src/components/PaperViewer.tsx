import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaperAIChat from './PaperAIChat';

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
  const [activeTab, setActiveTab] = useState<string>("viewer");

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
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
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

          <TabsContent value="viewer" className="flex-1 m-0 p-0">
            <div className="w-full h-full">
              <iframe
                src={paper.file_url}
                className="w-full h-full border-0"
                title={paper.title}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai-help" className="flex-1 m-0 p-0 overflow-hidden">
            <PaperAIChat paper={paper} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaperViewer;
