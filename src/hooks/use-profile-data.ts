import { useOnboardingStore } from "@/src/global-store/onboarding-store";

export const useProfileData = () => {
  const { name, birthDate, birthLocation, birthTime } = useOnboardingStore();

  // Zodiac calculation function (same as SettingUp.tsx)
  const getZodiacSign = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Sagittarius"; // default to match existing static data
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";

    return "Sagittarius";
  };

  const formatDate = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "1970-12-05"; // default to match existing static data
    }
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "11:47 PM"; // default to match existing static data
    }
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const profileData = {
    name: name || "Darlene",
    username: `@${(name || "Darlene").replace(/\s+/g, "")}31`,
    birthDate: formatDate(birthDate || new Date("1970-12-05")),
    birthPlace: birthLocation || "New York, NY, U.S.A",
    birthTime: formatTime(birthTime || new Date("1970-12-05T23:47:00")),
    signs: {
      sun: getZodiacSign(birthDate || new Date("1970-12-05")),
      moon: "Pisces", // simplified for now
      rising: "Virgo", // simplified for now
    },
  };

  return { profileData };
};