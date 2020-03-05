import Ptr from "./Ptr";
import PtrEvent from "./PtrEvent";

function sendPtrEvent(x: number, y: number, element: any, eventType: string) {
    const ptrEvent = new PtrEvent(eventType, {
        cancelable: true,
        bubbles: true,
        shiftKey: true,
    });

    const ptrObj = new Ptr({
        identifier: 0,
        target: element,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
    });

    const touchInfo = {
        touches: [ptrObj],
        targetTouches: [],
        changedTouches: [ptrObj],
    };

    Object.assign(ptrEvent, touchInfo);


    element.dispatchEvent(ptrEvent);
}

class MouseAdaptor {
    private touchStarted: boolean;

    constructor(elem: any) {
        this.registerListeners(elem);
        this.touchStarted = false;
    }

    public registerListeners(elem: any) {
        elem.addEventListener("mousedown", this.mouseDownToPtr, false);
        elem.addEventListener("mousemove", this.mouseMoveToPtr, false);
        elem.addEventListener("mouseup", this.mouseUpToPtr, false);
        elem.addEventListener("mouseleave", this.mouseLeaveToPtr, false);
    }

    public removeListeners(elem: any) {
        elem.removeEventListener("mousedown", this.mouseDownToPtr, false);
        elem.removeEventListener("mousemove", this.mouseMoveToPtr, false);
        elem.removeEventListener("mouseup", this.mouseUpToPtr, false);
        elem.removeEventListener("mouseleave", this.mouseLeaveToPtr, false);
    }

    public mouseDownToPtr(e: any) {
        this.touchStarted = true;
        sendPtrEvent(e.clientX, e.clientY, e.target, "ptrstart");
    }

    public mouseMoveToPtr(e: any) {
        if (this.touchStarted) {
            sendPtrEvent(e.clientX, e.clientY, e.target, "ptrmove");
        }
    }

    public mouseUpToPtr(e: any) {
        this.touchStarted = false;
        sendPtrEvent(e.clientX, e.clientY, e.target, "ptrend");
    }

    public mouseLeaveToPtr(e: any) {
        this.touchStarted = false;
        sendPtrEvent(e.clientX, e.clientY, e.target, "ptrleave");
    }
}

export default MouseAdaptor;
