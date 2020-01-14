class PtrEvent extends Event {
    // Useless constructor is necessary for the shiftKey attribute not in Event
    // eslint-disable-next-line
    constructor(eventType: string, obj: any) {
        super(eventType, obj);
    }
}

export default PtrEvent;
