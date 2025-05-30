export default interface HeartEvent {
    start: Date;
    end: Date;
    pathology: Pathology; //TODO: Olga- maybe should be an enum
    notes: string;
}

export enum Pathology {
    AFib = "Atrial Fibrillation",
    AVBlock = "AV Block",
    Pause = "Pause",
    Tachycardia = "Tachycardia",
    SVT = "SVT",
    VT = "VT",
    Bradycardia = "Bradycardia",
}