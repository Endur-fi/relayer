import { MonitoringSDK } from "@hemantwasthere/monitoring-sdk";

export const monitoring = MonitoringSDK.initialize({
  projectName: "Relayer",
  serviceName: "relayer-service",
  technology: "nestjs",
  prefixAllMetrics: true,
  enableDefaultMetrics: true,
});

export const metrics = monitoring.getMetrics();
export const logger = monitoring.getLogger();
export const { MonitoringInterceptor } = monitoring.getMiddleware();


