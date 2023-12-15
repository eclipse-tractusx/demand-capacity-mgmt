
export interface ConfiguredAlertProps {
    id: string;
    alertName: string
    threshold: string
    monitoredObjects: string
    type: string
    created: string
    dedicatedAlerts: DedicatedAlert[]
    triggerTimes: string
    triggerTimesInThreeMonths:  string
}

export interface DedicatedAlert{
    type: string;
    objectId: string
}

export interface TriggeredAlertProps {
    id: string;
    alertName: string
    threshold: string
    monitoredObjects: string
    created: string
    description: string
    type: string
    dedicatedAlerts: string[]
}