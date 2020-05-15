async function getAllInList(loadElements: any) {
    let list: any = [];
    let listOffset = 0;
    let listTimestamp = null;

    while (listOffset !== -1) {
        const resp: any = await loadElements({
            offset: listOffset,
            timestamp: listTimestamp,
        });
        list = list.concat(resp.data.data);
        const meta = resp.data.meta ? resp.data.meta : { offset: -1, total_count: -1, timestamp: -1 };
        listOffset = resp.data.data.length === 0 ? -1 : meta.offset;
        listTimestamp = meta.timestamp;
    }

    return list;
}

export {
    getAllInList,
};
