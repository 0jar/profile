interface GeographyNode {
  nodeId: string;
  isHometown?: boolean;
  coordinates: [number, number];
  utcOffsetLabel: string;
  gdpNominalUsdBillions: number;
  gdpYear: number;
  gdpSourceUrl: string;
}

export const geoNodes: readonly GeographyNode[] = [
  {
    nodeId: "hanoi",
    coordinates: [105.8342, 21.0278],
    utcOffsetLabel: "ICT (UTC+7)",
    gdpNominalUsdBillions: 476.32,
    gdpYear: 2024,
    gdpSourceUrl: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=VN"
  },
  {
    nodeId: "tartu",
    isHometown: true,
    coordinates: [26.729, 58.378],
    utcOffsetLabel: "EET (UTC+2) or EEST (UTC+3)",
    gdpNominalUsdBillions: 43.13,
    gdpYear: 2024,
    gdpSourceUrl: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=EE"
  }
];

export const earthRad = 6371.0088;

export function calcHaversine(
  coordA: [number, number],
  coordB: [number, number]
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const [lon1, lat1] = coordA;
  const [lon2, lat2] = coordB;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRad * Math.asin(Math.sqrt(a));
}
