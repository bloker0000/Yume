export interface Driver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  vehicle: string;
  vehicleColor: string;
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
}

export const mockDrivers: Driver[] = [
  {
    id: "driver-001",
    name: "Kenji Tanaka",
    photo: "/drivers/driver1.jpg",
    phone: "+31 6 12345678",
    vehicle: "Scooter",
    vehicleColor: "Red",
    licensePlate: "AB-123-C",
    rating: 4.9,
    totalDeliveries: 1247,
  },
  {
    id: "driver-002",
    name: "Emma de Jong",
    photo: "/drivers/driver2.jpg",
    phone: "+31 6 23456789",
    vehicle: "E-Bike",
    vehicleColor: "Black",
    licensePlate: "N/A",
    rating: 4.8,
    totalDeliveries: 892,
  },
  {
    id: "driver-003",
    name: "Yuki Sato",
    photo: "/drivers/driver3.jpg",
    phone: "+31 6 34567890",
    vehicle: "Scooter",
    vehicleColor: "White",
    licensePlate: "CD-456-E",
    rating: 4.7,
    totalDeliveries: 2103,
  },
  {
    id: "driver-004",
    name: "Lars van Berg",
    photo: "/drivers/driver4.jpg",
    phone: "+31 6 45678901",
    vehicle: "E-Bike",
    vehicleColor: "Blue",
    licensePlate: "N/A",
    rating: 4.9,
    totalDeliveries: 567,
  },
  {
    id: "driver-005",
    name: "Hana Yamamoto",
    photo: "/drivers/driver5.jpg",
    phone: "+31 6 56789012",
    vehicle: "Scooter",
    vehicleColor: "Silver",
    licensePlate: "EF-789-G",
    rating: 5.0,
    totalDeliveries: 1834,
  },
];

export const RESTAURANT_LOCATION = {
  lat: 52.3676,
  lng: 4.9041,
  address: "Damrak 1, 1012 LG Amsterdam",
};

export function getRandomDriver(): Driver {
  const randomIndex = Math.floor(Math.random() * mockDrivers.length);
  return mockDrivers[randomIndex];
}

export function getDriverById(id: string): Driver | undefined {
  return mockDrivers.find(driver => driver.id === id);
}