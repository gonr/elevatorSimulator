interface IinitialValue {
    elevatorCount: number;
    floorCount: number;
};

interface Window {
    activateFloor: (floor: number) => void;
    isActivatedFloor: (floor: number) => boolean;
}