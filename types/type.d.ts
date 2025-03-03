import {
  ImageStyle,
  TextInputProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

declare interface Driver {
  id: string | number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: string | number;
}

declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: string | number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: string | number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

declare interface Ride {
  ride_id: number | string;
  origin_address: string;
  destination_address: string;
  origin_latitude: number | string;
  origin_longitude: number | string;
  destination_latitude: number | string;
  destination_longitude: number | string;
  ride_time: number;
  fare_price: number | string;
  payment_status: string;
  driver_id: number | string;
  user_id: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
    driver_id: number | srting;
    profile_image_url: string;
    car_image_url: string;
    rating: string;
  };
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: ViewStyle;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconStyle?: ImageStyle;
  className?: string;
  iconRight?: any;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: number;
  rideTime: number;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  status: "pending" | "approved" | "denied" | "notApplied";
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  setStatus: (stat: "pending" | "approved" | "denied" | "notApplied") => void;
  clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
  item: MarkerData;
  selected: number;
  setSelected?: () => void;
}

declare interface LocationCoords {
  latitude: number;
  longitude: number;
}

declare interface Driver {
  driverId: string;
  lat: number;
  lon: number;
}

declare interface UserLocation {
  userId: string;
  lat: number;
  lon: number;
}
