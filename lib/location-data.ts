// This file contains all the location data for the grocery platform

export type Region = {
  id: number
  name: string
  cities: City[]
}

export type City = {
  id: number
  name: string
  neighborhoods: string[]
}

// Define the 10 regions of Cameroon with major cities
export const regions: Region[] = [
  {
    id: 1,
    name: "Southwest",
    cities: [
      {
        id: 101,
        name: "Buea",
        neighborhoods: [
          "Molyko",
          "Bomaka",
          "Great Soppo",
          "Small Soppo",
          "Bonduma",
          "Mile 16",
          "Mile 17",
          "Bokwango",
          "Clerks' Quarters",
          "Federal Quarters",
          "Bokwaongo",
          "Muea",
        ],
      },
      {
        id: 102,
        name: "Limbe",
        neighborhoods: ["Down Beach", "Mile 4", "Bota", "New Town", "Church Street", "Mile 2", "Isokolo"],
      },
      {
        id: 103,
        name: "Kumba",
        neighborhoods: ["Fiango", "Mbonge Road", "Three Corners", "Kosala", "Buea Road", "Station"],
      },
    ],
  },
  {
    id: 2,
    name: "Littoral",
    cities: [
      {
        id: 201,
        name: "Douala",
        neighborhoods: [
          "Akwa",
          "Bonanjo",
          "Bonapriso",
          "Bonaberi",
          "Deido",
          "Bepanda",
          "New Bell",
          "Makepe",
          "Ndokoti",
          "Logbaba",
        ],
      },
      {
        id: 202,
        name: "Nkongsamba",
        neighborhoods: ["Central", "Quartier 1", "Quartier 2", "Quartier 3", "Quartier 4"],
      },
      {
        id: 203,
        name: "Edea",
        neighborhoods: ["Centre Ville", "Quartier Administratif", "Quartier Commercial", "Quartier Résidentiel"],
      },
    ],
  },
  {
    id: 3,
    name: "Central",
    cities: [
      {
        id: 301,
        name: "Yaoundé",
        neighborhoods: [
          "Bastos",
          "Mvog-Mbi",
          "Mvan",
          "Biyem-Assi",
          "Mfandena",
          "Nsimeyong",
          "Ngoa-Ekelle",
          "Mfoundi",
          "Elig-Essono",
          "Omnisport",
        ],
      },
      {
        id: 302,
        name: "Mbalmayo",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
      {
        id: 303,
        name: "Obala",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 4,
    name: "Northwest",
    cities: [
      {
        id: 401,
        name: "Bamenda",
        neighborhoods: [
          "Commercial Avenue",
          "City Chemist",
          "Nkwen",
          "Bambili",
          "Up Station",
          "Old Town",
          "Ntarinkon",
          "Azire",
          "Mankon",
          "Bayelle",
        ],
      },
      {
        id: 402,
        name: "Kumbo",
        neighborhoods: ["Squares", "Tobin", "Mbveh", "Mbuluf", "Shisong"],
      },
      {
        id: 403,
        name: "Nkambe",
        neighborhoods: ["Central", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 5,
    name: "West",
    cities: [
      {
        id: 501,
        name: "Bafoussam",
        neighborhoods: ["Marché A", "Marché B", "Tamdja", "Kamkop", "Banengo", "Djeleng"],
      },
      {
        id: 502,
        name: "Dschang",
        neighborhoods: ["Centre Ville", "Quartier 1", "Quartier 2", "Quartier 3", "Quartier 4"],
      },
      {
        id: 503,
        name: "Mbouda",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 6,
    name: "Adamawa",
    cities: [
      {
        id: 601,
        name: "Ngaoundéré",
        neighborhoods: ["Bamyanga", "Burkina", "Joli Soir", "Mbideng", "Madagascar", "Norvegien"],
      },
      {
        id: 602,
        name: "Meiganga",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
      {
        id: 603,
        name: "Tibati",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 7,
    name: "North",
    cities: [
      {
        id: 701,
        name: "Garoua",
        neighborhoods: ["Roumdé Adjia", "Bibémiré", "Foulbéré", "Laindé", "Poumpouré"],
      },
      {
        id: 702,
        name: "Guider",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
      {
        id: 703,
        name: "Poli",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 8,
    name: "Far North",
    cities: [
      {
        id: 801,
        name: "Maroua",
        neighborhoods: ["Domayo", "Doualaré", "Djarengol", "Kakataré", "Zokok", "Palar"],
      },
      {
        id: 802,
        name: "Kousseri",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
      {
        id: 803,
        name: "Mokolo",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 9,
    name: "East",
    cities: [
      {
        id: 901,
        name: "Bertoua",
        neighborhoods: ["Centre Administratif", "Nkolbikon", "Madagascar", "Mokolo", "Tigaza"],
      },
      {
        id: 902,
        name: "Abong-Mbang",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
      {
        id: 903,
        name: "Batouri",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
  {
    id: 10,
    name: "South",
    cities: [
      {
        id: 1001,
        name: "Ebolowa",
        neighborhoods: ["Centre Commercial", "Nko'ovos", "Angalé", "Mvog-Mbi", "Nkolandom"],
      },
      {
        id: 1002,
        name: "Kribi",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3", "Quartier 4"],
      },
      {
        id: 1003,
        name: "Sangmélima",
        neighborhoods: ["Centre", "Quartier 1", "Quartier 2", "Quartier 3"],
      },
    ],
  },
]

// Helper functions
export function getRegionById(id: number): Region | undefined {
  return regions.find((region) => region.id === id)
}

export function getCityById(id: number): City | undefined {
  const regionId = Math.floor(id / 100)
  const region = getRegionById(regionId)
  return region?.cities.find((city) => city.id === id)
}

export function getRandomNeighborhood(cityId: number): string {
  const city = getCityById(cityId)
  if (!city || city.neighborhoods.length === 0) return "Central"
  return city.neighborhoods[Math.floor(Math.random() * city.neighborhoods.length)]
}

export function getAllCities(): City[] {
  return regions.flatMap((region) => region.cities)
}

export function getCitiesByRegion(regionId: number): City[] {
  const region = getRegionById(regionId)
  return region ? region.cities : []
}

export function getDefaultCity(): City {
  return regions[0].cities[0]
}
