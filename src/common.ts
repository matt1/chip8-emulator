/** Represents a type that can "tick" with the system clock. */
export interface Tickable {
    tick():void;
}