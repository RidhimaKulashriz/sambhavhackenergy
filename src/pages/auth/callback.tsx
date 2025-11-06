import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuth = async () => {
      try {
        // First, check if there was an error in the OAuth flow
        if (error) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        // Process the OAuth session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (data?.session) {
          // Successfully authenticated, redirect to dashboard or home
          navigate('/dashboard', { replace: true });
        } else {
          // No session found, redirect to login
          navigate('/auth', { 
            replace: true,
            state: { error: 'No active session found. Please sign in again.' }
          });
        }
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/auth', { 
          replace: true,
          state: { 
            error: err instanceof Error ? err.message : 'Authentication failed. Please try again.'
          }
        });
      }
    };

    handleAuth();
  }, [navigate, error, errorDescription]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}
