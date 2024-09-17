import GoogleButton from 'react-google-button';
import { OAuthResponse } from '@supabase/supabase-js';
import supabase from "../../api/supabaseClient.ts";
import { useAppDispatch, useAppSelector } from "../../services/redux/typeHooks.ts";
import { setSession } from "../../services/redux/auth/auth.slice.ts";

const GButton = () => {
  const session = useAppSelector(state => state.authReducer.session);
  const dispatch = useAppDispatch();

  const signIn = async () => {
    try {
      const { error }: OAuthResponse =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'https://www.googleapis.com/auth/calendar',
          },
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(setSession(null));

  }

  return (
    <>
      {session ? (
        <>
          <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="h-[50px] w-[50px] rounded" />
          <button className="hover:bg-amber-50" onClick={signOut}>Logout</button>
        </>
      ) : (
        <GoogleButton onClick={signIn} className="w-full" />
      )}
    </>
  );
};

export default GButton;