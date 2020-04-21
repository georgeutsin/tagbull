function platformString(): string {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        return "_mobile";

    }
    return "_desktop";
}

function getActorSig(base: string): string {
    // fetching device ID, first try query string, try localStorage and default to random
    const N = 30;
    // tslint:disable-next-line: max-line-length
    const randId = base + platformString() + "-" + Array(N + 1).join((Math.random().toString(36) + "00000000000000000").slice(2, 18)).slice(0, N);
    let queryDeviceId = localStorage.getItem("device_id");
    queryDeviceId = queryDeviceId || randId;

    if (queryDeviceId === randId) {
        localStorage.setItem("device_id", queryDeviceId);
    }

    return queryDeviceId;
}

export {
    platformString,
    getActorSig,
};
