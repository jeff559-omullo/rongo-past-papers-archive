
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, BookOpen, GraduationCap, School, User, LogOut } from 'lucide-react';
import PaperUpload from '@/components/PaperUpload';
import PapersDisplay from '@/components/PapersDisplay';
import PaymentModal from '@/components/PaymentModal';
import { Paper } from '@/types/papers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, hasAccess, isAdmin, signOut } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handlePaperUpload = (paperData: Omit<Paper, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const newPaper: Paper = {
      ...paperData,
      id: `paper-${Date.now()}`,
      uploadDate: new Date(),
      downloadCount: 0
    };

    setPapers(prev => [...prev, newPaper]);
    
    toast({
      title: "Paper uploaded successfully!",
      description: `${paperData.title} has been added to the collection.`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Welcome to Premium!",
      description: "You now have full access to all past papers.",
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <School className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 py-4 md:flex-row md:justify-between md:items-center md:space-y-0 md:py-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <School className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Rongo University</h1>
                <p className="text-xs md:text-sm text-gray-600">Past Papers Collection</p>
              </div>
            </div>
            
            {/* Mobile User Info */}
            <div className="flex items-center justify-between md:hidden">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {hasAccess ? 'Premium' : 'Free'} • {papers.length} Papers
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {hasAccess ? 'Premium Access' : 'Free Access'} • {papers.length} Papers
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Admin Button */}
            {isAdmin && (
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 w-full"
                >
                  <User className="h-4 w-4" />
                  Admin Panel
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-4 md:p-8">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex-1">
                  <h2 className="text-xl md:text-3xl font-bold mb-2">Welcome to Rongo University Past Papers</h2>
                  <p className="text-blue-100 text-sm md:text-lg">
                    {hasAccess 
                      ? "You have premium access! Download and view all papers across all years and courses."
                      : "Access our comprehensive collection of past examination papers. Premium access available for KSH 10."
                    }
                  </p>
                </div>
                <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-blue-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 h-12">
            <TabsTrigger value="browse" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
              Browse Papers
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Upload className="h-3 w-3 md:h-4 md:w-4" />
              Upload Paper
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Past Papers Collection
                  </CardTitle>
                  <CardDescription>
                    Browse and download past papers organized by year of study. 
                    {hasAccess 
                      ? "You have premium access to all papers!" 
                      : "Premium access required for full paper downloads."
                    }
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <PapersDisplay 
                hasAccess={hasAccess}
                onRequestPayment={() => setShowPaymentModal(true)}
              />
            </div>
          </TabsContent>

              <TabsContent value="upload">
            <div className="space-y-6">
              {isAdmin ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Admin Paper Upload
                      </CardTitle>
                      <CardDescription>
                        As an admin, you can upload papers directly. Use the Admin Panel for better paper management tools.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <PaperUpload onUpload={handlePaperUpload} />
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Paper Upload Restricted
                    </CardTitle>
                    <CardDescription>
                      Paper uploads are now restricted to administrators only to maintain quality and security. Contact an admin if you have papers to contribute.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Only administrators can upload papers</p>
                      <Button 
                        onClick={() => setShowPaymentModal(true)}
                        className="flex items-center gap-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Get Premium Access Instead
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">1st Year Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {papers.filter(p => p.year === 1).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">2nd Year Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {papers.filter(p => p.year === 2).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">3rd & 4th Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {papers.filter(p => p.year >= 3).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Index;
