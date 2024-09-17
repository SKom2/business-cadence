import { Session } from '@supabase/supabase-js';

export interface IAuthResponse {
  session: Session | null;
}
