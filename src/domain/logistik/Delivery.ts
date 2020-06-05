import {Address} from "./Address";

export type ReferenceType = "MATCH";
export type DeliveryState = "OPEN"
    | "PICKUP_BY_RECIPIENT_ANNOUNCED"
    | "DELIVERY_BY_DONOR_ANNOUNCED"
    | "PICKUP_CONFIRMED_BY_DONOR"
    | "DELIVERY_CONFIRMED_BY_RECIPIENT";

export interface Delivery {
    deliveryId: string;
    referenceId: string;
    referenceType: ReferenceType;
    deliveryFrom: Address;
    deliveryTo: Address;
    size: string;
    currentStateOfDelivery: DeliveryState;
}