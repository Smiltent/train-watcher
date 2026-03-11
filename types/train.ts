
export interface StopData {
    title: string,
    departure: string,
}

export interface TrainColor {
    color: string,
    svg: string,
    fuelType: string
}

export interface ReturnValues {
    train: string,
    stopped: string,
    nextStopObj: StopData[],
    isGpsActive: string,

    currentStop: [number, number],

    departureTime: string,
    arrivalTime: string,

    customArrivingTime: boolean,
    finished: boolean,
}

export interface Train {
    trainColor: TrainColor,
    stopCoordArray: [][],
    returnValue: ReturnValues
    name: string
}

export interface MintifiedTrain {
    id: string,
    name: string,
    nextStop: [number, number]
}

export interface BackEndTrains {
    type: string,
    data: Train[]
}