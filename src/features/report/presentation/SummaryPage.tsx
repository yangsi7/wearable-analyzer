import { CheckCircleOutlineOutlined, ReportOutlined, ReportProblemOutlined } from "@mui/icons-material";
import { useSelectedDay } from "../../../pages/dashboard/state/SelectedDayContext"
import { HealthStatus } from "../domain/models/health_status_enum";
import { getHealthStatusFromReport } from "../domain/use_cases/get_health_status_from_report";
import { useState } from "react";
import { useEffect } from "react";
import { getMetricStatusFromReport } from "../domain/use_cases/get_metric_status_from_report";
import { MetricStatus } from "../domain/models/metrics/metric_status";
import { MetricType } from "../domain/models/metrics/metric_type";
import { MonitorCard } from "./components/MonitorCard";
import { getFormattedMetricValueFromReport } from "../domain/use_cases/get_formatted_metric_value_from_report";
import { getMetricUnit } from "../domain/use_cases/get_metric_unit";
import { Header } from "../../../common/presentation/components/Header";
import { SymptomList } from "../../../pages/dashboard/sections/SymptomList";
import { Link } from "react-router-dom";
import { DataQualityCard } from "../../../pages/dashboard/components/DataQualityCard";

const HealthStatusNote = ({ healthStatus }: { healthStatus: HealthStatus }) => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const addListeners = (callback: () => void) => {
            window.addEventListener('click', callback);
            window.addEventListener('touchmove', callback);
        }

        const removeListeners = (callback: () => void) => {
            window.removeEventListener('click', callback);
            window.removeEventListener('touchmove', callback);
        }

        const handleTap = () => {
            console.log('Tapped');
            setAnimate(false);
            removeListeners(handleTap);
        };

        addListeners(handleTap);

        const timer = setTimeout(() => {
            setAnimate(false);
            removeListeners(handleTap);
        }, 9000);

        return () => {
            clearTimeout(timer);
            removeListeners(handleTap);
        };
    }, []);

    const bgColor = () => {
        switch (healthStatus) {
            case HealthStatus.alert:
                return 'bg-alert/50 border-alert';
            case HealthStatus.warning:
                return 'bg-warning/50 border-warning';
            case HealthStatus.normal:
                return 'bg-normal/50 border-normal';
        }
    }

    const icon = () => {
        switch (healthStatus) {
            case HealthStatus.alert:
                return <ReportProblemOutlined />;
            case HealthStatus.warning:
                return <ReportOutlined />
            case HealthStatus.normal:
                return <CheckCircleOutlineOutlined />
        }
    }

    const description = () => {
        switch (healthStatus) {
            case HealthStatus.alert:
                return 'The patient\'s heart metrics suggest a need for review.';
            case HealthStatus.warning:
                return 'The patient\'s has metrics that should be monitored.';
            case HealthStatus.normal:
                return 'All heart metrics are within normal range';
        }
    }

    return (
        <div className={`text-md fit-content relative ${animate ? 'animate-pulse [animation-duration:3s]' : ''}  ${bgColor()} p-2 border-2 rounded-lg  text-gray-800`}>
            <div className="flex gap-2">
                {icon()}
                <h2 className="font-bold ">{healthStatus}</h2>
            </div>
            <p className=" text-sm text-gray-600">{description()}</p>
        </div>
    )
}


export const SummaryPage = () => {
    const { report } = useSelectedDay();
    if (!report) {
        return null;
    }

    const healthStatus = getHealthStatusFromReport(report);

    const metricsToMonitorWithStatus = Object.values(MetricType).map(metricType => {
        const status = getMetricStatusFromReport(report, metricType);
        return { metricType, status };
    }).filter(({ status }) => status && status !== MetricStatus.normal);

    // TODO: Olga - better logic for selecting symptom logs to show in summary
    const symptomLogs = report.loggedSymptoms.slice(0, 2);

    const summary = report.insights?.summary;


    return (
        <div className="min-h-screen bg-gray-100 max-w-md mx-auto">
            <Header title="Heart Health summary" />
            <div className="p-4 space-y-4 mx-auto text-gray-800">

                {summary ?
                    (<div className="bg-white rounded-lg shadow-sm p-4 space-y-1">
                        <h2 className="text-lg font-bold">Summary</h2>
                        <p>{summary}</p>
                        <HealthStatusNote healthStatus={healthStatus} />
                    </div>) :
                    <HealthStatusNote healthStatus={healthStatus} />
                }
                {report.dataQualityInfo && <DataQualityCard {...report.dataQualityInfo} />}
                <div>
                    <h2 className="text-lg font-bold">Metrics to monitor</h2>
                    <div className="space-y-2 p-2">
                        {metricsToMonitorWithStatus.map(metricTypeWithStatus => {
                            return (
                                <MonitorCard
                                    key={metricTypeWithStatus.metricType}
                                    metricType={metricTypeWithStatus.metricType}
                                    value={
                                        getFormattedMetricValueFromReport({ metricType: metricTypeWithStatus.metricType, report })
                                            .concat(' ', getMetricUnit(metricTypeWithStatus.metricType))
                                    }
                                    metricStatus={metricTypeWithStatus.status!}
                                />
                            )
                        })}
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold">Recent symptoms</h2>
                    <SymptomList symptomLogs={symptomLogs} />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 invisible">
                <div className="bg-blue-500 text-white rounded-md px-4 py-2 w-full block text-center">View full report</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 fixed bottom-0 left-0 right-0">
                <Link to={'/dashboard'} className="bg-blue-500 text-white rounded-md px-4 py-2 w-full block text-center">View full report</Link>
            </div>
        </div>
    )
}


