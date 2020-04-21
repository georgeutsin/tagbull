class UnityEvent extends Event {
    public detail: string;
    constructor(eventType: string, props: any) {
        super(eventType);
        this.detail = props.detail;
    }
}

export default UnityEvent;
