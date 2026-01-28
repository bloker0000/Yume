import { RESTAURANT_LOCATION, getRandomDriver, type Driver } from "@/data/driversData";

export interface TrackingState {
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED";
  driverLocation: { lat: number; lng: number } | null;
  driver: Driver | null;
  estimatedMinutes: number;
  statusMessage: string;
  progress: number;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  status: string;
  label: string;
  time: Date;
  completed: boolean;
  active: boolean;
}

const STATUS_DURATIONS = {
  PENDING: 1,
  CONFIRMED: 2,
  PREPARING: 10,
  READY: 2,
  OUT_FOR_DELIVERY: 15,
  DELIVERED: 0,
};

const STATUS_MESSAGES = {
  PENDING: "Your order is being processed...",
  CONFIRMED: "Order confirmed! Kitchen is getting ready.",
  PREPARING: "Our chefs are preparing your delicious ramen!",
  READY: "Your order is ready! Driver is picking it up.",
  OUT_FOR_DELIVERY: "Your order is on the way!",
  DELIVERED: "Delivered! Enjoy your meal!",
};

function interpolatePosition(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number
): { lat: number; lng: number } {
  const lat = start.lat + (end.lat - start.lat) * progress;
  const lng = start.lng + (end.lng - start.lng) * progress;
  
  const wobbleLat = (Math.random() - 0.5) * 0.001;
  const wobbleLng = (Math.random() - 0.5) * 0.001;
  
  return {
    lat: lat + wobbleLat,
    lng: lng + wobbleLng,
  };
}

function generateWaypoints(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  numPoints: number = 8
): { lat: number; lng: number }[] {
  const waypoints: { lat: number; lng: number }[] = [start];
  
  for (let i = 1; i < numPoints - 1; i++) {
    const progress = i / (numPoints - 1);
    const baseLat = start.lat + (end.lat - start.lat) * progress;
    const baseLng = start.lng + (end.lng - start.lng) * progress;
    
    const deviation = Math.sin(progress * Math.PI) * 0.005;
    const angle = Math.random() * Math.PI * 2;
    
    waypoints.push({
      lat: baseLat + deviation * Math.cos(angle),
      lng: baseLng + deviation * Math.sin(angle),
    });
  }
  
  waypoints.push(end);
  return waypoints;
}

export function simulateOrderTracking(
  orderCreatedAt: Date,
  deliveryAddress: { lat: number; lng: number },
  currentTime: Date = new Date()
): TrackingState {
  const elapsedMinutes = Math.floor((currentTime.getTime() - orderCreatedAt.getTime()) / (1000 * 60));
  
  let currentStatus: TrackingState["status"] = "PENDING";
  let accumulatedTime = 0;
  let statusStartTime = orderCreatedAt;
  const timeline: TimelineEvent[] = [];
  
  const statusOrder: TrackingState["status"][] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];
  
  const statusLabels: Record<string, string> = {
    PENDING: "Order Received",
    CONFIRMED: "Order Confirmed",
    PREPARING: "Preparing Your Order",
    READY: "Ready for Pickup",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };
  
  for (let i = 0; i < statusOrder.length; i++) {
    const status = statusOrder[i];
    const duration = STATUS_DURATIONS[status];
    
    const statusEndTime = accumulatedTime + duration;
    const completed = elapsedMinutes >= statusEndTime;
    const active = elapsedMinutes >= accumulatedTime && elapsedMinutes < statusEndTime;
    
    timeline.push({
      status,
      label: statusLabels[status],
      time: new Date(orderCreatedAt.getTime() + accumulatedTime * 60 * 1000),
      completed,
      active: !completed && active,
    });
    
    if (elapsedMinutes >= accumulatedTime && elapsedMinutes < statusEndTime) {
      currentStatus = status;
      statusStartTime = new Date(orderCreatedAt.getTime() + accumulatedTime * 60 * 1000);
    } else if (elapsedMinutes >= statusEndTime && i < statusOrder.length - 1) {
      currentStatus = statusOrder[i + 1] || status;
    }
    
    accumulatedTime = statusEndTime;
  }
  
  if (elapsedMinutes >= accumulatedTime) {
    currentStatus = "DELIVERED";
    timeline[timeline.length - 1].completed = true;
    timeline[timeline.length - 1].active = false;
  }
  
  const totalDuration = Object.values(STATUS_DURATIONS).reduce((a, b) => a + b, 0);
  const progress = Math.min(100, Math.round((elapsedMinutes / totalDuration) * 100));
  const estimatedMinutes = Math.max(0, totalDuration - elapsedMinutes);
  
  let driverLocation: { lat: number; lng: number } | null = null;
  let driver: Driver | null = null;
  
  if (currentStatus === "OUT_FOR_DELIVERY" || currentStatus === "READY") {
    driver = getRandomDriver();
    
    if (currentStatus === "OUT_FOR_DELIVERY") {
      const deliveryStartTime = Object.values(STATUS_DURATIONS)
        .slice(0, 4)
        .reduce((a, b) => a + b, 0);
      const deliveryDuration = STATUS_DURATIONS.OUT_FOR_DELIVERY;
      const deliveryElapsed = elapsedMinutes - deliveryStartTime;
      const deliveryProgress = Math.min(1, Math.max(0, deliveryElapsed / deliveryDuration));
      
      const waypoints = generateWaypoints(RESTAURANT_LOCATION, deliveryAddress);
      const waypointIndex = Math.floor(deliveryProgress * (waypoints.length - 1));
      const nextWaypointIndex = Math.min(waypointIndex + 1, waypoints.length - 1);
      const localProgress = (deliveryProgress * (waypoints.length - 1)) % 1;
      
      driverLocation = interpolatePosition(
        waypoints[waypointIndex],
        waypoints[nextWaypointIndex],
        localProgress
      );
    } else {
      driverLocation = { ...RESTAURANT_LOCATION };
    }
  }
  
  return {
    status: currentStatus,
    driverLocation,
    driver,
    estimatedMinutes,
    statusMessage: STATUS_MESSAGES[currentStatus],
    progress,
    timeline,
  };
}

export function getEstimatedDeliveryTime(orderCreatedAt: Date): Date {
  const totalMinutes = Object.values(STATUS_DURATIONS).reduce((a, b) => a + b, 0);
  return new Date(orderCreatedAt.getTime() + totalMinutes * 60 * 1000);
}

export function formatTimeRemaining(minutes: number): string {
  if (minutes <= 0) return "Arriving now!";
  if (minutes < 2) return "Less than 2 minutes";
  if (minutes < 5) return "About 5 minutes";
  return `${minutes} minutes`;
}