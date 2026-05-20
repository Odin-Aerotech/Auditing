import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://termmrqovmaoribumrra.supabase.co";

const supabaseKey = "sb_publishable_QSxI3Cidy6vQslmkDNJZBw_6FcCPDKm";

export const supabase = createClient(supabaseUrl, supabaseKey);