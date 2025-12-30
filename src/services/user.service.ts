import { supabase } from "@/src/utilities/supabase";


export const upsertUser = async (
  userId: string,
  userData: Record<string, any>
) => {
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!existingUser) {
    const { error } = await supabase
      .from("users")
      .upsert({ id: userId, ...userData }, { onConflict: "id" });

    return { success: !error, error };
  }

  return { success: true };
};

export const checkUserExists = async (userId: string) => {
  const { data: existingUser, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (error) {
    return { exists: false, error };
  }

  return { exists: !!existingUser };
};

export const saveReferralUsage = async (deviceId: string, code: string) => {
  // Step 1: Check if the referral code exists in the referral_codes table
  const { data: existingCode, error: checkError } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("code", code)
    .single();

  if (checkError) {
    return { data: null, error: { message: "Referral code does not exist." } };
  }

  // Step 2: Proceed to insert if the code exists
  const { data, error } = await supabase
    .from("used_referral_codes")
    .insert([{ id: deviceId, code }])
    .select("*");

  if (error) {
    return {
      data: null,
      error: { message: "You have already used refferal code" },
    };
  }

  return { data: data?.[0] || null, error: null };
};

export const checkTrialActive = async (code: string) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("code", code)
      .gte("updated_at", thirtyDaysAgo.toISOString()) // updated_at >= 30 days ago
      .maybeSingle();

    if (error) {
      return { active: false, error };
    }

    // If data exists, trial is active
    if (data) {
      return { active: true, data };
    } else {
      return { active: false };
    }
  } catch (error) {
    return { active: false, error };
  }
};

