export interface AvBlock {
    types?: AVBlockType[];
}

export enum AVBlockType {
    mobitz1 = 'Mobitz I',
    mobitz2 = 'Mobitz II',
    complete = 'Complete'
}