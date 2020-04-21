import Ptr from "./Ptr";
import PtrEvent from "./PtrEvent";

function sendPtrEvent(evt: any, element: any, eventType: string) {
    // Needed to prevent scrolling of the screen while dragging on mobile.
    evt.preventDefault();

    const ptrEvent = new PtrEvent(eventType, {
        cancelable: evt.cancellable,
        bubbles: evt.bubbles,
        shiftKey: evt.shiftKey,
    });

    const touchInfo = {
        touches: Array.from(evt.touches, (t) => new Ptr(t)),
        targetTouches: Array.from(evt.targetTouches, (t) => new Ptr(t)),
        changedTouches: Array.from(evt.changedTouches, (t) => new Ptr(t)),
    };

    Object.assign(ptrEvent, touchInfo);

    element.dispatchEvent(ptrEvent);
}

class TouchAdaptor {
    constructor(elem: any) {
        this.registerListeners(elem);
    }

    public registerListeners(elem: any) {
        elem.addEventListener("touchstart", this.touchStartToPtr, false);
        elem.addEventListener("touchmove", this.touchMoveToPtr, false);
        elem.addEventListener("touchend", this.touchEndToPtr, false);
        elem.addEventListener("touchcancel", this.touchCancelToPtr, false);
        elem.addEventListener("touchleave", this.touchLeaveToPtr, false);
    }

    public removeListeners(elem: any) {
        elem.removeEventListener("touchstart", this.touchStartToPtr, false);
        elem.removeEventListener("touchmove", this.touchMoveToPtr, false);
        elem.removeEventListener("touchend", this.touchEndToPtr, false);
        elem.removeEventListener("touchcancel", this.touchCancelToPtr, false);
        elem.removeEventListener("touchleave", this.touchLeaveToPtr, false);
    }

    public touchStartToPtr(e: any) {
        sendPtrEvent(e, e.target, "ptrstart");
    }

    public touchMoveToPtr(e: any) {
        sendPtrEvent(e, e.target, "ptrmove");
    }

    public touchEndToPtr(e: any) {
        sendPtrEvent(e, e.target, "ptrend");
    }

    public touchCancelToPtr(e: any) {
        sendPtrEvent(e, e.target, "ptrcancel");
    }

    public touchLeaveToPtr(e: any) {
        sendPtrEvent(e, e.target, "ptrleave");
    }
}

export default TouchAdaptor;
