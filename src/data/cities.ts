import type { CountryCode } from "../store/countryStore";

export interface CityData {
  [key: string]: string[];
}

export const citiesByCountry: Record<CountryCode, string[]> = {
  th: [
    "Bangkok",
    "Chiang Mai", 
    "Phuket",
    "Pattaya",
    "Krabi",
    "Hua Hin",
    "Koh Samui",
    "Chiang Rai",
    "Ayutthaya",
    "Nakhon Ratchasima",
    "Udon Thani",
    "Khon Kaen",
    "Nakhon Si Thammarat",
    "Hat Yai",
    "Rayong"
  ],
  ms: [
    "Kuala Lumpur",
    "George Town",
    "Johor Bahru", 
    "Ipoh",
    "Kuching",
    "Kota Kinabalu",
    "Shah Alam",
    "Malacca",
    "Petaling Jaya",
    "Seremban",
    "Kuala Terengganu",
    "Alor Setar",
    "Kota Bharu",
    "Kuantan",
    "Miri"
  ],
  ph: [
    "Manila",
    "Cebu City",
    "Davao City", 
    "Quezon City",
    "Makati",
    "Taguig",
    "Pasig",
    "Iloilo City",
    "Bacolod",
    "Cagayan de Oro",
    "Zamboanga City",
    "Antipolo",
    "Tarlac City",
    "Paranaque",
    "Las Pinas"
  ],
  id: [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang", 
    "Makassar",
    "Palembang",
    "Tangerang",
    "Depok",
    "Bekasi",
    "Bogor",
    "Batam",
    "Pekanbaru",
    "Bandar Lampung",
    "Malang"
  ]
};

export const getCitiesForCountry = (countryCode: CountryCode): string[] => {
  return citiesByCountry[countryCode] || [];
};
