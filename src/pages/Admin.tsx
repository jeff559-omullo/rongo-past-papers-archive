import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  User,
  Calendar,
  Download,
  School,
  LogOut,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminPaperUpload from '@/components/AdminPaperUpload';

interface PaperData {
  id: string;
  title: string;
  course_name: string;
  course_code: string;
  year: number;
  exam_type: string;
  academic_year: string;
  semester: number;
  file_name: string;
  file_url: string;
  upload_date: string;
  download_count: number;
  status: string;
  uploaded_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

interface PaymentData {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  phone_number?: string;
  status: string;
  created_at: string;
  expires_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          _user_id: user.id
        });

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/');
          return;
        }

        if (!data) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate, toast]);

  // Fetch papers
  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers.",
        variant: "destructive"
      });
    } finally {
      setLoadingPapers(false);
    }
  };

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments.",
        variant: "destructive"
      });
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPapers();
      fetchPayments();
    }
  }, [isAdmin]);

  const handlePaperReview = async (paperId: string, status: 'approved' | 'rejected', notes: string = '') => {
    try {
      const { error } = await supabase
        .from('papers')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes
        })
        .eq('id', paperId);

      if (error) throw error;

      toast({
        title: "Paper Updated",
        description: `Paper has been ${status}.`,
      });

      fetchPapers();
      setSelectedPaper(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating paper:', error);
      toast({
        title: "Error",
        description: "Failed to update paper status.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-600">{status}</Badge>;
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-600">Rongo University Past Papers</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <School className="h-4 w-4 mr-2" />
                Back to Main
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.email} (Admin)
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-600">Pending Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {papers.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{payments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {payments.filter(p => p.status === 'completed' && new Date(p.expires_at) > new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="papers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paper Management
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Admin Upload
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Paper Approval Queue
                </CardTitle>
                <CardDescription>
                  Review and approve uploaded papers from students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPapers ? (
                  <p className="text-center py-8">Loading papers...</p>
                ) : papers.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No papers found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Year/Type</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {papers.map((paper) => (
                        <TableRow key={paper.id}>
                          <TableCell className="font-medium">{paper.title}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{paper.course_code}</p>
                              <p className="text-sm text-gray-500">{paper.course_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>Year {paper.year}</p>
                              <p className="text-sm text-gray-500 capitalize">{paper.exam_type.replace('-', ' ')}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(paper.upload_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(paper.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-gray-400" />
                              {paper.download_count}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedPaper(paper)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Review Paper</SheetTitle>
                                  <SheetDescription>
                                    Review and approve or reject this paper submission.
                                  </SheetDescription>
                                </SheetHeader>
                                {selectedPaper && (
                                  <div className="space-y-6 mt-6">
                                    <div>
                                      <h4 className="font-semibold mb-2">Paper Details</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><strong>Title:</strong> {selectedPaper.title}</p>
                                        <p><strong>Course:</strong> {selectedPaper.course_code} - {selectedPaper.course_name}</p>
                                        <p><strong>Year:</strong> {selectedPaper.year}</p>
                                        <p><strong>Type:</strong> {selectedPaper.exam_type.replace('-', ' ')}</p>
                                        <p><strong>Academic Year:</strong> {selectedPaper.academic_year}</p>
                                        <p><strong>Semester:</strong> {selectedPaper.semester}</p>
                                        <p><strong>File Name:</strong> {selectedPaper.file_name}</p>
                                        <p><strong>Upload Date:</strong> {new Date(selectedPaper.upload_date).toLocaleDateString()}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Review Notes</h4>
                                      <Textarea
                                        placeholder="Add notes about your review decision..."
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        rows={4}
                                      />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                      <Button
                                        onClick={() => handlePaperReview(selectedPaper.id, 'approved', reviewNotes)}
                                        className="flex-1"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handlePaperReview(selectedPaper.id, 'rejected', reviewNotes)}
                                        className="flex-1"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Admin Paper Upload
                </CardTitle>
                <CardDescription>
                  Upload papers directly as admin - these will be auto-approved and immediately available to users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPaperUpload onUpload={fetchPapers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  View all payment transactions and subscription status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <p className="text-center py-8">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No payments found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-xs">
                            {payment.user_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {payment.currency} {payment.amount}
                          </TableCell>
                          <TableCell className="capitalize">{payment.payment_method}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.transaction_id || 'N/A'}
                          </TableCell>
                          <TableCell>{payment.phone_number || 'N/A'}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.expires_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;