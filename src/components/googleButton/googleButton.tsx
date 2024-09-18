import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "../../services/redux/typeHooks.ts";
import { setToken, setUser } from "../../services/redux/auth/auth.slice.ts";
import GoogleButton from "react-google-button";

const GButton = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.authReducer.token)

  const signIn = useGoogleLogin({
    onSuccess: (response) => {
      if (response.access_token) {
        dispatch(setToken(response.access_token));
      }
    }
  })

  const signOut = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <div>
      {token ? (
        <div>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <GoogleButton onClick={() => signIn()}>Google Login</GoogleButton>
      )}
    </div>
  );
};

export default GButton;
