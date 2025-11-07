
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { School, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // Update password state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    // Check if user is already logged in or if they're resetting password
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if this is a password recovery session
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery') {
        setIsUpdatingPassword(true);
      } else if (session && type !== 'recovery') {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  // Listen for Supabase auth events (helps password recovery flow)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdatingPassword(true);
      }
      if (event === 'USER_UPDATED') {
        navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    document.title = 'Login | Rongo University Past Papers';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signupPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      // Reset form
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
    }
    
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl }
    });

    if (error) {
      setError(error.message);
      toast({ title: 'Google Sign-in failed', description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
    // On success, Supabase redirects to Google then back to our app
  }; 

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const redirectUrl = `${window.location.origin}/auth`;

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResetSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setResetEmail('');
    }

    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated!",
        description: "Your password has been successfully changed. You can now log in with your new password.",
      });
      setIsUpdatingPassword(false);
      setNewPassword('');
      setConfirmNewPassword('');
      // Redirect to home or stay on auth page
      navigate('/');
    }

    setIsLoading(false);
  };

  // Show password update form if user clicked reset link
  if (isUpdatingPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4 animate-scale-in">
              <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
                <School className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Update Password</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Enter your new password below</p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl sm:text-2xl">Set New Password</CardTitle>
              <CardDescription className="text-sm">
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Updating password..."
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in px-2">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 animate-scale-in">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-full hover-scale">
              <School className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Rongo University
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Access Past Papers Collection</p>
        </div>

        <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl sm:text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-sm">
              Sign in or create an account to access past papers
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger value="login" className="text-xs sm:text-sm py-2">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs sm:text-sm py-2">Sign Up</TabsTrigger>
                <TabsTrigger value="reset" className="text-xs sm:text-sm py-2">Reset</TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mt-4 border-destructive/50 bg-destructive/10 animate-fade-in">
                  <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="animate-fade-in">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover-scale" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">Signing in...</span>
                      </span>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">or</span>
                  </div>

                  <Button type="button" variant="outline" className="w-full h-11 hover-scale" onClick={handleGoogleAuth}>
                    <Chrome className="mr-2 h-4 w-4" /> Continue with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Choose a strong password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 transition-all hover-scale" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">Creating account...</span>
                      </span>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">or</span>
                  </div>

                  <Button type="button" variant="outline" className="w-full h-11 hover-scale" onClick={handleGoogleAuth}>
                    <Chrome className="mr-2 h-4 w-4" /> Continue with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="animate-fade-in">
                {resetSent ? (
                  <div className="space-y-4 text-center py-8 animate-scale-in">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground px-4">
                      We've sent a password reset link to your email address. Click the link to reset your password.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setResetSent(false)}
                      className="w-full h-11 hover-scale"
                    >
                      Back to Reset
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 transition-all hover-scale" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-pulse">Sending reset link...</span>
                        </span>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 px-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            By signing up, you agree to access past papers responsibly and in accordance with academic integrity guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
