tolk 1.0

import "message";

struct Storage {
    counter: uint32
}

fun Storage.load() {
    return Storage.fromCell(contract.getData())
}

fun Storage.save(self) {
    contract.setData(self.toCell)
}

type AllowedMessage = IncreaseCounter | ResetCounter;

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessage.fromSlice(in.body);
    match (msg) {
        IncreaseCounter => {
            var storage = lazy Storage.load();
            storage.counter += msg.increaseBy;
            storage.save();
        },
        ResetCounter => {
            var storage = lazy Storage.load();
            storage.counter = 0;
            storage.save();
        },
        else => {
            assert (in.body.isEmpty()) throw 0xFFFF;
        },
        
    }

fun onBouncedMessage(in: InMessageBounced) {};

get fun currentCounter(): int {
    val storage = lazy Storage.load();
    return storage.counter;
}
get fun initialId(): int {
    val storage = lazy Storage.load();
    return storage.id;
}
}