class Ptr {
    public identifier: number;
    public target: any;
    public clientX: number;
    public clientY: number;
    public pageX: number;
    public pageY: number;

    constructor(props: any) {
        // Hack to make sure webkit's touch ids are > 0.
        this.identifier = props.identifier > 0 ? props.identifier : -props.identifier;
        this.target = props.target;
        this.clientX = props.clientX;
        this.clientY = props.clientY;
        this.pageX = props.pageX;
        this.pageY = props.pageY;
    }
}

export default Ptr;
